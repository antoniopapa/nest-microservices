import { CACHE_MANAGER, Controller, Inject } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { KafkaMessage } from "kafkajs";
import { ProductService } from "../product/product.service";
import { Cache } from "cache-manager";
import { KafkaService } from "./kafka.service";
import { OrderService } from "../order/order.service";

@Controller()
export class KafkaController {

  constructor(
    private productService: ProductService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private kafkaService: KafkaService,
    private orderService: OrderService
  ) {
  }

  @MessagePattern("ambassador_topic")
  async event(@Payload() message: KafkaMessage) {
    try {
      await this[message.key.toString()](message.value);
    } catch (e) {
      await this.kafkaService.save({
        key: message.key.toString(),
        value: message.value,
        error: e.message
      });
    }
  }

  async productCreated(data: any) {
    await this.productService.save(data);

    await this.cacheManager.del("products_frontend");
    await this.cacheManager.del("products_backend");
  }

  async productUpdated(data: any) {
    await this.productService.update(data.id, data);

    await this.cacheManager.del("products_frontend");
    await this.cacheManager.del("products_backend");
  }

  async productDeleted(data: any) {
    await this.productService.delete(data);

    await this.cacheManager.del("products_frontend");
    await this.cacheManager.del("products_backend");
  }

  async orderCreated(data: any) {
    await this.orderService.save({
      id: data.id,
      code: data.code,
      user_id: data.user_id,
      total: data.ambassador_revenue
    });
  }
}
