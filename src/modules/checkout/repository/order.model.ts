import { BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { OrderClientModel } from "./order-client.model";
import { OrderItemModel } from "./order-item.model";

@Table({
    tableName: "orders",
    timestamps: false
})
export class OrderModel extends Model {

    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;

    @ForeignKey(() => OrderClientModel)
    @Column({ allowNull: false })
    declare client_id: string;

    @BelongsTo(() => OrderClientModel)
    declare client: OrderClientModel;

    @HasMany(() => OrderItemModel)
    declare products: OrderItemModel[];

    @Column({ allowNull: false })
    declare status: string;

    @Column
    declare invoiceId: string;
}