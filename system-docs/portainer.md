```
  # 1. Copy and fill env
  cp .env.deploy.example .env.deploy

  # 2. Build images
  docker compose -f docker-compose.full-dev-deploy.yaml --env-file .env.deploy
  build

  # 3. Push to Docker Hub
  docker login
  docker compose -f docker-compose.full-dev-deploy.yaml --env-file .env.deploy push

  # 4. Portainer → Stacks → Add Stack
  #    Paste docker-compose.full-dev-deploy.yaml content
  #    Set env vars in Portainer UI
```
