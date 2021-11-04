import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { KafkaMessage } from "kafkajs";
import { ProductService } from "../product/product.service";
import { KafkaService } from "./kafka.service";
import { LinkService } from "../link/link.service";

@Controller()
export class KafkaController {

  constructor(
    private productService: ProductService,
    private kafkaService: KafkaService,
    private linkService: LinkService
  ) {
  }

  @MessagePattern("checkout_topic")
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
  }

  async productUpdated(data: any) {
    await this.productService.update(data.id, data);
  }

  async productDeleted(data: any) {
    await this.productService.delete(data);
  }

  async linkCreated(data: any) {
    await this.linkService.save(data);
  }
}
