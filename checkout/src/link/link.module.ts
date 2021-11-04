import { Module } from "@nestjs/common";
import { LinkController } from "./link.controller";
import { LinkService } from "./link.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Link } from "./link";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Link]),
    UserModule
  ],
  controllers: [LinkController],
  providers: [LinkService],
  exports: [LinkService]
})
export class LinkModule {
}
