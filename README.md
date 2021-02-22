# Digihey interview assignment

### requirements to run
* [Docker](https://www.docker.com/products/docker-desktop)

### how to run
1) position yourself inside `docker` dir
2) run `docker-compose up` (or `docker-compose up -d` if you don't want to block console)
	* when running for 1st time, depending on your machine specs, it can take up to 10 minutes because it builds required images (backend, frontend, db)
	* frontend app will be served on localhost:6002 (you can change frontend port in `docker/.env` file -> `FRONTEND_EXPOSED_PORT`)
	* user/pass = digi/hey

---

### Possible improvements:
* access_token (JWTs) should expire sooner and be reissued - standard problem with stateless auth tokens
* error reporting - currently creation of duplicate vehicle type fails and error message is reported but user has no idea why it failed
* better validation - restrict vehicle type year to reasonable values

---

![Search example](demo/example_1_vehicle_type_search.gif)

![Create example](demo/example_2_create_vehicle_type.gif)

---

### Design:
* for persisting data I've chosen PostgreSQL for 2 reasons:
	* offload triple (make, model, year) uniqueness constraint to PG
	* PG supports wide variety of text search features that work quite well - we're using pg_trgm extension and similarity function
* on backend we're using TypeORM and code-first approach for modeling DB layer (only one entity -> VehicleTypeEntity)
* since text search query is static we're using static validation for it at compile time (PgTyped library)
	* `vehicle-type-search.sql` is validated against DB schema at compile time thus ensuring no runtime errors will happen
	* after validation is successful TypeScript interfaces and code is generated which can be used at runtime
	* we don't commit generated code to Git repository, instead we generate it on the fly during CI/CD
	* since TypeORM doesn't expose native `pg` connection we establish another connection (actually pool) which will be used for PgTyped library (see `pg-pool.ts`)
* authentication
	* since purpose of task isn't auth we use hardcoded user digi/hey (see `auth.service.ts`) and don't persist users
	* user autenticates via HTTP POST /api/login and on successful authentication receives access_token which can be used for auth protected HTTP API calls
	* for auth protected HTTP API calls access_token is sent as Authorization header -> Authorization Bearer $access_token
* provided vehicle type dataset is loaded during DB migrations (hardcoded in `1613805539524-CreateVehicleTypeTable.ts`)
* CI/CD
	* no proper CI/CD due to time constraint
	* what can be partially considered as CI/CD is Docker multi stage build
	* backend Docker multi stage build does couple of things:
		1) spins up Postgres instance, creates DB and user
		2) runs TypeORM backend DB migrations against this new instance -> basically testing whether DB migrations have ran successfully
		3) runs PgTyped static query validation and TypeScript interface/code generation -> basically testing whether queries are valid
		4) creates build artifact and packages it as Docker image
* frontend
	* built with React + MaterialUI
	* only thing not coded during this assignment is `Table.tsx` -> small Table library I've built for private projects (snippet is from my private repo)
* Docker - decided to package backend, frontend and db as docker images for easier use during local deployment:
	* backend image (explained above)
	* frontend image - webserver (Caddy) image which contains frontend build artifact (bundled React app)
	* db image - PostgreSQL image which contains initial SQL script -> creates digihey db and user
* testing -> no testing due to time constraint
