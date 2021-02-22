import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { AuthController } from 'src/auth/auth.controller';
import { JWTSecret } from './constants';

const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });

@Module({
	imports: [
		passportModule,
		JwtModule.register({
			secret: JWTSecret,
			// NOTE: in real world if we're using JWT on frontend best thing to do would be to make it expire every 10 minutes (or so) and issue a new one
			signOptions: { expiresIn: '3 days' },
		}),
	],
	providers: [
		AuthService,
		LocalStrategy,
		JwtStrategy,
	],
	controllers: [AuthController],
	exports: [
		AuthService,
		passportModule,
	],
})
export class AuthModule {}
