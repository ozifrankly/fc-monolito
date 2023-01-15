import InvoiceFace from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usercase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usercase/generate-invoice/generate-invoice.usecase";

export default class InvoiceFactory{
  static create(){
    const repository = new InvoiceRepository();
    const findUseCase = new FindInvoiceUseCase(repository);
    const generateUseCase = new GenerateInvoiceUseCase(repository);
    return new InvoiceFace({
      findUseCase: findUseCase,
      generateUseCase: generateUseCase
    })
  }
}