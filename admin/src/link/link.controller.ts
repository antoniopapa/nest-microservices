import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { LinkService } from "./link.service";
import { AuthGuard } from "../user/auth.guard";

@UseGuards(AuthGuard)
@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class LinkController {
  constructor(
    private linkService: LinkService
  ) {
  }

  @Get("users/:id/links")
  async all(@Param("id") id: number) {
    return this.linkService.find({
      user: id,
      relations: ["orders", "orders.order_items"]
    });
  }
}
