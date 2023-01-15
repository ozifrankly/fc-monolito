import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import Product from "../domain/product.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {

  async find(id: string): Promise<Invoice> {
    const invoiceDb = await InvoiceModel.findOne({
      where: { id: id }
    });

    const itemsDb = await InvoiceItemModel.findAll({where: { invoiceId: invoiceDb.id}});
    return new Invoice({
      id: new Id(invoiceDb.id),
      name: invoiceDb.name,
      document: invoiceDb.document,
      address: new Address({
        street: invoiceDb.street,
        number: invoiceDb.number,
        complement: invoiceDb.complement,
        city: invoiceDb.city,
        state: invoiceDb.state,
        zipCode: invoiceDb.zipCode,
      }),
      items: itemsDb.map((item) => {
        return new Product({
          id: new Id(item.productId),
          name: item.name,
          price: item.price,
        })
      }),
    })
  }

  async save(input: Invoice): Promise<void> {
    await InvoiceModel.create({
      id: input.id.id,
      name: input.name,
      document: input.document,
      street: input.address.street,
      number: input.address.number,
      complement: input.address.complement,
      city: input.address.city,
      state: input.address.state,
      zipCode: input.address.zipCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    input.items.forEach( async(item) => {
      await InvoiceItemModel.create({
        id: new Id().id,
        invoiceId: input.id.id,
        productId: item.id.id,
        name: item.name,
        price: item.price,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  };
};
