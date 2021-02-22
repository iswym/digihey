
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface UserDetails {
  user: string;
}

@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService) { }

	async validateUser(email: string, pass: string): Promise<UserDetails | undefined> {
		// NOTE: hardcoded users - purpose of this task is not to solve auth persistence
		if (email === 'digi' && pass === 'hey') {
			return { user: 'digi' };
		}
		return undefined;
	}

	async login(userDetails: UserDetails) {
		return {
			access_token: this.jwtService.sign(userDetails),
		};
	}
}
