import express, { Request, Response } from "express";
import ChecoutFacadeFactory from "../../../modules/checkout/factory/checkout.facade.factory";

export const checkoutRoute = express.Router();

checkoutRoute.post("/", async (req:Request, res: Response) => {
    const checkoutFacade = ChecoutFacadeFactory.create();
    try {
        const checkoutDto = {
            clientId: req.body.clientId,
            products: req.body.products,
        }
        const output = await checkoutFacade.placeOrder(checkoutDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});