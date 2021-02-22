FROM postgres:13.2

ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD mysecretpassword

# default env variables
ENV DB_NAME digihey_db
ENV DB_USER digihey_user
ENV DB_PASS digihey_pass

COPY ./init.sh /docker-entrypoint-initdb.d/
