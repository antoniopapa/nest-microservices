import { Product } from "../product/product";
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany, PrimaryGeneratedColumn
} from "typeorm";
import { Order } from "../order/order";

@Entity("links")
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  user_id: number;

  @ManyToMany(() => Product)
  @JoinTable({
    name: "link_products",
    joinColumn: { name: "link_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "product_id", referencedColumnName: "id" }
  })
  products: Product[];

  @OneToMany(() => Order, order => order.link, {
    createForeignKeyConstraints: false
  })
  @JoinColumn({
    referencedColumnName: "code",
    name: "code"
  })
  orders: Order[];
}
