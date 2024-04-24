import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('testing')
export class TestingController {
	constructor(@InjectDataSource() protected dataSource: DataSource) {}

	@Delete('all-data')
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteAll() {
		await this.dataSource.query(`
		DELETE FROM public."CommentLikes";
		DELETE FROM public."PostLikes";
		DELETE FROM public."Comments";
		DELETE FROM public."Posts";
		DELETE FROM public."Devices";
		DELETE FROM public."Users";
		DELETE FROM public."Blogs";
		`);
	}
}
