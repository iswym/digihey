# BUILD stage
# 1) install deps and devDeps - required to produce build artifact
# 2) start Postgres and run migrations
# 3) PgTyped - static validation of SQL against Postgres schema & code gen for those queries
# 4) produce build artifact
FROM postgres:13.2-alpine as builder

# postgres envs
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD mysecretpassword
ENV DB_NAME digihey_db
ENV DB_USER digihey_user
ENV DB_PASS digihey_pass

COPY . /home/
COPY ./db/init.sh /docker-entrypoint-initdb.d/

RUN \
	docker-entrypoint.sh -c 'shared_buffers=256MB' -c 'max_connections=200' & \
	cd home && \
	apk add --update nodejs npm && \
	npm ci && \
	npm run typeorm:run && \
	npm run pgtyped && \
	npm run build

# POST BUILD stage - build artifact only needs deps (not devDeps)
FROM node:12.14-alpine as post_builder

ENV NODE_ENV production
WORKDIR /home/node

COPY package.json package-lock.json /home/node/
RUN npm ci

# RELEASE stage
FROM node:12.14-alpine
ENV NODE_ENV production
WORKDIR /home/node

COPY --from=builder /home/package*.json /home/node/
COPY --from=builder /home/dist/ /home/node/dist/
COPY --from=post_builder /home/node/node_modules/ /home/node/node_modules/

CMD ["node", "dist/main.js"]
