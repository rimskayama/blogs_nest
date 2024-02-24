import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    stopAtFirstError: false,

    exceptionFactory: (errors) => {
      const errorsForResponse = [];
      errors.forEach((e) => {
        const constraintsKeys = Object.keys(e.constraints);
        constraintsKeys.forEach(ckey => {
          errorsForResponse.push({
            message: e.constraints[ckey],
            field: e.property
          });
        }); 
      });

      throw new BadRequestException(errorsForResponse)
    },
  })
);
  app.useGlobalFilters(new HttpExceptionFilter())
  await app.listen(5000);
}
bootstrap();
