make start:
	curl http://localhost:5001/api/v1/data

install:
	npm ci

start-frontend:
	cd frontend && npm start

start-backend:
	npm start

start:
	make start-backend & make start-frontend