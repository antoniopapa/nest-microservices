import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item";
import { Exclude, Expose } from "class-transformer";
import { Link } from "../link/link";

@Entity("orders")
export class Order {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: true })
  transaction_id: string;

  @Column()
  user_id: number;

  @Column()
  code: string;

  @Column()
  ambassador_email: string;

  @Exclude()
  @Column()
  first_name: string;

  @Exclude()
  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  zip: string;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  order_items: OrderItem[];

  @ManyToOne(() => Link, link => link.orders, {
    createForeignKeyConstraints: false
  })
  @JoinColumn({
    referencedColumnName: "code",
    name: "code"
  })
  link: Link;

  @Expose()
  get name() {
    return `${this.first_name} ${this.last_name}`;
  }

  @Expose()
  get total(): number {
    return this.order_items.reduce((s, i) => s + i.admin_revenue, 0);
  }
}
