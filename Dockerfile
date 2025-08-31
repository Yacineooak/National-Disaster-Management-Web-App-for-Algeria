FROM python:3.11-slim

WORKDIR /app

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copier les requirements et installer les dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code source
COPY . .

# Créer le répertoire pour les modèles
RUN mkdir -p models

# Exposer le port
EXPOSE 3007

# Variables d'environnement
ENV FLASK_APP=ai_service.py
ENV FLASK_ENV=production

# Commande de démarrage
CMD ["gunicorn", "--bind", "0.0.0.0:3007", "--workers", "2", "--timeout", "120", "ai_service:ai_service.app"]

