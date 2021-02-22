import { Controller, UseGuards, Post, Request } from '@nestjs/common';
import { AuthService, UserDetails } from './auth.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('/api/login')
export class AuthController {

	constructor(private authService: AuthService) {}

	@UseGuards(AuthGuard('local'))
	@Post('')
	login(@Request() req: { user: UserDetails }) {
		return this.authService.login(req.user);
	}

}
