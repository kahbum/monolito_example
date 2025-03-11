import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import OrderProductModel from "./order-product.model";
import { OrderModel } from "./order.model";

@Table({
    tableName: "order_items",
    timestamps: false
})
export class OrderItemModel extends Model {
    
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @ForeignKey(() => OrderModel)
    @Column({ allowNull: false })
    order_id: string;

    @BelongsTo(() => OrderModel)
    order: OrderModel;

    @ForeignKey(() => OrderProductModel)
    @Column({ allowNull: false })
    order_product_id: string;

    @BelongsTo(() => OrderProductModel)
    order_product: OrderProductModel;

    @Column({ allowNull: false })
    salesPrice: number;
}