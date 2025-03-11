import Invoice from "../domain/entity/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceModel } from "./invoice.model";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "../domain/entity/invoice-items.entity";
import InvoiceItemsModel from "./invoice-items.model";
import Address from "../domain/value-object/address.value-object";
export default class InvoiceRepository implements InvoiceGateway {
    async find(id: string): Promise<Invoice> {
        const invoice = await InvoiceModel.findOne({
            where: { id: id },
            include: [{model: InvoiceItemsModel}],
        });

        return new Invoice({
            id: new Id(invoice.id),
            name: invoice.name,
            document: invoice.document,
            address: new Address(invoice.street, invoice.number, invoice.complement, invoice.city, invoice.state, invoice.zipCode),
            items: invoice.items.map((invoiceItem) => new InvoiceItems({
                id: new Id(invoiceItem.id),
                name: invoiceItem.name,
                price: invoiceItem.price,
                createdAt: invoiceItem.createdAt,
                updatedAt: invoiceItem.updatedAt,
            })),
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
        });
    }

    async generate(invoice: Invoice): Promise<void> {
        try {
            await InvoiceModel.create(
                {
                    id: invoice.id.id,
                    name: invoice.name,
                    document: invoice.document,
                    street: invoice.address.street,
                    number: invoice.address.number,
                    complement: invoice.address.complement,
                    city: invoice.address.city,
                    state: invoice.address.state,
                    zipCode: invoice.address.zipCode,
                    items: invoice.items.map((invoiceItem) => ({
                        id: invoiceItem.id.id,
                        name: invoiceItem.name,
                        price: invoiceItem.price,
                        createdAt: invoiceItem.createdAt || new Date(),
                        updatedAt: invoiceItem.updatedAt || new Date(),
                    })),
                    total: invoice.total,
                    createdAt: invoice.createdAt || new Date(),
                    updatedAt: invoice.updatedAt || new Date(),
                },
                {
                    include: [{model: InvoiceItemsModel}],
                },
            );
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}