import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto } from "./generate-invoice.dto";
import Address   from "../../../@shared/domain/value-object/address.value-object";
import Product from "../../domain/product.entity";
import Invoice from "../../domain/invoice.entity";

export default class GenerateInvoiceUseCase {
  private _invoiceRepository: InvoiceGateway;

  constructor(repository: InvoiceGateway){
    this._invoiceRepository = repository;
  }

  async execute(input: GenerateInvoiceUseCaseInputDto) {
    const addressProps = {
      street: input.street,
      number: input.number,
      complement: input.complement,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
    }

    const props = {
      id: new Id(),
      name: input.name,
      document: input.document,
      address: new Address(addressProps),
      items: input.items.map((item) => {
        const productPrps = {...item, id: new Id(item.id)};
        return new Product(productPrps);
      })
    }

    const invoice = new Invoice(props)
    this._invoiceRepository.save(invoice)

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      items: invoice.items.map((item) => {
        return {
          id: item.id.id,
          name: item.name,
          price: item.price,
        }
      }),
      total: invoice.total()
    }
  }
}
