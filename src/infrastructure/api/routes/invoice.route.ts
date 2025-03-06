import express, { Request, Response } from "express";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.factory";

export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req: Request<{id: string}>, res: Response) => {
    const invoiceFacade = InvoiceFacadeFactory.create();
    try {
        const invoiceDto = {
            id: req.params.id,
        }
        const output = await invoiceFacade.find(invoiceDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});