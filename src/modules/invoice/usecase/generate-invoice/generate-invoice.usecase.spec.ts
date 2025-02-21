import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepository = () => {
    return {
        find: jest.fn(),
        generate: jest.fn(),
    }
};

describe("GenerateInvoice usecase unit test", () => {
    it("should generate invoice", async () => {
        const repository = MockRepository();
        const useCase = new GenerateInvoiceUseCase(repository);

        const input = {
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

        const result = await useCase.execute(input);

        expect(repository.generate).toHaveBeenCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toEqual(input.name);
        expect(result.document).toEqual(input.document);

        expect(result.street).toEqual(input.street);
        expect(result.number).toEqual(input.number);
        expect(result.complement).toEqual(input.complement);
        expect(result.city).toEqual(input.city);
        expect(result.state).toEqual(input.state);
        expect(result.zipCode).toEqual(input.zipCode);

        expect(result.items.length).toEqual(2);
        expect(result.items[0].id).toEqual(input.items[0].id);
        expect(result.items[0].name).toEqual(input.items[0].name);
        expect(result.items[0].price).toEqual(input.items[0].price);
        expect(result.items[1].id).toEqual(input.items[1].id);
        expect(result.items[1].name).toEqual(input.items[1].name);
        expect(result.items[1].price).toEqual(input.items[1].price);
        expect(result.total).toEqual(30);
    });
});