# export full db
```bash
docker compose exec -it original-gate-db pg_dump -U postgres -d original-gate -E UTF8 -F p -x --inserts -n public --no-comments > ./init/original-gate-full.sql
```

# backup keep only schema, permissions, flows,... but no data
```bash
docker compose exec -it original-gate-db pg_dump -U postgres -d original-gate -E UTF8 -F p -x \
  --exclude-table-data='ds_*' \
  --exclude-table-data='junction_directus_' \
  --exclude-table-data='directus_activity' \
  --exclude-table-data='directus_revisions' \
  --exclude-table-data='directus_sessions' \
  --inserts -n public --no-comments | sed -e '/^SET/d' > ./init/original-gate-directus-schema.sql
```

# restore
```
docker compose exec -it original-gate-db psql -U postgres -d original-gate -c 'DROP SCHEMA public CASCADE;'
docker compose cp ./init/original-gate-full.sql original-gate-db:/original-gate.sql
docker compose exec -it original-gate-db psql -U postgres -d original-gate -f original-gate.sql
docker compose exec -it original-gate-db rm original-gate.sql
```