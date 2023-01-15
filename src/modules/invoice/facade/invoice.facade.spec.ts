import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemModel from "../repository/invoice-item.model";
import ProductModel from "../repository/product.model";
import InvoiceFactory from "../factory/invoice.factory";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("Find invoice", () => {

  let sequelize: Sequelize;
  
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a invoice",async () => {
    const productId = new Id()
    await ProductModel.create({
      id: productId.id,
      name: "Produto 1",
      salesPrice: 9.99,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const input = {
      name: "Invoice 1",
      document: "document",
      street: "rua x",
      number: "1234",
      complement: "perto",
      city: "São Paulo",
      state: "Campinas",
      zipCode: "1232131",
      items: [
        {
          id: productId.id,
          name: "produto1",
          price: 9.9
        }
      ]
    };
    const facade = InvoiceFactory.create()
    const invoiceDb = await facade.generateInvoice(input)
    const invoice = await facade.findInvoice({id: invoiceDb.id});
    
    expect(invoice.name).toEqual("Invoice 1");
    expect(invoice.document).toEqual("document");
    expect(invoice.total).toEqual(9.9);

    expect(invoice.address.street).toEqual("rua x");
    expect(invoice.address.number).toEqual("1234");
    expect(invoice.address.complement).toEqual("perto");
    expect(invoice.address.city).toEqual("São Paulo");
    expect(invoice.address.state).toEqual("Campinas");
    expect(invoice.address.zipCode).toEqual("1232131");

    expect(invoice.items[0].id).toEqual(productId.id);
    expect(invoice.items[0].name).toEqual("produto1");
    expect(invoice.items[0].price).toEqual(9.9);
  });
});

describe("Generate inoice", () => {
  it("should generata a invoice",async () => {
    const input = {
      name: "Invoice 1",
      document: "document",
      street: "rua x",
      number: "1234",
      complement: "perto",
      city: "São Paulo",
      state: "Campinas",
      zipCode: "1232131",
      items: [
        {
          id: "1",
          name: "produto1",
          price: 9.9
        }
      ]
    };

    const facade = InvoiceFactory.create()
    const result = await facade.generateInvoice(input)

    expect(result.id).toBeDefined;
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.street).toBe(input.street);
    expect(result.number).toBe(input.number);
    expect(result.complement).toBe(input.complement);
    expect(result.city).toBe(input.city);
    expect(result.state).toBe(input.state);
    expect(result.zipCode).toBe(input.zipCode);
    expect(result.items[0].id).toBe(input.items[0].id);
    expect(result.items[0].name).toBe(input.items[0].name);
    expect(result.items[0].price).toBe(input.items[0].price);
    expect(result.total).toBe(9.9)

  });
});

