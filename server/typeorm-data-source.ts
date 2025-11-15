import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.dbHost,
  port: parseInt(process.env.dbPort || '5432'),
  username: process.env.dbUser,
  password: process.env.dbPassword,
  database: process.env.dbName,
  synchronize: true,
  migrations: ['src/migrations/*.ts'],
  entities: ['src/entities/*.entity.ts'],
  logging: false,
};

export const AppDataSource = new DataSource(dataSourceOptions);