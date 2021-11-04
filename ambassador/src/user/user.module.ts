import { forwardRef, Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AuthController } from "./auth.controller";
import { SharedModule } from "../shared/shared.module";
import { OrderModule } from "../order/order.module";

@Module({
  imports: [
    SharedModule,
    forwardRef(() => OrderModule)
  ],
  controllers: [UserController, AuthController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {
}
