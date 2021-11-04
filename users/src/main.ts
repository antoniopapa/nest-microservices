import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { Request, Response } from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((req: Request, res: Response, next) => {
    if (req.path === "/") {
      res.send("ok");
      return;
    }
    next();
  });

  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    origin: ["*"],
    credentials: true
  });
  await app.listen(3000);
}

bootstrap();
