import express, {Express} from "express";
import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import { productsRoute } from "./routes/product.route";
import { clientsRoute } from "./routes/client.route";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { invoiceRoute } from "./routes/invoice.route";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import InvoiceItemsModel from "../../modules/invoice/repository/invoice-items.model";

export const app: Express = express();
app.use(express.json());
app.use("/products", productsRoute);
app.use("/clients", clientsRoute);
app.use("/invoice", invoiceRoute);

export let sequelize: Sequelize;

async function setupDb() {
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: "db.sqlite",
        logging: false,
    });
    await sequelize.addModels([ProductModel, ClientModel, InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync();
}

setupDb();