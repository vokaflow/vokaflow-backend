from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional
import io
import logging

from db.session import get_db
from services.tts_service import TTSService
from models.voice import Gender
from db.repositories.voice_repository import VoiceRepository
from schemas.tts import TTSRequest, VoiceResponse, VoiceListResponse

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/synthesize", response_class=StreamingResponse)
async def synthesize_speech(
    request: TTSRequest,
    db: Session = Depends(get_db)
):
    """
    Sintetizar voz a partir de texto
    
    Args:
        request: Datos para la síntesis de voz
        db: Sesión de base de datos
        
    Returns:
        Audio sintetizado
    """
    try:
        tts_service = TTSService(db)
        
        audio_data = await tts_service.synthesize(
            text=request.text,
            language=request.language,
            gender=request.gender,
            voice_id=request.voice_id,
            voice_name=request.voice_name,
            speed=request.speed
        )
        
        if not audio_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No se pudo generar audio con los parámetros proporcionados"
            )
        
        return StreamingResponse(
            io.BytesIO(audio_data),
            media_type="audio/wav",
            headers={"Content-Disposition": "attachment; filename=synthesized_speech.wav"}
        )
    
    except Exception as e:
        logger.error(f"Error en síntesis de voz: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error en síntesis de voz: {str(e)}"
        )

@router.get("/voices", response_model=VoiceListResponse)
async def get_available_voices(
    language: Optional[str] = Query(None, description="Filtrar por idioma"),
    gender: Optional[str] = Query(None, description="Filtrar por género (male, female, neutral)"),
    db: Session = Depends(get_db)
):
    """
    Obtener lista de voces disponibles
    
    Args:
        language: Filtrar por idioma
        gender: Filtrar por género
        db: Sesión de base de datos
        
    Returns:
        Lista de voces disponibles
    """
    try:
        voice_repo = VoiceRepository(db)
        query = db.query(Voice).filter(Voice.is_active == True)
        
        if language:
            query = query.filter(Voice.language == language)
        
        if gender:
            gender_enum = None
            if gender.lower() == "male":
                gender_enum = Gender.MALE
            elif gender.lower() == "female":
                gender_enum = Gender.FEMALE
            elif gender.lower() == "neutral":
                gender_enum = Gender.NEUTRAL
                
            if gender_enum:
                query = query.filter(Voice.gender == gender_enum)
        
        voices = query.all()
        
        return VoiceListResponse(
            voices=[
                VoiceResponse(
                    id=voice.id,
                    name=voice.name,
                    language=voice.language,
                    gender=voice.gender.value,
                    description=voice.description,
                    is_default=voice.is_default
                )
                for voice in voices
            ]
        )
    
    except Exception as e:
        logger.error(f"Error al obtener voces: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener voces: {str(e)}"
        )
