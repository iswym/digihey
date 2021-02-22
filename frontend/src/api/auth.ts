import Axios from 'axios';
import jwtDecode from 'jwt-decode';

const ACCESS_TOKEN_LOCAL_STORAGE_KEY = 'ACCESS_TOKEN';

export interface TokenDetails {
	iat: number;
	exp: number;
}

export class AuthApi {

	private localStorageKey: string;
	private accessToken: string | null = null;

	constructor(protected readonly loginRoute: string) {
		this.localStorageKey = ACCESS_TOKEN_LOCAL_STORAGE_KEY;
		this.validateAndSetAccessToken(localStorage.getItem(this.localStorageKey));
	}

	login(username: string, password: string): Promise<void> {
		return Axios.post(
			this.loginRoute,
			{
				username,
				password,
			},
		)
			.then(res => this.validateAndSetAccessToken(res?.data?.access_token))
			.catch(() => {
				throw new Error('Login failed');
			});
	}

	getAccessToken(): string | null {
		return this.accessToken;
	}

	getAuthHeaders() {
		return { Authorization: `Bearer ${this.accessToken}` };
	}

	isLoggedIn(): boolean {
		return !!this.accessToken;
	}

	logout() {
		localStorage.removeItem(this.localStorageKey);
		this.accessToken = null;
	}

	private validateAndSetAccessToken(accessToken: string | null) {
		if (!accessToken) {
			this.accessToken = null;
			return;
		}

		const tokenDetails = jwtDecode(accessToken) as TokenDetails;
		if (tokenDetails.exp * 1000 <= Date.now()) {
			this.accessToken = null;
			return;
		}

		this.accessToken = accessToken;
		localStorage.setItem(this.localStorageKey, accessToken);
	}

}

export const authApi = new AuthApi('/api/login');
