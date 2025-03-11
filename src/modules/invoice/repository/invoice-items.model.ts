import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";

@Table({
    tableName: "invoice_items",
    timestamps: false
})
export default class InvoiceItemsModel extends Model {

    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;

    @ForeignKey(() => InvoiceModel)
    @Column({ allowNull: false })
    declare invoice_id: string;

    @BelongsTo(() => InvoiceModel)
    declare invoice: InvoiceModel;

    @Column({ allowNull: false })
    declare name: string;

    @Column({ allowNull: false })
    declare price: number;

    @Column({ allowNull: false })
    declare createdAt: Date;

    @Column({ allowNull: false })
    declare updatedAt: Date;
}