## Voces Disponibles

VokaFlow incluye un conjunto de voces predefinidas para síntesis de voz en diferentes idiomas y géneros:

### Español
- **Carolina Ruiz** - Voz femenina con acento de España
- **David Martin** - Voz masculina con acento de España

### Inglés
- **Rachel** - Voz femenina con acento americano
- **Mark** - Voz masculina con acento americano

### Alemán
- **Johanna** - Voz femenina
- **MikeyPikey** - Voz masculina

### Uso de Voces

Puedes seleccionar voces específicas al utilizar la API de síntesis de voz:

\`\`\`bash
# Ejemplo de uso con curl
curl -X POST "http://localhost:8000/api/v1/text-to-speech" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hola, esto es una prueba",
    "language": "es",
    "gender": "female",
    "voice_name": "Carolina Ruiz"
  }' \
  --output speech.wav
\`\`\`

También puedes añadir tus propias voces al sistema. Consulta la documentación completa para más detalles.
