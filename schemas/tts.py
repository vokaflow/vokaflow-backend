from pydantic import BaseModel, Field
from typing import List, Optional

class TTSRequest(BaseModel):
    """Solicitud de síntesis de voz"""
    text: str = Field(..., description="Texto a sintetizar")
    language: str = Field("en", description="Código de idioma (en, es, de, etc.)")
    gender: str = Field("female", description="Género de la voz (male, female, neutral)")
    voice_id: Optional[int] = Field(None, description="ID de voz específica")
    voice_name: Optional[str] = Field(None, description="Nombre de voz específica")
    speed: float = Field(1.0, description="Factor de velocidad del habla", ge=0.5, le=2.0)

class VoiceResponse(BaseModel):
    """Respuesta con información de voz"""
    id: int
    name: str
    language: str
    gender: str
    description: Optional[str] = None
    is_default: bool = False

class VoiceListResponse(BaseModel):
    """Respuesta con lista de voces"""
    voices: List[VoiceResponse]
