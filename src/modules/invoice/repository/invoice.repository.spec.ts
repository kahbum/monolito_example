import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";
import InvoiceItemsModel from "./invoice-items.model";
import InvoiceRepository from "./invoice.repository";
import InvoiceItems from "../domain/entity/invoice-items.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/entity/invoice.entity";
import Address from "../domain/value-object/address.value-object";

describe("InvoiceRepository test", () => {
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

    const invoiceItemFromJson = (input: any): InvoiceItems => {
        return new InvoiceItems({
            id: new Id(input.id),
            name: input.name,
            price: input.price,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt,
        });
    }

    it("should find an invoice", async () => {
        const invoice = {
            id: "1",
            name: "Invoice Name 1",
            document: "Invoice Document 1",
            street: "Street 1",
            number: "123",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "12345",
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await InvoiceModel.create(invoice);

        const invoiceItem1 = {
            id: "1",
            name: "Invoice Item 1",
            price: 10,
            invoice_id: "1",
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await InvoiceItemsModel.create(invoiceItem1);

        const invoiceItem2 = {
            id: "2",
            name: "Invoice Item 2",
            price: 20,
            invoice_id: "1",
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await InvoiceItemsModel.create(invoiceItem2);

        const invoiceRepository = new InvoiceRepository();
        const result = await invoiceRepository.find(invoice.id);

        expect(result.id.id).toEqual(invoice.id);
        expect(result.name).toEqual(invoice.name);
        expect(result.document).toEqual(invoice.document);

        expect(result.address.street).toEqual(invoice.street);
        expect(result.address.number).toEqual(invoice.number);
        expect(result.address.complement).toEqual(invoice.complement);
        expect(result.address.city).toEqual(invoice.city);
        expect(result.address.state).toEqual(invoice.state);
        expect(result.address.zipCode).toEqual(invoice.zipCode);

        expect(result.items.length).toBe(2);
        expect(result.items).toContainEqual(invoiceItemFromJson(invoiceItem1));
        expect(result.items).toContainEqual(invoiceItemFromJson(invoiceItem2));

        expect(result.createdAt).toEqual(invoice.createdAt);
        expect(result.updatedAt).toEqual(invoice.updatedAt);
    });

    it("should create an invoice", async () => {
        const invoiceItem = new InvoiceItems({
            id: new Id("1"),
            name: "Invoice Item 1",
            price: 10,
        });

        const invoiceProps = {
            id: new Id("1"),
            name: "Invoice Name 1",
            document: "Invoice Document 1",
            address: new Address("Street 1", "123", "Complement 1", "City 1", "State 1", "12345"),
            items: [invoiceItem],
        };
        const invoice = new Invoice(invoiceProps);
        const invoiceRepository = new InvoiceRepository();

        await invoiceRepository.generate(invoice);

        const result = await InvoiceModel.findOne({
            where: { id: invoice.id.id},
            include: [{model: InvoiceItemsModel}],
        });

        expect(result.toJSON()).toStrictEqual({
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: [{
                id: invoiceItem.id.id,
                invoice_id: invoice.id.id,
                name: invoiceItem.name,
                price: invoiceItem.price,
                createdAt: invoiceItem.createdAt,
                updatedAt: invoiceItem.updatedAt,
            }],
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
        });
    });
});