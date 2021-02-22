import { IsInt, IsString } from 'class-validator';

export interface VehicleTypeDto {
	readonly id: string;
	readonly make: string;
	readonly model: string;
	readonly year: number;
}

export class CreateVehicleTypeDto {
	@IsString()
	readonly make!: string;

	@IsString()
	readonly model!: string;

	@IsInt()
	readonly year!: number;
}
