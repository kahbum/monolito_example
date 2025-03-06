import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.factory";
import InvoiceItemsModel from "../../../modules/invoice/repository/invoice-items.model";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import { app } from "../express";

describe("E2E test for invoice", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ":memory:",
            logging: false
        });
        sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should find an invoice", async () => {
        const invoiceFacade = InvoiceFacadeFactory.create();

        const invoice = {
            name: "Invoice Name 1",
            document: "Invoice Document 1",
            street: "Street 1",
            number: "123",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "12345",
            items: [
                {
                    id: "1",
                    name: "Invoice Item 1",
                    price: 10,
                },
                {
                    id: "2",
                    name: "Invoice Item 2",
                    price: 20,
                },
            ],
        };
        const resultGenerate = await invoiceFacade.generate(invoice);

        const response = await request(app)
        .get(`/invoice/${resultGenerate.id}`)
        .send();

        expect(response.status).toBe(200);

        expect(response.body.id).toEqual(resultGenerate.id);
        expect(response.body.name).toEqual(invoice.name);
        expect(response.body.document).toEqual(invoice.document);

        expect(response.body.address.street).toEqual(invoice.street);
        expect(response.body.address.number).toEqual(invoice.number);
        expect(response.body.address.complement).toEqual(invoice.complement);
        expect(response.body.address.city).toEqual(invoice.city);
        expect(response.body.address.state).toEqual(invoice.state);
        expect(response.body.address.zipCode).toEqual(invoice.zipCode);

        expect(response.body.items.length).toBe(2);
        expect(response.body.items).toContainEqual(invoice.items[0]);
        expect(response.body.items).toContainEqual(invoice.items[1]);
        expect(response.body.total).toBe(30);

        expect(response.body.createdAt).toBeDefined();
    });
});