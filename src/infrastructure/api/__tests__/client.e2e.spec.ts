import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { v4 as uuidv4 } from "uuid";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import { app } from "../express";

describe("E2E test for client", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ":memory:",
            logging: false
        });
        sequelize.addModels([ClientModel]);
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a client", async () => {
        const client = {
            id: uuidv4(),
            name: "Name 1",
            email: "name@email.com",
            document: "Document 1",
            street: "Street 1",
            number: "1",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "zipCode 1",
        }

        const response = await request(app)
        .post("/clients")
        .send(client);

        expect(response.status).toBe(200);

        const persistedClient = await ClientModel.findOne({ where: { id: client.id } });
        expect(persistedClient.id).toBeDefined();
        expect(persistedClient.name).toBe(client.name);
        expect(persistedClient.email).toBe(client.email);
        expect(persistedClient.document).toBe(client.document);
        expect(persistedClient.street).toBe(client.street);
        expect(persistedClient.number).toBe(client.number);
        expect(persistedClient.complement).toBe(client.complement);
        expect(persistedClient.city).toBe(client.city);
        expect(persistedClient.state).toBe(client.state);
        expect(persistedClient.zipCode).toBe(client.zipCode);
    });
});