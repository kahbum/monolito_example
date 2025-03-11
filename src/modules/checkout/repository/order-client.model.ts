import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: "clients",
    timestamps: false
})
export class OrderClientModel extends Model {

    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;

    @Column({ allowNull: false })
    declare name: string;

    @Column({ allowNull: false })
    declare email: string;

    @Column({ allowNull: false, field: "street" })
    declare address: string;
}