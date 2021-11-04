import {
  BadRequestException,
  Body, ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException, Param,
  Post, Put,
  Req,
  Res, UnauthorizedException, UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { Response, Request } from "express";
import { UserService } from "./user.service";
import { TokenService } from "./token.service";
import { AuthGuard } from "./auth.guard";
import { MoreThanOrEqual } from "typeorm";

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private jwtService: JwtService
  ) {
  }

  @Post("register")
  async register(
    @Body() body: RegisterDto,
    @Req() request: Request
  ) {
    const { password_confirm, ...data } = body;

    if (body.password !== password_confirm) {
      throw new BadRequestException("Passwords do not match!");
    }

    const hashed = await bcrypt.hash(body.password, 12);

    return this.userService.save({
      ...data,
      password: hashed
    });
  }

  @Post("login")
  async login(
    @Body("email") email: string,
    @Body("password") password: string,
    @Body("scope") scope: string,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request
  ) {
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (!await bcrypt.compare(password, user.password)) {
      throw new BadRequestException("Invalid credentials");
    }

    const jwt = await this.jwtService.signAsync({
      id: user.id,
      scope
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await this.tokenService.save({
      user_id: user.id,
      token: jwt,
      created_at: new Date(),
      expired_at: tomorrow
    });

    return {
      jwt
    };
  }

  @Get("user/:scope")
  async user(
    @Req() request: Request,
    @Param("scope") requestScope: string
  ) {
    const { id, scope } = await this.jwtService.verify(request.cookies["jwt"]);

    const userToken = await this.tokenService.findOne({
      user_id: id,
      expired_at: MoreThanOrEqual(new Date())
    });

    if (!userToken) {
      throw new UnauthorizedException();
    }

    if (requestScope == "admin" && scope === "ambassador" || requestScope == "ambassador" && scope === "admin") {
      throw new UnauthorizedException();
    }

    return this.userService.findOne({ id });
  }


  @UseGuards(AuthGuard)
  @Post("logout")
  async logout(@Req() request: Request) {
    const cookie = request.cookies["jwt"];

    const { id } = await this.jwtService.verifyAsync(cookie);

    await this.tokenService.delete({
      user_id: id
    });

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
    const cookie = request.cookies["jwt"];

    const { id } = await this.jwtService.verifyAsync(cookie);

    await this.userService.update(id, {
      first_name,
      last_name,
      email
    });

    return this.userService.findOne({ id });
  }

  @UseGuards(AuthGuard)
  @Put("users/password")
  async updatePassword(
    @Req() request: Request,
    @Body("password") password: string,
    @Body("password_confirm") password_confirm: string
  ) {
    if (password !== password_confirm) {
      throw new BadRequestException("Passwords do not match!");
    }

    const cookie = request.cookies["jwt"];

    const { id } = await this.jwtService.verifyAsync(cookie);

    await this.userService.update(id, {
      password: await bcrypt.hash(password, 12)
    });

    return this.userService.findOne({ id });
  }
}
