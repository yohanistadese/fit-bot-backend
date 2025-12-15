#!/bin/bash

# Pull latest code
sudo git pull

# Run database migrations
npx sequelize-cli db:migrate --config config/config.js

# Stop and remove containers
sudo docker-compose down

# Rebuild and start containers in detached mode
sudo docker-compose up --build -d
