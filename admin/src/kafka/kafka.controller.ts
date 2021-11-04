import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { KafkaMessage } from "kafkajs";
import { LinkService } from "../link/link.service";
import { KafkaService } from "./kafka.service";
import { OrderService } from "../order/order.service";

@Controller()
export class KafkaController {

  constructor(
    private linkService: LinkService,
    private kafkaService: KafkaService,
    private orderService: OrderService) {
  }

  @MessagePattern("admin_topic")
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

  async linkCreated(data: any) {
    await this.linkService.save(data);
  }

  async orderCreated(data: any) {
    await this.orderService.save(data);
  }
}
