import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('testing')
export class TestingController {
	constructor(@InjectDataSource() protected dataSource: DataSource) {}

	@Delete('all-data')
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteAll() {
		return this.dataSource.query(`
		CREATE OR REPLACE FUNCTION truncate_tables(username IN VARCHAR) RETURNS void AS $$
		DECLARE
    	statements CURSOR FOR
        	SELECT tablename FROM pg_tables
        	WHERE tableowner = username AND schemaname = 'public';
		BEGIN
    		FOR stmt IN statements LOOP
        		EXECUTE 'TRUNCATE TABLE ' || quote_ident(stmt.tablename) || ' CASCADE;';
    		END LOOP;
		END;
		$$ LANGUAGE plpgsql; 
		SELECT truncate_tables('BlogsPlatform_owner');`);
	}
}
