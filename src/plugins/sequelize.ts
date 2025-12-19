import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import fs from 'fs';
import { config } from '../config/db';

dotenv.config();

const sequelize = new Sequelize(
  config.database.database as string,
  config.database.user as string,
  config.database.password,
  {
    host: config.database.host,
    port: Number(config.database.port),
    dialect: 'mysql',

    dialectOptions: {
      connectTimeout: 20000,

      // ✅ SSL support (for production / cloud DB)
      ssl: {
        ca: fs.readFileSync('/etc/ssl/certs/ca-certificates.crt'),
      },
    },

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },

    logging: false,
  }
);

const checkDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connection successful');
    return { connected: true };
  } catch (error) {
    console.error('❌ DB connection failed:', error);
    return { connected: false, error };
  }
};

export { sequelize, checkDatabaseConnection };
