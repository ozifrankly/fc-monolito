import { Sequelize } from "sequelize-typescript";
import ProductModel from "./product.model";
import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address.value-object";
import Product from "../domain/product.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceRepository from "./invoice.repository";
import { where } from "sequelize/types";

describe("InvoiceRepository test", () => {
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
    await ProductModel.create({
      id: "1",
      name: "Produto 1",
      salesPrice: 9.99,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await InvoiceModel.create({
      id: "1",
      name: "Invoice 1",
      document: "document",
      street: "rua x",
      number: "1234",
      complement: "perto",
      city: "São Paulo",
      state: "Campinas",
      zipCode: "1232131",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await InvoiceItemModel.create({
      id: new Id().id,
      invoiceId: "1",
      productId: "1",
      name: "Product1",
      price: 10.5,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const repository = new InvoiceRepository();
    const invoice = await repository.find("1");
  
    expect(invoice.id.id).toEqual("1")
    expect(invoice.name).toEqual("Invoice 1");
    expect(invoice.document).toEqual("document");
    expect(invoice.address.street).toEqual("rua x");
    expect(invoice.address.number).toEqual("1234");
    expect(invoice.address.complement).toEqual("perto");
    expect(invoice.address.city).toEqual("São Paulo");
    expect(invoice.address.state).toEqual("Campinas");
    expect(invoice.address.zipCode).toEqual("1232131");

    expect(invoice.items.length).toEqual(1);
    expect(invoice.items[0].id.id).toEqual("1");
    expect(invoice.items[0].name).toEqual("Product1");
    expect(invoice.items[0].price).toEqual(10.5);

  });
  it("Should create a invoice", async () => {
    await ProductModel.create({
      id: "1",
      name: "Produto 1",
      salesPrice: 9.99,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    const invoiceProps = {
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
      items: [ new Product({
          id: new Id("1"),
          name: "produto1",
          price: 9.9
        })
      ]
    };

    const invoice = new Invoice(invoiceProps);
    const repository = new InvoiceRepository();
    repository.save(invoice)

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: invoiceProps.id.id },
      include: InvoiceItemModel,
    });

    const itemsDb = await InvoiceItemModel.findAll({where: { invoiceId: invoiceProps.id.id}});
    expect(invoiceDb.id).toEqual(invoice.id.id);
    expect(invoiceDb.name).toEqual(invoice.name);
    expect(invoiceDb.document).toEqual(invoice.document);
    expect(invoiceDb.street).toEqual(invoice.address.street);
    expect(invoiceDb.number).toEqual(invoice.address.number);
    expect(invoiceDb.complement).toEqual(invoice.address.complement);
    expect(invoiceDb.city).toEqual(invoice.address.city);
    expect(invoiceDb.state).toEqual(invoice.address.state);
    expect(invoiceDb.zipCode).toEqual(invoice.address.zipCode);
    expect(itemsDb.length).toEqual(invoice.items.length);
    expect(itemsDb[0].name).toEqual(invoice.items[0].name);
    expect(itemsDb[0].price).toEqual(invoice.items[0].price);
  })
});
