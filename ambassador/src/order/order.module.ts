import { forwardRef, Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./order";
import { LinkModule } from "../link/link.module";
import { ProductModule } from "../product/product.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    forwardRef(() => LinkModule),
    ProductModule,
    forwardRef(() => UserModule)
  ],
  controllers: [],
  providers: [OrderService],
  exports: [OrderService]
})

export class OrderModule {
}
