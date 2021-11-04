import { forwardRef, Module } from "@nestjs/common";
import { LinkController } from "./link.controller";
import { LinkService } from "./link.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Link } from "./link";
import { UserModule } from "../user/user.module";
import { KafkaModule } from "../kafka/kafka.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Link]),
    forwardRef(() => UserModule),
    KafkaModule
  ],
  controllers: [LinkController],
  providers: [LinkService],
  exports: [LinkService]
})
export class LinkModule {
}
