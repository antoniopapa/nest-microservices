import {
  Body,
  ClassSerializerInterceptor,
  Controller, Get, Post,
  UseInterceptors
} from "@nestjs/common";
import { LinkService } from "./link.service";
import { User } from "../user/user.decorator";
import { Link } from "./link";
import { KafkaService } from "../kafka/kafka.service";

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class LinkController {
  constructor(
    private linkService: LinkService,
    private kafkaService: KafkaService
  ) {
  }

  @Post("links")
  async create(
    @Body("products") products: number[],
    @User() user
  ) {
    const link = await this.linkService.save({
      code: Math.random().toString(36).substr(6),
      user_id: user["id"],
      products: products.map(id => ({ id }))
    });

    await this.kafkaService.emit(["admin_topic", "checkout_topic"], "linkCreated", link);

    return link;
  }

  @Get("stats")
  async stats(@User() user) {
    const links: Link[] = await this.linkService.find({
      user_id: user["id"],
      relations: ["orders"]
    });

    return links.map(link => ({
      code: link.code,
      count: link.orders.length,
      revenue: link.orders.reduce((s, o) => s + o.total, 0)
    }));
  }
}
