import InvoiceGateway from "../../gateway/invoice.gateway";
import { FindInvoiceUseCaseInputDTO } from "./find-invoice.dto";

export default class FindInvoiceUseCase{
  private _repository: InvoiceGateway;

  constructor(repository: InvoiceGateway){
    this._repository = repository;
  }

  async execute(input: FindInvoiceUseCaseInputDTO){
    const invoice = await this._repository.find(input.id);

    const result = {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      address: {
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
      },
      items: invoice.items.map((item) => {
        return {
          id: item.id.id,
          name: item.name,
          price: item.price,
        }
      }),
      total: invoice.total(),
      createdAt: invoice.createdAt,
    };
    return result
  }
}
