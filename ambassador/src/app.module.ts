import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { ProductModule } from "./product/product.module";
import { LinkModule } from "./link/link.module";
import { OrderModule } from "./order/order.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true
    }),
    forwardRef(() => UserModule),
    ProductModule,
    LinkModule,
    forwardRef(() => OrderModule)
  ]
})
export class AppModule {
}
