#!/bin/bash
# Script para configurar la estructura de directorios de voces y copiar los archivos de muestra

# Colores para la salida
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Funciones de log
log() {
  echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Directorio base para voces
VOICES_DIR="/opt/vokaflow/voices"

# Crear estructura de directorios
log "Creando estructura de directorios para voces..."
mkdir -p "${VOICES_DIR}/es/female"
mkdir -p "${VOICES_DIR}/es/male"
mkdir -p "${VOICES_DIR}/en/female"
mkdir -p "${VOICES_DIR}/en/male"
mkdir -p "${VOICES_DIR}/de/female"
mkdir -p "${VOICES_DIR}/de/male"
mkdir -p "${VOICES_DIR}/fr/female"
mkdir -p "${VOICES_DIR}/fr/male"
mkdir -p "${VOICES_DIR}/it/female"
mkdir -p "${VOICES_DIR}/it/male"
mkdir -p "${VOICES_DIR}/pt/female"
mkdir -p "${VOICES_DIR}/pt/male"

# Copiar archivos de muestra a los directorios correspondientes
log "Copiando archivos de muestra de voz..."

# Español
cp "/path/to/Carolina Ruiz_es.mp3" "${VOICES_DIR}/es/female/carolina_ruiz.mp3"
cp "/path/to/David Martin_es.mp3" "${VOICES_DIR}/es/male/david_martin.mp3"

# Inglés
cp "/path/to/Rachel_en.mp3" "${VOICES_DIR}/en/female/rachel.mp3"
cp "/path/to/Mark_en.mp3" "${VOICES_DIR}/en/male/mark.mp3"

# Alemán
cp "/path/to/Johanna_de.mp3" "${VOICES_DIR}/de/female/johanna.mp3"
cp "/path/to/MikeyPikey_de.mp3" "${VOICES_DIR}/de/male/mikey_pikey.mp3"

# Establecer permisos adecuados
log "Estableciendo permisos..."
chmod -R 755 "${VOICES_DIR}"
chown -R vokaflow:vokaflow "${VOICES_DIR}"

log "Configuración de voces completada con éxito"
info "Voces disponibles:"
info "- Español: Carolina Ruiz (F), David Martin (M)"
info "- Inglés: Rachel (F), Mark (M)"
info "- Alemán: Johanna (F), MikeyPikey (M)"
