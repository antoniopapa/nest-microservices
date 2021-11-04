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

  app.setGlobalPrefix("api/checkout");
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    origin: ["http://localhost:3000", "http://localhost:4000", "http://localhost:5000"],
    credentials: true
  });
  await app.listen(3000);
}

bootstrap();
