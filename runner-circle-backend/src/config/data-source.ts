import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { buildDataSourceOptions } from './typeorm.config';

// Carrega .env para o CLI de migrations e para o seed (fora do runtime Nest).
config();

const dataSource = new DataSource(buildDataSourceOptions());

export default dataSource;
