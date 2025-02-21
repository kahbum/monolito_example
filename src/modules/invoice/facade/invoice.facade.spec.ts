import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "../repository/invoice.model";
import InvoiceItemsModel from "../repository/invoice-items.model";
import InvoiceFactory from "../factory/invoice.factory";

describe("InvoiceFacade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        await sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should find an invoice", async () => {
        const invoiceFacade = InvoiceFactory.create();

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

        const resultFind = await invoiceFacade.find({ id: resultGenerate.id });

        expect(resultFind.id).toEqual(resultGenerate.id);
        expect(resultFind.name).toEqual(invoice.name);
        expect(resultFind.document).toEqual(invoice.document);

        expect(resultFind.address.street).toEqual(invoice.street);
        expect(resultFind.address.number).toEqual(invoice.number);
        expect(resultFind.address.complement).toEqual(invoice.complement);
        expect(resultFind.address.city).toEqual(invoice.city);
        expect(resultFind.address.state).toEqual(invoice.state);
        expect(resultFind.address.zipCode).toEqual(invoice.zipCode);

        expect(resultFind.items.length).toBe(2);
        expect(resultFind.items).toContainEqual(invoice.items[0]);
        expect(resultFind.items).toContainEqual(invoice.items[1]);
        expect(resultFind.total).toBe(30);

        expect(resultFind.createdAt).toBeDefined();
    });

    it("should create an invoice", async () => {

        const invoice = {
            name: "Invoice Name 1",
            document: "Invoice Document 1",
            street: "Street 1",
            number: "123",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "12345",
            items: [{
                id: "1",
                name: "Invoice Item 1",
                price: 10,
            }],
        };
        const invoiceFacade = InvoiceFactory.create();

        const resultGenerate = await invoiceFacade.generate(invoice);

        const resultFind = await InvoiceModel.findOne({
            where: { id: resultGenerate.id},
            include: [{model: InvoiceItemsModel}],
        });

        expect(resultFind.id).toEqual(resultGenerate.id);
        expect(resultFind.name).toEqual(invoice.name);
        expect(resultFind.document).toEqual(invoice.document);

        expect(resultFind.street).toEqual(invoice.street);
        expect(resultFind.number).toEqual(invoice.number);
        expect(resultFind.complement).toEqual(invoice.complement);
        expect(resultFind.city).toEqual(invoice.city);
        expect(resultFind.state).toEqual(invoice.state);
        expect(resultFind.zipCode).toEqual(invoice.zipCode);

        expect(resultFind.items.length).toBe(1);
        expect(resultFind.items[0].id).toEqual(invoice.items[0].id),
        expect(resultFind.items[0].invoice_id).toEqual(resultGenerate.id),
        expect(resultFind.items[0].name).toEqual(invoice.items[0].name),
        expect(resultFind.items[0].price).toEqual(invoice.items[0].price),
        expect(resultFind.items[0].createdAt).toBeDefined();
        expect(resultFind.items[0].updatedAt).toBeDefined();
        expect(resultGenerate.total).toBe(10);

        expect(resultFind.createdAt).toBeDefined();
        expect(resultFind.updatedAt).toBeDefined();
    });
});