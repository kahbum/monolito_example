import express, { Request, Response } from "express";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";

export const productsRoute = express.Router();

productsRoute.post("/", async (req: Request, res: Response) => {
    const productAdmFacade = ProductAdmFacadeFactory.create();
    try {
        const productDto = {
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            purchasedPrice: req.body.purchasedPrice,
            stock: req.body.stock,
        }
        const output = await productAdmFacade.addProduct(productDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});