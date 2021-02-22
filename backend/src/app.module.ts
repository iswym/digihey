import * as Joi from '@hapi/joi';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PG_POOL_PROVIDER } from './pg-pool';
import TypeORMConfig from './db/typeorm.config';
import { VehicleTypeModule } from './model/vehicle-type/vehicle-type.module';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				DB_HOST: Joi.string().hostname().required(),
				DB_PORT: Joi.number().port().required(),
				DB_NAME: Joi.string().required(),
				DB_USER: Joi.string().required(),
				DB_PASS: Joi.string().required(),
			}),
		}),
		AuthModule,
		TypeOrmModule.forRoot(TypeORMConfig),
		VehicleTypeModule,
	],
	providers: [PG_POOL_PROVIDER],
	exports: [PG_POOL_PROVIDER],
})
export class AppModule {}
