import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { RedisService } from "../shared/redis.service";
import { UserService } from "./user.service";
import { User } from "./user";
import { OrderService } from "../order/order.service";


(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userService = app.get(UserService);
  const orderService = app.get(OrderService);

  const users: User[] = await userService.get("users");

  const redisService = app.get(RedisService);
  const client = redisService.getClient();

  for (let i = 0; i < users.length; i++) {
    if (users[i].is_ambassador) {
      const user = users[i];

      const orders = await orderService.find({
        user_id: user["id"]
      });

      const revenue = orders.reduce((s, o) => s + o.total, 0);

      await client.zadd("rankings", revenue, user.name);
    }
  }

  process.exit();
})();
