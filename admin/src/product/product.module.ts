import { forwardRef, Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product";
import { UserModule } from "../user/user.module";
import { KafkaModule } from "../kafka/kafka.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    UserModule,
    forwardRef(() => KafkaModule)
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule {
}
