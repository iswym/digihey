import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleTypeEntity } from './vehicle-type.entity';
import { VehicleTypeController } from './vehicle-type.controller';
import { VehicleTypeService } from './vehicle-type.service';

@Module({
	imports: [TypeOrmModule.forFeature([VehicleTypeEntity])],
	controllers: [VehicleTypeController],
	providers: [VehicleTypeService],
	exports: [VehicleTypeService],
})
export class VehicleTypeModule {}
