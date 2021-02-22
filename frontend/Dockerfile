# BUILD stage - build requires devDependencies
FROM node:12.14 as builder

ENV NODE_ENV build
WORKDIR /home/node

COPY package.json package-lock.json /home/node/
RUN npm ci 

COPY . /home/node/
RUN npm run build

# RELEASE stage

FROM abiosoft/caddy

COPY --from=builder /home/node/Caddyfile /etc/
COPY --from=builder /home/node/build/ /srv/
