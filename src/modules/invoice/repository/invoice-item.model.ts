import { Column, Model, ForeignKey, Table } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import ProductModel from "./product.model";

@Table({
  tableName: "invoice_items",
  timestamps: false,
})

export default class InvoiceItemModel extends Model {
  
  @ForeignKey(() => InvoiceModel)
  @Column({ allowNull: false, field: "invoice_id" })
  invoiceId: string;

  @ForeignKey(() => ProductModel)
  @Column({ allowNull: false, field: "product_id" })
  productId: string;
 
  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  price: number;

  @Column({ allowNull: false, field: "created_at" })
  createdAt: Date;

  @Column({ allowNull: false, field: "updated_at" })
  updatedAt: Date;
}
