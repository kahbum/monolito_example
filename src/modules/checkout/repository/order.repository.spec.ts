import { Sequelize } from "sequelize-typescript";
import { OrderModel } from "./order.model";
import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Order from "../domain/order.entity";
import Client from "../domain/client.entity";
import OrderRepository from "./order.repository";
import { OrderClientModel } from "./order-client.model";
import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import { ClientModel } from "../../client-adm/repository/client.model";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import { ProductModel } from "../../product-adm/repository/product.model";
import OrderProductModel from "./order-product.model";
import { OrderItemModel } from "./order-item.model";
import { Umzug } from "umzug";
import { migrator } from "../../../infrastructure/test-migrations/migrator";

describe("OrderRepository test", () => {
    let sequelize: Sequelize;

    let migration: Umzug<any>;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        await sequelize.addModels([OrderModel, OrderClientModel, ClientModel, OrderProductModel, ProductModel, OrderItemModel]);
        migration = migrator(sequelize);
        await migration.up();
    });

    afterEach(async () => {
        if (!migration || !sequelize) {
            return;
        }
        migration = migrator(sequelize);
        await migration.down();
        await sequelize.close();
    });

    async function createDefaultOrder(): Promise<Order> {
        const clientfacade = ClientAdmFacadeFactory.create();
        const client = {
            id: "c1",
            name: "Client 1",
            email: "x@x.com",
            document: "document 1",
            street: "street 1",
            number: "number 1",
            complement: "complement 1",
            city: "city 1",
            state: "state 1",
            zipCode: "zipCode 1",
        };
        await clientfacade.add(client);


        const productFacade = ProductAdmFacadeFactory.create();
        const product1Props = {
            id: "p1",
            name: "Product 1",
            description: "Product 1 description",
            salesPrice: 100,
            purchasedPrice: 100,
            stock: 1,
        };
        await productFacade.addProduct(product1Props);
        OrderProductModel.update(
            {
                salesPrice: product1Props.salesPrice,
            },
            {
                where: {
                    id: product1Props.id,
                }
            }
        );

        const product2Props = {
            id: "p2",
            name: "Product 2",
            description: "Product 2 description",
            salesPrice: 200,
            purchasedPrice: 200,
            stock: 2,
        };
        await productFacade.addProduct(product2Props);
        OrderProductModel.update(
            {
                salesPrice: product2Props.salesPrice,
            },
            {
                where: {
                    id: product2Props.id,
                }
            }
        );


        return new Order({
            id: new Id("o1"),
            client: new Client({
                id: new Id(client.id),
                name: client.name,
                email: client.email,
                address: client.street,
            }),
            products: [
                new Product({
                    id: new Id(product1Props.id),
                    name: product1Props.name,
                    description: product1Props.description,
                    salesPrice: product1Props.salesPrice,
                }),
                new Product({
                    id: new Id(product2Props.id),
                    name: product2Props.name,
                    description: product2Props.description,
                    salesPrice: product2Props.salesPrice,
                }),
            ],
        });
    }

    it("should add an order", async () => {
        const inputOrder = await createDefaultOrder();

        const orderRepository = new OrderRepository();
        await orderRepository.addOrder(inputOrder);

        const persistedOrder = await OrderModel.findOne({
            where: {id: inputOrder.id.id},
            include: [
                {model: OrderItemModel, include: [{model: OrderProductModel}]},
                {model: OrderClientModel}
            ]
        });
        expect(persistedOrder.id).toEqual(inputOrder.id.id);
        expect(persistedOrder.client.id).toEqual(inputOrder.client.id.id);
        expect(persistedOrder.client.name).toEqual(inputOrder.client.name);
        expect(persistedOrder.client.email).toEqual(inputOrder.client.email);
        expect(persistedOrder.client.address).toEqual(inputOrder.client.address);
        expect(persistedOrder.products[0].order_product.name).toEqual(inputOrder.products[0].name);
        expect(persistedOrder.products[0].order_product.description).toEqual(inputOrder.products[0].description);
        expect(persistedOrder.products[0].order_product.salesPrice).toEqual(inputOrder.products[0].salesPrice);
        expect(persistedOrder.products[1].order_product.name).toEqual(inputOrder.products[1].name);
        expect(persistedOrder.products[1].order_product.description).toEqual(inputOrder.products[1].description);
        expect(persistedOrder.products[1].order_product.salesPrice).toEqual(inputOrder.products[1].salesPrice);
        expect(persistedOrder.status).toEqual("pending");
    });

    it("should find an order", async () => {
        const inputOrder = await createDefaultOrder();
        inputOrder.approved();

        const orderRepository = new OrderRepository();
        await orderRepository.addOrder(inputOrder);

        const persistedOrder = await orderRepository.findOrder(inputOrder.id.id);
        expect(persistedOrder.id).toEqual(inputOrder.id);
        expect(persistedOrder.client.id).toEqual(inputOrder.client.id);
        expect(persistedOrder.client.name).toEqual(inputOrder.client.name);
        expect(persistedOrder.client.email).toEqual(inputOrder.client.email);
        expect(persistedOrder.client.address).toEqual(inputOrder.client.address);
        expect(persistedOrder.products[0].name).toEqual(inputOrder.products[0].name);
        expect(persistedOrder.products[0].description).toEqual(inputOrder.products[0].description);
        expect(persistedOrder.products[0].salesPrice).toEqual(inputOrder.products[0].salesPrice);
        expect(persistedOrder.products[1].name).toEqual(inputOrder.products[1].name);
        expect(persistedOrder.products[1].description).toEqual(inputOrder.products[1].description);
        expect(persistedOrder.products[1].salesPrice).toEqual(inputOrder.products[1].salesPrice);
        expect(persistedOrder.status).toEqual("approved");

    });
});