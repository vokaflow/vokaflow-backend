from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from models.voice import Voice, Gender

class VoiceRepository:
    """Repositorio para gestionar voces"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get(self, voice_id: int) -> Optional[Voice]:
        """Obtener voz por ID"""
        return self.db.query(Voice).filter(Voice.id == voice_id).first()
    
    def get_by_name(self, name: str) -> Optional[Voice]:
        """Obtener voz por nombre"""
        return self.db.query(Voice).filter(Voice.name == name).first()
    
    def get_by_language_and_gender(self, language: str, gender: Gender) -> List[Voice]:
        """Obtener voces por idioma y género"""
        return self.db.query(Voice).filter(
            Voice.language == language,
            Voice.gender == gender,
            Voice.is_active == True
        ).all()
    
    def get_default_voice(self, language: str, gender: Gender) -> Optional[Voice]:
        """Obtener voz predeterminada para un idioma y género"""
        return self.db.query(Voice).filter(
            Voice.language == language,
            Voice.gender == gender,
            Voice.is_default == True,
            Voice.is_active == True
        ).first()
    
    def create(self, **kwargs) -> Voice:
        """Crear nueva voz"""
        voice = Voice(**kwargs)
        self.db.add(voice)
        self.db.commit()
        self.db.refresh(voice)
        return voice
    
    def update(self, voice_id: int, data: Dict[str, Any]) -> Optional[Voice]:
        """Actualizar voz"""
        voice = self.get(voice_id)
        if voice:
            for key, value in data.items():
                setattr(voice, key, value)
            self.db.commit()
            self.db.refresh(voice)
        return voice
    
    def delete(self, voice_id: int) -> bool:
        """Eliminar voz"""
        voice = self.get(voice_id)
        if voice:
            self.db.delete(voice)
            self.db.commit()
            return True
        return False
    
    def set_as_default(self, voice_id: int, language: str, gender: Gender) -> Optional[Voice]:
        """Establecer una voz como predeterminada para un idioma y género"""
        # Primero, quitar el estado predeterminado de cualquier otra voz
        self.db.query(Voice).filter(
            Voice.language == language,
            Voice.gender == gender,
            Voice.is_default == True
        ).update({"is_default": False})
        
        # Luego, establecer la voz seleccionada como predeterminada
        voice = self.get(voice_id)
        if voice and voice.language == language and voice.gender == gender:
            voice.is_default = True
            self.db.commit()
            self.db.refresh(voice)
            return voice
        return None
