import { forwardRef, Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderItem } from "./order-item";
import { Order } from "./order";
import { OrderItemService } from "./order-item.service";
import { LinkModule } from "../link/link.module";
import { ProductModule } from "../product/product.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    LinkModule,
    forwardRef(() => ProductModule),
    UserModule
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderItemService],
  exports: [OrderService]
})

export class OrderModule {
}
