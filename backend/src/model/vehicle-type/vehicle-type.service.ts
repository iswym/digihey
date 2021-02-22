import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pool } from 'pg';
import { Page, Paging } from 'src/common';
import { VehicleTypeEntity } from 'src/model/vehicle-type/vehicle-type.entity';
import { PG_POOL } from 'src/pg-pool';
import { Repository } from 'typeorm';
import { CreateVehicleTypeDto, VehicleTypeDto } from './vehicle-type.dto';
import { vehicleTypeFuzzySearchWithOffsetAndLimit } from 'src/static-queries/vehicle-type-search';

// NOTE: basically mapper from persistance object to dto (no domain layer currently) so we don't accidentally leak persistance layer stuff
const rowToVehicleTypeDto = (row: { id: string; make: string; model: string; year: number }): VehicleTypeDto => ({
	id: row.id,
	make: row.make,
	model: row.model,
	year: row.year,
});

@Injectable()
export class VehicleTypeService {
	constructor(
		@Inject(PG_POOL) private readonly pool: Pool,
		@InjectRepository(VehicleTypeEntity) private vehicleTypeRepo: Repository<VehicleTypeEntity>,
	) {}

	async searchPage(query: string, { page, size }: Paging = { page: 0, size: 20 }): Promise<Page<VehicleTypeDto>> {
		const rows = await vehicleTypeFuzzySearchWithOffsetAndLimit.run({ limit: String(size), offset: String(page * size), query, score: 0 }, this.pool);
		const total = rows.length !== 0 ? Number(rows[0].count) : 0;

		return {
			data: rows.map(row => rowToVehicleTypeDto(row)),
			total,
		};
	}

	async create(dto: CreateVehicleTypeDto): Promise<VehicleTypeDto> {
		const row = await this.vehicleTypeRepo.save(dto);
		return rowToVehicleTypeDto(row);
	}

	async createMany(dtos: CreateVehicleTypeDto[]): Promise<VehicleTypeDto[]> {
		const res = await this.vehicleTypeRepo.save(dtos);
		return res.map(row => rowToVehicleTypeDto(row));
	}

	async delete(id: string): Promise<void> {
		await this.vehicleTypeRepo.delete(id);
	}
}
