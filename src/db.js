import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import chalk from 'chalk';
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URL);
try {
    await mongoClient.connect();
    console.log(chalk.blue('Connected to MongoDB'));
} catch {
    console.log(chalk.red('Error connecting to MongoDB'));
}

const db = mongoClient.db(process.env.MONGO_DB);
export default db;