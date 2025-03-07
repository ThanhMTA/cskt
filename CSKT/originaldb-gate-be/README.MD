# Du an Demo

## !!! Replace all `original-gate` with real project name

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

- Docker
- Docker Compose

## Installation

1. Create `.env` file config from `.env.example`:

   ```bash
   cp .env.example .env
   ```

2. Modify some config if need and start docker-compose:

   ```bash
   docker-compose up
   ```

3. Directus admin is running at: http://localhost:8080/api/, login credentials are in .env
4. Database pgadmin is running at: http://localhost:8080/pgadmin/
5. Swagger open api is running at: http://localhost:8080/api/api/docs/
6. [Open-API specifications](http://localhost:8080/api/server/specs/oas)
7. GrapQL SDL: http://localhost:8080/api/server/specs/graphql, http://localhost:8080/api/server/specs/graphql/system
8. [Client SDK](https://docs.directus.io/guides/sdk/getting-started.html)
9. [Authentication](https://docs.directus.io/reference/authentication.html)
   Default user: user@email.com
   Password: user
10. Run migrations:
    docker exec -it original-gate-api sh
    MIGRATIONS_PATH="./database-migrations/" && npx directus database migrate:latest
    docker compose down
    docker compose up
11. Snapshot database to folder snapshots
    docker compose exec -it original-gate-api npx directus schema snapshot --yes "/directus/snapshots/ten-file-snapshot.yaml"
    docker compose exec -it original-gate-api npx directus schema apply --dry-run "/directus/snapshots/ten-file-snapshot.yaml"
    docker compose exec -it original-gate-api npx directus schema apply --yes "/directus/snapshots/ten-file-snapshot.yaml"
    docker compose down
    docker compose up

## Troubleshooting

1. File permissions

sudo chown -R $(id -u):$(id -g) ./
sudo chmod -R 777 ./pgadmin-data

2. Push and pull from git: [Sharing Git credentials with your container](https://code.visualstudio.com/remote/advancedcontainers/sharing-git-credentials)
#   c s k t _ b e  
 