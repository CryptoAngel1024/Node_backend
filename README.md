# Backend

|  Development Branch/dev  |  Current Release/master |


API, authentication, deployment scripts
### Branching
Branch *develop* pushes to local dev server on wks1.
Branch *master* pushes to prod machine on-premise.

.gitlab-ci.yml holds the deployment instructions.
## Infrastructure

Docker containers for database and API+Auth
### Database: PostgreSQL
Database structure in `halley.sql` and [Adminer](http://localhost/adminer) to inspect it

### API + Auth
NodeJS 

### Run
Fill the required credentials in `.env` file first.

The command below will then automatically launch everything needed in dev mode
```
docker-compose up -d
```

Kill everything with 
```
docker-compose down
```

## Services
### API Documentation
The documentation for the API comes included in `swagger/halleyapi.yaml` file, following the OAS3 definitions.

A Swagger ui is spun up with the docker commands above, and available for consumption at [address/swagger](http://localhost/swagger)

### Adminer
To explore the database there is an Adminer included in the Docker command above, available at [address/adminer](http://localhost/adminer)