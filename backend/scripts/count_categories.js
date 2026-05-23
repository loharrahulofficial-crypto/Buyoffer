import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });
import Offer from '../models/Offer.js';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lotsofoffers', { dbName: 'buyoffer' });
  const counts = await Offer.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);
  console.log(counts);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
