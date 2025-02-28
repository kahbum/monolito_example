import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import FindClientUseCase from "./find-client.usecase";

const client = new Client({
    id: new Id("1"),
    name: "Client 1",
    email: "x@x.com",
    address: "Address 1",
    document: "document 1",
    street: "street 1",
    number: "number 1",
    complement: "complement 1",
    city: "city 1",
    state: "state 1",
    zipCode: "zipCode 1",
});

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(client)),
    };
};

describe("Find Client usecase unit test", () => {

    it("should find a client", async () => {
        const repository = MockRepository();
        const useCase = new FindClientUseCase(repository);

        const input = {
            id: "1",
        };

        const result = await useCase.execute(input);

        expect(repository.find).toHaveBeenCalled();
        expect(result.id).toBe(input.id);
        expect(result.name).toEqual(client.name);
        expect(result.email).toEqual(client.email);
        expect(result.address).toEqual(client.address);
    });
});