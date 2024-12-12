start_service:
	npm run start_service
migrate_latest:
	npx sequelize-cli db:migrate
create_db:
	npx sequelize-cli db:create
start_test:
	npm run test -- --watch