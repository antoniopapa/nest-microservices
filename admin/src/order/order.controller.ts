import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { AuthGuard } from "../user/auth.guard";

@UseGuards(AuthGuard)
@Controller("orders")
@UseInterceptors(ClassSerializerInterceptor)
export class OrderController {
  constructor(private orderService: OrderService) {
  }

  @Get()
  all() {
    return this.orderService.find({
      relations: ["order_items"]
    });
  }
}
