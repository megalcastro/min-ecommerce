import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { Product } from '../../entities/product.entity';
import { Customer } from '../../entities/customer.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(orderData: Order): Promise<Order> {
    const customer = await this.customerRepository.findOneBy({ id: orderData.customerId });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${orderData.customerId} not found`);
    }

    const order = this.orderRepository.create({
      ...orderData,
      customer,
    });

    const savedOrder = await this.orderRepository.save(order);

    for (const item of order.items) {
      const product = await this.productRepository.findOneBy({ id: item.product.id });
      if (!product) {
        throw new NotFoundException(`Product with ID ${item.product.id} not found`);
      }
      product.stock -= item.quantity;
      await this.productRepository.save(product);
    }

    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['customer', 'items', 'items.product'] });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: string, orderData: Order): Promise<Order> {
    const order = await this.orderRepository.preload({
      id: id,
      ...orderData,
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const oldOrder = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    await this.orderRepository.save(order);

    if (oldOrder) {
      for (const item of oldOrder.items) {
        const product = await this.productRepository.findOneBy({ id: item.product.id });
        if (product) {
          product.stock += item.quantity;
          await this.productRepository.save(product);
        }
      }
    }

    for (const item of order.items) {
      const product = await this.productRepository.findOneBy({ id: item.product.id });
      if (product) {
        product.stock -= item.quantity;
        await this.productRepository.save(product);
      }
    }

    return order;
  }

  async remove(id: string): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    for (const item of order.items) {
      const product = await this.productRepository.findOneBy({ id: item.product.id });
      if (product) {
        product.stock += item.quantity;
        await this.productRepository.save(product);
      }
    }

    await this.orderRepository.delete(id);
  }
}
