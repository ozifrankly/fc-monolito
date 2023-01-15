import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepository = () => {
  return {
    save: jest.fn(),
    find: jest.fn(),
  };
};

describe("Generate inoice", () => {
  it("should generata a invoice",async () => {
    const invoiceRepository = MockRepository();
    const useCase = new GenerateInvoiceUseCase(invoiceRepository);
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

    const result = await useCase.execute(input);

    expect(invoiceRepository.save).toHaveBeenCalled();
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
