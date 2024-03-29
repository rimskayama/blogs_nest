import { INestApplication, ValidationPipe } from '@nestjs/common';
import { customExceptionFactory } from './exceptions/exception.factory';
import { HttpExceptionFilter } from './exceptions/exception.filter';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

export const appSettings = (app: INestApplication) => {
	app.use(cookieParser());
	useContainer(app.select(AppModule), { fallbackOnErrors: true });
	app.enableCors();
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			stopAtFirstError: false,
			exceptionFactory: customExceptionFactory,
		})
	);
	app.useGlobalFilters(new HttpExceptionFilter());
};
