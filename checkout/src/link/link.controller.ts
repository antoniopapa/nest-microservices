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
import { UserService } from "../user/user.service";

@Controller("links")
@UseInterceptors(ClassSerializerInterceptor)
export class LinkController {
  constructor(
    private linkService: LinkService,
    private userService: UserService
  ) {
  }

  @Get(":code")
  async link(@Param("code") code: string) {
    const link = await this.linkService.findOne({
      code,
      relations: ["products"]
    });

    link["user"] = await this.userService.get(`users/${link.user_id}`);

    return link;
  }
}
