import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

export const PG_POOL = 'pg_pool_token';

export const PG_POOL_PROVIDER: Provider<Pool> = {
	inject: [ConfigService],
	provide: PG_POOL,
	useFactory: (configService: ConfigService): Pool => {
		const host = configService.get<string>('DB_HOST')!;
		const port = configService.get<number>('DB_PORT')!;
		const database = configService.get<string>('DB_NAME')!;
		const user = configService.get<string>('DB_USER')!;
		const password = configService.get<string>('DB_PASS')!;
		return new Pool({ host, port, database, user, password });
	},
};
