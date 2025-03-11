import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { Umzug } from "umzug";
import Id from "../../../modules/@shared/domain/value-object/id.value-object";
import Client from "../../../modules/checkout/domain/client.entity";
import Order from "../../../modules/checkout/domain/order.entity";
import Product from "../../../modules/checkout/domain/product.entity";
import { OrderClientModel } from "../../../modules/checkout/repository/order-client.model";
import { OrderItemModel } from "../../../modules/checkout/repository/order-item.model";
import OrderProductModel from "../../../modules/checkout/repository/order-product.model";
import { OrderModel } from "../../../modules/checkout/repository/order.model";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import InvoiceItemsModel from "../../../modules/invoice/repository/invoice-items.model";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import TransactionModel from "../../../modules/payment/repository/transaction.model";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import { ProductModel } from "../../../modules/product-adm/repository/product.model";
import StoreCatalogProductModel from "../../../modules/store-catalog/repository/product.model";
import { migrator } from "../../test-migrations/migrator";
import { app } from "../express";

describe("E2E test for checkout", () => {

    let sequelize: Sequelize;
    
    let migration: Umzug<any>;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        sequelize.addModels([OrderModel, OrderClientModel, ClientModel, OrderProductModel, ProductModel, OrderItemModel, StoreCatalogProductModel, TransactionModel, InvoiceModel, InvoiceItemsModel]);
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

    it("should create an order", async () => {
        const inputOrder = await createDefaultOrder();
        const checkoutInput = {
            clientId: inputOrder.client.id.id,
            products: [
                {productId: inputOrder.products[0].id.id},
                {productId: inputOrder.products[1].id.id}
            ]
        };

        const response = await request(app)
        .post("/checkout")
        .send(checkoutInput);

        expect(response.status).toBe(200);

        expect(response.body.id).toBeDefined();
        expect(response.body.invoiceId).toBeDefined();
        expect(response.body.status).toEqual("approved");
        expect(response.body.total).toEqual(inputOrder.total);
        expect(response.body.products[0].productId).toEqual(inputOrder.products[0].id.id);
        expect(response.body.products[1].productId).toEqual(inputOrder.products[1].id.id);
    });
});