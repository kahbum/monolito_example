import { SequelizeStorage, Umzug } from "umzug"
import { Sequelize } from "sequelize"

export const migrator = (
  sequelize: Sequelize
) => {
    return new Umzug({
        migrations: {
            glob: [
            "migrations/*.ts",
            {
                cwd: __dirname,
                ignore: ["**/*.d.ts", "**/index.ts", "**/index.js"],
            },
            ],
        },
        context: sequelize,
        storage: new SequelizeStorage({ sequelize }),
        logger: console
    });
}