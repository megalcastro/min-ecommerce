import { Injectable, NotFoundException } from '@nestjs/common';
//import axios from 'axios';

import { OrderService } from '../order/order.service';
import { ProductService } from '../product/product.service';
import { OrderStatus } from '../order/order-status.enum';



@Injectable()
export class PaymentService {
  constructor(
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
  ) {}

  async createTransaction(orderId: string): Promise<string> {
    // Paso 1: Crear la transacción en PENDING
    const order = await this.orderService.findOne(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    console.log('lol',process.env.BASE_URL_TRANSACTION);
    // const response = await axios.post(`${process.env.BASE_URL_TRANSACTION}/v1/transactions`, {
    //   amount_in_cents: order.totalAmount * 100, // El monto debe estar en centavos
    //   currency: 'COP',
    //   payment_method: 'card',
    //   // Otros parámetros requeridos por Wompi
    // });

    // const transactionId = response.data.id;
    // await this.orderService.update(orderId, { transactionId });

    // return transactionId;
    return ;
  }

  async handlePayment(orderId: string, transactionResult: string): Promise<void> {

    const order = await this.orderService.findOne(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (transactionResult === 'success') {
      await this.orderService.update(orderId, { status: OrderStatus.PAID });

      for (const item of order.items) {
        const product = await this.productService.findOne(item.product.id);
        if (!product) {
          throw new NotFoundException(`Product with ID ${item.product.id} not found`);
        }

        product.stock -= item.quantity;
        await this.productService.update(product.id, { stock: product.stock });
      }
    } else {
      await this.orderService.update(orderId, { status: OrderStatus.FAILED });
    }
  }
}
