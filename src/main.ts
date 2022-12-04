import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger'
async function bootstrap() {
  const appOptions={cors:true}
  const app = await NestFactory.create(AppModule,appOptions);
  const options=new DocumentBuilder().setTitle('Mestjs').addBearerAuth().build()
  const document=SwaggerModule.createDocument(app,options)
  SwaggerModule.setup('/',app,document)
  await app.listen(3000);
}
bootstrap();
