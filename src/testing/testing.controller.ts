import { InjectDataSource } from '@nestjs/typeorm';
import { Controller, Delete, HttpCode } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('testing')
export class TestingController {
	constructor(@InjectDataSource() protected dataSource: DataSource) {}

	@Delete('all-data')
	@HttpCode(204)
	async deleteAll() {
		return this.dataSource.query(`SELECT truncate_tables('rimskayama');`);
	}
}
