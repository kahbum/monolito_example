import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "../../domain/entity/invoice-items.entity";
import Invoice from "../../domain/entity/invoice.entity";
import Address from "../../domain/value-object/address.value-object";
import FindInvoiceUseCase from "./find-invoice.usecase";

const invoiceItem1 = new InvoiceItems({
    id: new Id("1"),
    name: "Invoice Item 1",
    price: 10,
});

const invoiceItem2 = new InvoiceItems({
    id: new Id("2"),
    name: "Invoice Item 2",
    price: 20,
});

const invoice = new Invoice({
    id: new Id("1"),
    name: "Invoice Name 1",
    document: "Invoice Document 1",
    address: new Address("Street 1", "123", "Complement 1", "City 1", "State 1", "12345"),
    items: [invoiceItem1, invoiceItem2],
    createdAt: new Date(),
    updatedAt: new Date(),
});

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
        generate: jest.fn(),
    }
};

describe("FindInvoice usecase unit test", () => {
    it("should find invoice", async () => {
        const repository = MockRepository();
        const useCase = new FindInvoiceUseCase(repository);
        const input = {
            id: invoice.id.id,
        };

        const result = await useCase.execute(input);

        expect(repository.find).toHaveBeenCalled();
        expect(result.id).toEqual(invoice.id.id);
        expect(result.name).toEqual(invoice.name);
        expect(result.document).toEqual(invoice.document);

        expect(result.address.street).toEqual(invoice.address.street);
        expect(result.address.number).toEqual(invoice.address.number);
        expect(result.address.complement).toEqual(invoice.address.complement);
        expect(result.address.city).toEqual(invoice.address.city);
        expect(result.address.state).toEqual(invoice.address.state);
        expect(result.address.zipCode).toEqual(invoice.address.zipCode);

        expect(result.items.length).toEqual(2);
        expect(result.items[0].id).toEqual(invoiceItem1.id.id);
        expect(result.items[0].name).toEqual(invoiceItem1.name);
        expect(result.items[0].price).toEqual(invoiceItem1.price);
        expect(result.items[1].id).toEqual(invoiceItem2.id.id);
        expect(result.items[1].name).toEqual(invoiceItem2.name);
        expect(result.items[1].price).toEqual(invoiceItem2.price);
        expect(result.total).toEqual(30);
        expect(result.createdAt).toStrictEqual(invoice.createdAt);
    });
});