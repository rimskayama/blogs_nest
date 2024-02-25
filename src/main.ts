import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exceptions/exception.filter';
import { customExceptionFactory } from './exceptions/exception.factory';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			stopAtFirstError: false,
			exceptionFactory: customExceptionFactory,
		})
	);
	app.useGlobalFilters(new HttpExceptionFilter());
	await app.listen(5000);
}
bootstrap();
