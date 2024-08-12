import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './databases/database.module';
import { ProductsModule } from './app/products/products.module';
import { CustomerModule } from './app/customer/customer.module';
import { OrderItemModule } from './app/order-item/order-item.module';
import { OrderModule } from './app/order/order.module';


@Module({
  imports: [DatabaseModule, ProductsModule, CustomerModule, OrderItemModule, OrderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
