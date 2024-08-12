import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './app/products/products.module';
import { CustomerModule } from './app/customer/customer.module';
import { OrderItemModule } from './app/order-item/order-item.module';
import { OrderModule } from './app/order/order.module';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: '',
    password: '',
    database: 'ecommerce',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),CustomerModule,OrderItemModule,OrderModule,ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
