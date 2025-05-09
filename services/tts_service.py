import os
import logging
import tempfile
import requests
import json
from typing import Dict, Any, Optional, List, BinaryIO
import torch
from pathlib import Path

from db.repositories.voice_repository import VoiceRepository
from models.voice import Gender

logger = logging.getLogger(__name__)

class TTSService:
    """Servicio para síntesis de voz con selección de voces"""
    
    def __init__(self, db=None):
        self.api_url = os.getenv("TTS_API_URL", "http://xtts:8000")
        self.model_version = os.getenv("TTS_MODEL_VERSION", "v2")
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.db = db
        logger.info(f"Initialized TTSService with model version {self.model_version} on {self.device}")
    
    async def synthesize(
        self, 
        text: str, 
        language: str = "en",
        gender: str = "female",
        voice_id: Optional[int] = None,
        voice_name: Optional[str] = None,
        speed: float = 1.0
    ) -> bytes:
        """
        Sintetizar voz a partir de texto
        
        Args:
            text: Texto a sintetizar
            language: Código de idioma (en, es, de, etc.)
            gender: Género de la voz (male, female, neutral)
            voice_id: ID de la voz específica (opcional)
            voice_name: Nombre de la voz específica (opcional)
            speed: Factor de velocidad del habla
            
        Returns:
            Datos de audio como bytes
        """
        logger.info(f"Sintetizando voz para texto: {text[:50]}...")
        
        try:
            # Determinar la voz a utilizar
            voice_sample_path = await self._get_voice_sample_path(language, gender, voice_id, voice_name)
            
            if not voice_sample_path:
                logger.warning(f"No se encontró una voz adecuada para {language}, {gender}")
                return None
            
            data = {
                "text": text,
                "language": language,
                "speed": speed
            }
            
            files = {}
            
            # Usar la muestra de voz
            with open(voice_sample_path, "rb") as voice_file:
                files["voice_sample"] = voice_file
            
            response = requests.post(
                f"{self.api_url}/synthesize",
                data=data,
                files=files
            )
            
            if response.status_code != 200:
                logger.error(f"Error en API de TTS: {response.text}")
                raise Exception(f"Error en API de TTS: {response.status_code}")
            
            audio_data = response.content
            logger.info(f"Síntesis de voz completada con éxito")
            return audio_data
                
        except Exception as e:
            logger.error(f"Error al sintetizar voz: {e}")
            raise
    
    async def _get_voice_sample_path(
        self,
        language: str,
        gender_str: str,
        voice_id: Optional[int] = None,
        voice_name: Optional[str] = None
    ) -> Optional[str]:
        """
        Obtener la ruta de la muestra de voz según los criterios
        
        Args:
            language: Código de idioma
            gender_str: Género como string
            voice_id: ID de voz específica
            voice_name: Nombre de voz específica
            
        Returns:
            Ruta al archivo de muestra de voz
        """
        # Convertir string de género a enum
        gender = Gender.FEMALE
        if gender_str.lower() == "male":
            gender = Gender.MALE
        elif gender_str.lower() == "neutral":
            gender = Gender.NEUTRAL
        
        # Si no hay base de datos, usar rutas predeterminadas
        if not self.db:
            voices_dir = "/opt/vokaflow/voices"
            gender_dir = gender.value
            
            # Buscar en el directorio correspondiente
            path = os.path.join(voices_dir, language, gender_dir)
            if os.path.exists(path):
                files = os.listdir(path)
                if files:
                    # Usar el primer archivo encontrado
                    return os.path.join(path, files[0])
            
            # Si no se encuentra, intentar con inglés como fallback
            if language != "en":
                path = os.path.join(voices_dir, "en", gender_dir)
                if os.path.exists(path):
                    files = os.listdir(path)
                    if files:
                        return os.path.join(path, files[0])
            
            return None
        
        # Si hay base de datos, usar el repositorio
        voice_repo = VoiceRepository(self.db)
        voice = None
        
        # Buscar por ID si se proporciona
        if voice_id:
            voice = voice_repo.get(voice_id)
        
        # Buscar por nombre si se proporciona
        elif voice_name:
            voice = voice_repo.get_by_name(voice_name)
        
        # Buscar voz predeterminada para el idioma y género
        else:
            voice = voice_repo.get_default_voice(language, gender)
            
            # Si no hay voz predeterminada para ese idioma, intentar con inglés
            if not voice and language != "en":
                voice = voice_repo.get_default_voice("en", gender)
        
        # Devolver la ruta del archivo si se encontró una voz
        if voice and os.path.exists(voice.file_path):
            return voice.file_path
        
        return None
