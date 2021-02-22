import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('vehicle_type')
// NOTE: triple uniqueness constraint so we don't have duplicates
@Unique('make_model_year_are_unique_triple', ['make', 'model', 'year'])
export class VehicleTypeEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column('citext')
	make!: string;

	@Column('citext')
	model!: string;

	@Column('smallint')
	year!: number;
}
