import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.BATTLECARD_dbHost,
  port: parseInt(process.env.BATTLECARD_dbPort || '5432'),  
  username: process.env.BATTLECARD_dbUser,
  password: process.env.BATTLECARD_dbPassword,
  database: process.env.BATTLECARD_dbName,
  synchronize: true,
  migrations: ['src/migrations/*.ts'],
  entities: ['src/entities/*.entity.ts'],
  logging: false,
};

export const AppDataSource = new DataSource(dataSourceOptions);