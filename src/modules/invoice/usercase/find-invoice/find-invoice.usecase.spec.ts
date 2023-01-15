import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity"
import Product from "../../domain/product.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

const invoiceDb = new Invoice({
  id: new Id("1"),
  name: "Invoice 1",
  document: "document",
  address: new Address({
    street: "rua x",
    number: "1234",
    complement: "perto",
    city: "São Paulo",
    state: "Campinas",
    zipCode: "1232131",
  }),
  items: [new Product({
    id: new Id("2"),
    name: "Product1",
    price: 10.5, 
  })],
});

const MockRepository = () => {
  return {
    save: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoiceDb)),
  };
};

describe("Find inoice", () => {
  it("should find a invoice",async () => {
    const invoiceRepository = MockRepository();
    const useCase = new FindInvoiceUseCase(invoiceRepository);
    const invoice = await useCase.execute({id: "id"});

    expect(invoice.id).toEqual(invoiceDb.id.id);
    expect(invoice.name).toEqual(invoiceDb.name);
    expect(invoice.document).toEqual(invoiceDb.document);
    expect(invoice.total).toEqual(10.5);

    expect(invoice.address.street).toEqual(invoiceDb.address.street);
    expect(invoice.address.state).toEqual(invoiceDb.address.state);
    expect(invoice.address.city).toEqual(invoiceDb.address.city);
    expect(invoice.address.number).toEqual(invoiceDb.address.number);
    expect(invoice.address.complement).toEqual(invoiceDb.address.complement);
    expect(invoice.address.zipCode).toEqual(invoiceDb.address.zipCode);

    expect(invoice.items[0].id).toEqual(invoiceDb.items[0].id.id);
    expect(invoice.items[0].name).toEqual(invoiceDb.items[0].name);
    expect(invoice.items[0].price).toEqual(invoiceDb.items[0].price);
  });
});
