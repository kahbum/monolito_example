import InvoiceFacade from "../facade/invoiceFacade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";

export default class InvoiceFactory {
    static create() {
        const invoiceRepository = new InvoiceRepository();
        const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);
        const generateInvoiceUseCase = new GenerateInvoiceUseCase(invoiceRepository);
        const invoiceFacade = new InvoiceFacade({
            finduseCase: findInvoiceUseCase,
            generateUseCase: generateInvoiceUseCase,
        });

        return invoiceFacade;
    }
}