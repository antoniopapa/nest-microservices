import {
  Body, ClassSerializerInterceptor,
  Controller,
  Get,
  Post, Put,
  Req,
  Res, UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";
import { UserService } from "./user.service";
import { Response, Request } from "express";
import { AuthGuard } from "./auth.guard";
import { User } from "./user.decorator";
import { OrderService } from "../order/order.service";

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {

  constructor(
    private userService: UserService,
    private orderService: OrderService
  ) {
  }

  @Post("register")
  async register(
    @Body() body: RegisterDto,
    @Req() request: Request
  ) {
    return this.userService.post("register", {
      ...body,
      is_ambassador: true
    });
  }

  @Post("login")
  async login(
    @Body("email") email: string,
    @Body("password") password: string,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request
  ) {
    const resp = await this.userService.post("login", {
      email,
      password,
      scope: "ambassador"
    });

    response.cookie("jwt", resp["jwt"], { httpOnly: true });

    return {
      message: "success"
    };
  }

  @Get("user")
  async user(@User() user) {
    const orders = await this.orderService.find({
      user_id: user["id"]
    });

    user["revenue"] = orders.reduce((s, o) => s + o.total, 0);

    return user;
  }

  @UseGuards(AuthGuard)
  @Post("logout")
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    await this.userService.post("logout", {}, request.cookies["jwt"]);

    response.clearCookie("jwt");

    return {
      message: "success"
    };
  }

  @UseGuards(AuthGuard)
  @Put("users/info")
  async updateInfo(
    @Req() request: Request,
    @Body("first_name") first_name: string,
    @Body("last_name") last_name: string,
    @Body("email") email: string
  ) {
    return this.userService.put("users/info", {
      first_name,
      last_name,
      email
    }, request.cookies["jwt"]);
  }

  @UseGuards(AuthGuard)
  @Put("users/password")
  async updatePassword(
    @Req() request: Request,
    @Body("password") password: string,
    @Body("password_confirm") password_confirm: string
  ) {
    return this.userService.put("users/password", {
      password,
      password_confirm
    }, request.cookies["jwt"]);
  }
}
