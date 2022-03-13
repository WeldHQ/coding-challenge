#!/bin/bash

# Ensure conf files exist
if [ ! -f ./.env ]; then
    cp ./.env.dist ./.env
fi

# Run the thing
docker-compose -f docker-compose-release.yaml down --remove-orphans || true
docker-compose -f docker-compose-release.yaml build
docker-compose -f docker-compose-release.yaml up