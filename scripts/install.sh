#!/bin/bash

# install.sh

set -e

# Function to log messages
log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "Iniciando script de instalación..."

# Actualizar el sistema
log "Actualizando el sistema..."
sudo apt update
sudo apt upgrade -y

# Instalar dependencias
log "Instalando dependencias..."
sudo apt install -y python3 python3-pip git

# Clonar el repositorio
log "Clonando el repositorio..."
git clone https://github.com/tu_repositorio/tu_proyecto.git /opt/tu_proyecto

# Cambiar al directorio del proyecto
cd /opt/tu_proyecto

# Instalar dependencias de Python
log "Instalando dependencias de Python..."
pip3 install -r requirements.txt

# Configurar voces
log "Configurando voces para síntesis de voz..."
./scripts/setup_voices.sh
./scripts/init_voices.py

log "Voces configuradas correctamente"

log "Script de instalación completado."
