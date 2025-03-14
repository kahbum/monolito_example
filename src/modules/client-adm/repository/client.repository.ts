import Client from "../domain/client.entity";
import ClientGateway from "../gateway/client.gateway";
import { ClientModel } from "./client.model";
import Id from "../../@shared/domain/value-object/id.value-object";

export default class ClientRepository implements ClientGateway {
    async add(client: Client): Promise<void> {

        try {
            await ClientModel.create({
                id: client.id.id,
                name: client.name,
                email: client.email,
                document: client.document,
                street: client.street,
                number: client.number,
                complement: client.complement,
                city: client.city,
                state: client.state,
                zipCode: client.zipCode,
                createdAt: client.createdAt,
                updatedAt: client.updatedAt,
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async find(id: string): Promise<Client> {
        const client = await ClientModel.findOne({ where: { id} });

        if(!client) {
            throw new Error("Client not found");
        }

        return new Client({
            id: new Id(client.id),
            name: client.name,
            email: client.email,
            document: client.document,
            street: client.street,
            number: client.number,
            complement: client.complement,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        })
    }

}