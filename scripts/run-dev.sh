#!/bin/bash

# Ensure conf files exist
if [ ! -f ./.env ]; then
    cp ./.env.dist ./.env
fi

# Run the thing
docker-compose down --remove-orphans || true
docker-compose build
docker-compose up