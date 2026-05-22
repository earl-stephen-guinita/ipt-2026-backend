import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import accountModel from '../accounts/account.model';
import refreshTokenModel from '../accounts/refresh-token.model';

const db: any = {};
export default db;

initialize().catch(err => {
    console.error('CRITICAL: Database initialization failed:', err);
    process.exit(1); // Exit so Render knows to restart/retry
});

async function initialize() {

    if (!process.env.DB_HOST || !process.env.DB_NAME) {
        throw new Error("Missing DB_HOST or DB_NAME in environment variables.");
    }
    
    const host = (process.env.DB_HOST || 'localhost') as string;
    const port = parseInt(process.env.DB_PORT || '3306');
    const user = (process.env.DB_USER || 'root') as string;
    const password = (process.env.DB_PASSWORD || '') as string;
    const database = (process.env.DB_NAME || 'node_mysql_api') as string;

    const sequelize = new Sequelize(database, user, password, {
        host,
        port,
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            
        }
    });

    await sequelize.authenticate();
    console.log(`Connected to database: ${database} at ${host}`);

    db.Account = accountModel(sequelize);
    db.RefreshToken = refreshTokenModel(sequelize);

    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    await sequelize.sync();
}
