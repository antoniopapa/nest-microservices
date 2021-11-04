import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { OrderService } from "./order.service";
import { Column, createConnection, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity("orders")
class Order {
  @PrimaryColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  code: string;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  order_items: OrderItem[];
}

@Entity("order_items")
class OrderItem {
  @PrimaryColumn()
  id: number;

  @Column()
  ambassador_revenue: number;

  @ManyToOne(() => Order, order => order.order_items)
  @JoinColumn({ name: "order_id" })
  order: Order;
}

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);

  const orderService = app.get(OrderService);

  const connection = await createConnection({
    name: "old",
    type: "mysql",
    host: "host.docker.internal",
    port: 33066,
    username: "root",
    password: "root",
    database: "ambassador",
    entities: [Order, OrderItem]
  });

  const orders = await connection.manager.find(Order, {
    relations: ["order_items"]
  });

  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];

    let total = 0;

    for (let j = 0; j < order.order_items.length; j++) {
      total += order.order_items[j].ambassador_revenue;
    }

    await orderService.save({
      id: order.id,
      user_id: order.user_id,
      code: order.code,
      total
    });
  }

  process.exit();
})();
