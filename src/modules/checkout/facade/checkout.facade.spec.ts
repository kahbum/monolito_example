import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { migrator } from "../../../infrastructure/test-migrations/migrator";
import { OrderModel } from "../repository/order.model";
import { OrderClientModel } from "../repository/order-client.model";
import { ClientModel } from "../../client-adm/repository/client.model";
import OrderProductModel from "../repository/order-product.model";
import { ProductModel } from "../../product-adm/repository/product.model";
import { OrderItemModel } from "../repository/order-item.model";
import Order from "../domain/order.entity";
import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";
import StoreCatalogProductModel from "../../store-catalog/repository/product.model";
import TransactionModel from "../../payment/repository/transaction.model";
import { InvoiceModel } from "../../invoice/repository/invoice.model";
import InvoiceItemsModel from "../../invoice/repository/invoice-items.model";
import ChecoutFacadeFactory from "../factory/checkout.facade.factory";

describe("CheckoutFacade test", () => {
    let sequelize: Sequelize;

    let migration: Umzug<any>;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        await sequelize.addModels([OrderModel, OrderClientModel, ClientModel, OrderProductModel, ProductModel, OrderItemModel, StoreCatalogProductModel, TransactionModel, InvoiceModel, InvoiceItemsModel]);
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

    let createPendingOrder = () => createDefaultOrder(false);
    let createApprovedOrder = () => createDefaultOrder(true);

    async function createDefaultOrder(approved: boolean): Promise<Order> {
        const basePrice = approved ? 100 : 10;
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
            salesPrice: basePrice,
            purchasedPrice: basePrice,
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
            salesPrice: 2 * basePrice,
            purchasedPrice: 2 * basePrice,
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

    it("should add a pending order", async () => {
        const checkoutFacade = ChecoutFacadeFactory.create();

        const inputOrder = await createPendingOrder();

        const result = await checkoutFacade.placeOrder({
            clientId: inputOrder.client.id.id,
            products: [
                {productId: inputOrder.products[0].id.id},
                {productId: inputOrder.products[1].id.id}
            ]
        });

        expect(result.id).toBeDefined();
        expect(result.invoiceId).toBeNull();
        expect(result.status).toEqual("pending");
        expect(result.total).toEqual(inputOrder.total);
        expect(result.products[0].productId).toEqual(inputOrder.products[0].id.id);
        expect(result.products[1].productId).toEqual(inputOrder.products[1].id.id);
    });

    it("should add an approved order", async () => {
        const checkoutFacade = ChecoutFacadeFactory.create();

        const inputOrder = await createApprovedOrder();

        const result = await checkoutFacade.placeOrder({
            clientId: inputOrder.client.id.id,
            products: [
                {productId: inputOrder.products[0].id.id},
                {productId: inputOrder.products[1].id.id}
            ]
        });

        expect(result.id).toBeDefined();
        expect(result.invoiceId).toBeDefined();
        expect(result.status).toEqual("approved");
        expect(result.total).toEqual(inputOrder.total);
        expect(result.products[0].productId).toEqual(inputOrder.products[0].id.id);
        expect(result.products[1].productId).toEqual(inputOrder.products[1].id.id);
    });
});