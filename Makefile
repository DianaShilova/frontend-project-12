make start:
	curl http://localhost:5001/api/v1/data

install:
	npm ci && cd ./frontend && npm ci

start-frontend:
	cd frontend && npm start

start-backend:
	npm start

start:
	make start-backend 

build:
	cd ./frontend && npm ci && npm run build