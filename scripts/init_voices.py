#!/usr/bin/env python3
"""
Script para inicializar las voces en la base de datos
"""

import os
import sys
import logging
from pathlib import Path

# Añadir el directorio raíz al path para importar módulos
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from db.session import SessionLocal
from db.repositories.voice_repository import VoiceRepository
from models.voice import Gender

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)

# Directorio base de voces
VOICES_DIR = "/opt/vokaflow/voices"

# Mapeo de idiomas
LANGUAGE_NAMES = {
    "es": "Español",
    "en": "Inglés",
    "de": "Alemán",
    "fr": "Francés",
    "it": "Italiano",
    "pt": "Portugués",
}

# Información de voces predefinidas
PREDEFINED_VOICES = [
    # Español
    {
        "name": "Carolina Ruiz",
        "language": "es",
        "gender": Gender.FEMALE,
        "file_path": "es/female/carolina_ruiz.mp3",
        "description": "Voz femenina en español con acento de España",
        "is_default": True
    },
    {
        "name": "David Martin",
        "language": "es",
        "gender": Gender.MALE,
        "file_path": "es/male/david_martin.mp3",
        "description": "Voz masculina en español con acento de España",
        "is_default": True
    },
    
    # Inglés
    {
        "name": "Rachel",
        "language": "en",
        "gender": Gender.FEMALE,
        "file_path": "en/female/rachel.mp3",
        "description": "Voz femenina en inglés con acento americano",
        "is_default": True
    },
    {
        "name": "Mark",
        "language": "en",
        "gender": Gender.MALE,
        "file_path": "en/male/mark.mp3",
        "description": "Voz masculina en inglés con acento americano",
        "is_default": True
    },
    
    # Alemán
    {
        "name": "Johanna",
        "language": "de",
        "gender": Gender.FEMALE,
        "file_path": "de/female/johanna.mp3",
        "description": "Voz femenina en alemán",
        "is_default": True
    },
    {
        "name": "MikeyPikey",
        "language": "de",
        "gender": Gender.MALE,
        "file_path": "de/male/mikey_pikey.mp3",
        "description": "Voz masculina en alemán",
        "is_default": True
    },
]

def init_voices():
    """Inicializar voces en la base de datos"""
    logger.info("Inicializando voces en la base de datos...")
    
    # Crear sesión de base de datos
    db = SessionLocal()
    voice_repo = VoiceRepository(db)
    
    try:
        # Registrar cada voz predefinida
        for voice_data in PREDEFINED_VOICES:
            # Comprobar si la voz ya existe
            existing_voice = voice_repo.get_by_name(voice_data["name"])
            
            if existing_voice:
                logger.info(f"La voz '{voice_data['name']}' ya existe en la base de datos")
                continue
            
            # Construir la ruta completa del archivo
            full_path = os.path.join(VOICES_DIR, voice_data["file_path"])
            
            # Verificar que el archivo existe
            if not os.path.exists(full_path):
                logger.warning(f"El archivo de voz no existe: {full_path}")
                continue
            
            # Crear la voz en la base de datos
            voice = voice_repo.create(
                name=voice_data["name"],
                language=voice_data["language"],
                gender=voice_data["gender"],
                file_path=full_path,
                description=voice_data["description"],
                is_default=voice_data["is_default"],
                is_active=True
            )
            
            logger.info(f"Voz registrada: {voice.name} ({voice.language}, {voice.gender.value})")
        
        logger.info("Inicialización de voces completada con éxito")
    
    except Exception as e:
        logger.error(f"Error al inicializar voces: {e}")
    
    finally:
        db.close()

if __name__ == "__main__":
    init_voices()
