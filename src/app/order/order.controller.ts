import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from '../../entities/order.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() orderData: Order): Promise<Order> {
    return this.orderService.create(orderData);
  }

  @Get()
  async findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order> {
    return this.orderService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() orderData: Order): Promise<Order> {
    return this.orderService.update(id, orderData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.orderService.remove(id);
  }
}
