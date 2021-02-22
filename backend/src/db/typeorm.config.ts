import * as Path from 'path';
import { ConnectionOptions } from 'typeorm';

require('dotenv').config();

// NOTE: we could also add env validation here since typeorm package.json scripts use this file (for generating migrations)

const envs = process.env;
const config: ConnectionOptions = {
	type: 'postgres',
	host: envs.DB_HOST,
	// host: 'localhost',
	port: Number(envs.DB_PORT),
	// port: 5432,
	username: envs.DB_USER,
	// username: 'sl_user',
	password: envs.DB_PASS,
	// password: 'sl_pass',
	database: envs.DB_NAME,
	// database: 'smart_lighting',
	entities: [`${Path.join(__dirname, '..') }/**/*.entity{.ts,.js}`],
	synchronize: false,
	migrations: [`${__dirname }/migrations/**/*{.ts,.js}`],
	migrationsRun: true,
	cli: {
		migrationsDir: 'src/db/migrations',
	},
	// logging: ["query", "error"]
};

export default config;
