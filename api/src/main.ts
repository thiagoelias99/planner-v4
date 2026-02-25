import 'dotenv/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe } from "@nestjs/common"
import { useContainer } from "class-validator"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import helmet from 'helmet'
import cookieParser from 'cookie-parser'


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.use(cookieParser())

  app.setGlobalPrefix('v1')

  const corsOrigins = process.env.ALLOWED_ORIGINS?.split(';') || ['http://localhost:3000']
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  const config = new DocumentBuilder()
    .setTitle('TE Planner API')
    .setDescription('API documentation for TE Planner platform.')
    .setVersion('1.0')
    .setContact('Thiago Elias', 'https://github.com/thiagoelias99', 'thiagoelias99@gmail.com')
    .setLicense('Proprietary', 'Private project - All rights reserved. Unauthorized use prohibited.')
    // .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('v1/docs', app, document)

  app.use(helmet())

  await app.listen(process.env.PORT ?? 3333)
  console.log(`Application is running on: ${await app.getUrl()}`)
  console.log(`Swagger is available on: ${await app.getUrl()}/v1/docs`)
}
bootstrap()
