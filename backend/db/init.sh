#!/bin/sh
set -e

# create db
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	create database $DB_NAME;
	create user $DB_USER with encrypted password '$DB_PASS';
	grant all privileges on database $DB_NAME to $DB_USER;
EOSQL

# create extension in new db
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB_NAME" <<-EOSQL
	create extension if not exists "uuid-ossp";
EOSQL
