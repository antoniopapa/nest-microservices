import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { ProductService } from "./product.service";
import { createConnection } from "typeorm";
import { Product } from "./product";

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);

  const productService = app.get(ProductService);

  const connection = await createConnection({
    name: "old",
    type: "mysql",
    host: "host.docker.internal",
    port: 33066,
    username: "root",
    password: "root",
    database: "ambassador",
    entities: [Product]
  });

  const products = await connection.manager.find(Product);

  for (let i = 0; i < products.length; i++) {
    await productService.save(products[i]);
  }

  process.exit();
})();
