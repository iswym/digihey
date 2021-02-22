import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Page } from 'src/common';
import { CreateVehicleTypeDto, VehicleTypeDto } from 'src/model/vehicle-type/vehicle-type.dto';
import { VehicleTypeService } from 'src/model/vehicle-type/vehicle-type.service';

@UseGuards(AuthGuard('jwt'))
@Controller('/api/vehicle-types')
export class VehicleTypeController {
	constructor(private readonly service: VehicleTypeService) {}

	@Get('/page')
	searchPage(
		@Query('query') query: string,
		@Query('page', ParseIntPipe) page: number,
		@Query('size', ParseIntPipe) size: number,
	): Promise<Page<VehicleTypeDto>> {
		return this.service.searchPage(query, { page, size });
	}

	@Post('/')
	create(@Body() dto: CreateVehicleTypeDto): Promise<VehicleTypeDto> {
		return this.service.create(dto);
	}

	@Post('/bulk')
	createMany(@Body(new ParseArrayPipe({ items: CreateVehicleTypeDto })) dtos: CreateVehicleTypeDto[]): Promise<VehicleTypeDto[]> {
		return this.service.createMany(dtos);
	}

	@Delete('/:id')
	deleteVehicleType(@Param('id') id: string): Promise<void> {
		return this.service.delete(id);
	}
}
