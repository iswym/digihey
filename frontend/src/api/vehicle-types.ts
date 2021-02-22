import Axios from 'axios';
import { authApi } from './auth';

export interface Page<T> {
	data: T[];
	total: number;
}

export interface VehicleType {
	id: string;
	make: string;
	model: string;
	year: number;
}

export interface VehicleTypeCreate {
	make: string;
	model: string;
	year: number;
}

// NOTE: response validation could be implemented
export class VehicleTypesApi {

	constructor(protected readonly baseUrl: string) {}

	async searchPage(query: string, page: number, size: number): Promise<Page<VehicleType>> {
		const res = await Axios.get(`${this.baseUrl}/page?query=${query}&page=${page}&size=${size}`, { headers: authApi.getAuthHeaders() });
		return res.data;
	}

	async create(vehicleTypeCreate: VehicleTypeCreate): Promise<VehicleType> {
		const res = await Axios.post(this.baseUrl, vehicleTypeCreate, { headers: authApi.getAuthHeaders() });
		return res.data;
	}

	async delete(id: string): Promise<void> {
		await Axios.delete(`${this.baseUrl}/${id}`, { headers: authApi.getAuthHeaders() });
	}
}

export const vehicleTypeApi = new VehicleTypesApi('/api/vehicle-types');
