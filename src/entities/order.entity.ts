import { Entity, PrimaryGeneratedColumn, Column, OneToMany,ManyToOne } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Customer } from './customer.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: number;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  @Column()
  totalAmount: number;

  @Column()
  status: string;

}
