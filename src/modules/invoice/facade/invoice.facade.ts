import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDTO, FindInvoiceUseCaseOutputDTO, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";

export interface UseCasesProps {
  findUseCase: UseCaseInterface;
  generateUseCase: UseCaseInterface;
}

export default class InvoiceFace implements InvoiceFacadeInterface{
  private _findUseCase: UseCaseInterface;
  private _generateUseCase: UseCaseInterface;

  constructor(props: UseCasesProps){
    this._findUseCase = props.findUseCase;
    this._generateUseCase = props.generateUseCase;
  }

  findInvoice(input: FindInvoiceFacadeInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
    return this._findUseCase.execute(input);
  }

  generateInvoice(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
    return this._generateUseCase.execute(input);
  }
}