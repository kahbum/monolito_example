import express, { Request, Response } from "express";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";

export const clientsRoute = express.Router();

clientsRoute.post("/", async (req: Request, res: Response) => {
    const clientAdmFacade = ClientAdmFacadeFactory.create();
    try {
        const clientDto = {
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            document: req.body.document,
            street: req.body.street,
            number: req.body.number,
            complement: req.body.complement,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
        }
        const output = await clientAdmFacade.add(clientDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});