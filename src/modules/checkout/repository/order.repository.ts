import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { OrderClientModel } from "./order-client.model";
import { OrderItemModel } from "./order-item.model";
import OrderProductModel from "./order-product.model";
import { OrderModel } from "./order.model";
import { v4 as uuidv4 } from "uuid";

export default class OrderRepository implements CheckoutGateway {
    async addOrder(order: Order): Promise<void> {
        try {
            await OrderModel.create(
                {
                    id: order.id.id,
                    client_id: order.client.id.id,
                    products: order.products.map((product) => ({
                        id: uuidv4(),
                        name: product.name,
                        description: product.description,
                        salesPrice: product.salesPrice,
                        orderId: order.id.id,
                        order_product_id: product.id.id,
                    })),
                    status: order.status,
                    createdAt: order.createdAt || new Date(),
                    updatedAt: order.updatedAt || new Date(),
                },
                {
                    include: [{model: OrderItemModel}],
                }
            );
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async findOrder(id: string): Promise<Order | null> {
        try {
            const order = await OrderModel.findOne({
                where: {
                    id: id,
                },
                include: [
                    {model: OrderItemModel, include: [{model: OrderProductModel}]},
                    {model: OrderClientModel}
                ]
            });
            return new Order({
                id: new Id(order.id),
                client: new Client({
                    id: new Id(order.client.id),
                    name: order.client.name,
                    email: order.client.email,
                    address: order.client.address,
                }),
                products: order.products.map((product) => new Product({
                    id: new Id(product.order_product.id),
                    name: product.order_product.name,
                    description: product.order_product.description,
                    salesPrice: product.order_product.salesPrice,
                })),
                status: order.status,
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}