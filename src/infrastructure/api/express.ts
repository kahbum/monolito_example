import express, {Express} from "express";
import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import { productsRoute } from "./routes/product.route";
import { clientsRoute } from "./routes/client.route";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { invoiceRoute } from "./routes/invoice.route";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import InvoiceItemsModel from "../../modules/invoice/repository/invoice-items.model";
import { checkoutRoute } from "./routes/checkout.route";
import { OrderModel } from "../../modules/checkout/repository/order.model";
import { OrderItemModel } from "../../modules/checkout/repository/order-item.model";
import { OrderClientModel } from "../../modules/checkout/repository/order-client.model";
import OrderProductModel from "../../modules/checkout/repository/order-product.model";
import StoreCatalogProductModel from "../../modules/store-catalog/repository/product.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";

export const app: Express = express();
app.use(express.json());
app.use("/products", productsRoute);
app.use("/clients", clientsRoute);
app.use("/invoice", invoiceRoute);
app.use("/checkout", checkoutRoute);

export let sequelize: Sequelize;

async function setupDb() {
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: "db.sqlite",
        logging: false,
    });
    sequelize.addModels([ProductModel, ClientModel, InvoiceModel, InvoiceItemsModel, OrderModel, OrderItemModel, OrderClientModel, OrderProductModel, StoreCatalogProductModel, TransactionModel]);
    await sequelize.sync();
}

export { setupDb };