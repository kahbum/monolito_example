import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../../../modules/product-adm/repository/product.model";
import { app } from "../express";
import request from "supertest";

describe("E2E tests for product", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ":memory:",
            logging: false
        });
        sequelize.addModels([ProductModel]);
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const product = {
            name: "Product 1",
            description: "Product 1 description",
            purchasedPrice: 10,
            stock: 3,
        }

        const response = await request(app)
        .post("/products")
        .send(product);

        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe(product.name);
        expect(response.body.description).toBe(product.description);
        expect(response.body.purchasedPrice).toBe(product.purchasedPrice);
        expect(response.body.stock).toBe(product.stock);
        
        const dbProduct = await ProductModel.findOne({ where: { id: response.body.id } });
        expect(dbProduct.name).toBe(product.name);
        expect(dbProduct.description).toBe(product.description);
        expect(dbProduct.purchasedPrice).toBe(product.purchasedPrice);
        expect(dbProduct.stock).toBe(product.stock);
    });
});