import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { UserToken } from "./userToken";
import { TokenService } from "./token.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserToken]),
    JwtModule.register({
      secret: "secret",
      signOptions: { expiresIn: "1d" }
    })
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, TokenService]
})
export class UserModule {
}
