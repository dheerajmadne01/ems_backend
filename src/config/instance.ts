import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
    process.env.DATABASE_NAME || '',
    process.env.DATABASE_USERNAME || '',
    process.env.DATABASE_PASSWORD || '',
    {
        host: process.env.DATABASE_HOST,
        // host: 'localhost',
        dialect: 'mysql',
        logging: false,
    }
);

