import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AuthController } from "./auth.controller";

@Module({
  controllers: [UserController, AuthController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {
}
