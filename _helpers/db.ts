import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import accountModel from '../accounts/account.model';
import refreshTokenModel from '../accounts/refresh-token.model';

const db: any = {};
export default db;

initialize().catch(err => {
    console.error('CRITICAL: Database initialization failed:', err);
    process.exit(1);
});

async function initialize() {
    try {
        const host = process.env.DB_HOST!;
        const port = parseInt(process.env.DB_PORT || '3306');
        const user = process.env.DB_USER || 'root';
        const password = process.env.DB_PASSWORD || '';
        const database = process.env.DB_NAME!;

        const sequelize = new Sequelize(database, user, password, {
            host,
            port,
            dialect: 'mysql',
            logging: console.log,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        });

        await sequelize.authenticate();
        console.log("Successfully connected to the database.");

        db.Account = accountModel(sequelize);
        db.RefreshToken = refreshTokenModel(sequelize);

        db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
        db.RefreshToken.belongsTo(db.Account);

        await sequelize.sync();
    } catch (error) {
        console.error("DATABASE CONNECTION ERROR:", error);
    }
}
