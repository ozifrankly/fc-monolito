import { Column, Model, PrimaryKey, Table , BelongsToMany, HasMany} from "sequelize-typescript";
import ProductModel from "./product.model";
import InvoiceItemModel from "./invoice-item.model";

@Table({
  tableName: "invoices",
  timestamps: false,
})
export default class InvoiceModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;
  
  @Column({ allowNull: false })
  document: string;
  
  @Column({ allowNull: false })
  street: string;
  
  @Column({ allowNull: false })
  number: string;
  
  @Column({ allowNull: false })
  complement: string;
  
  @Column({ allowNull: false })
  city: string;
  
  @Column({ allowNull: false })
  state: string;
  
  @Column({ allowNull: false })
  zipCode: string;

  @HasMany(() => InvoiceItemModel)
  items: InvoiceItemModel[];

  @BelongsToMany(() => ProductModel, () => InvoiceItemModel)
  products: ProductModel[];
  
  @Column({ allowNull: false, field: "created_at" })
  createdAt: Date;

  @Column({ allowNull: false, field: "updated_at" })
  updatedAt: Date;
}
