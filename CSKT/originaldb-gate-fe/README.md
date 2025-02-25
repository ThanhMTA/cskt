chạy dự án
cp .env.example .env.development
npm i
npm run dev


deploy

staging: docker compose -f docker-compose.staging.yml --env-file .env.staging up -d --build

production: docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build