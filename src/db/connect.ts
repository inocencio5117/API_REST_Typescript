import mongoose from 'mongoose';
import { ConnectionOptions } from 'tls';
import log from '../logger';

async function connect(): Promise<void> {
  const dbUri = process.env.DB_CONNECT as string;

  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectionOptions);
    log.info('Databse connected');
  } catch (err) {
    log.info('Databse error', err);
    process.exit(1);
  }
}

export default connect;
