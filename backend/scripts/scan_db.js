import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import Offer from '../models/Offer.js';

const mongoUri = process.env.MONGODB_URI;

async function scan() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'buyoffer' });
  console.log('Connected!');

  const offers = await Offer.find({}).sort({ sequence: 1 });
  console.log(`Total offers in database: ${offers.length}`);

  const imageStats = {};
  const noImage = [];
  const placeholderImage = [];

  offers.forEach(o => {
    const img = o.meta?.imageUrl;
    const title = `${o.sequence}: ${o.title}`;
    
    if (!img) {
      noImage.push(title);
    } else if (img.includes('placehold.co') || img.includes('picsum.photos') || img.includes('placeholder')) {
      placeholderImage.push({ title, imageUrl: img });
    } else {
      imageStats[img] = imageStats[img] || [];
      imageStats[img].push(title);
    }
  });

  console.log('\n--- Duplicate Images in DB ---');
  let duplicateCount = 0;
  Object.entries(imageStats).forEach(([img, list]) => {
    if (list.length > 1) {
      console.log(`Image: ${img}`);
      console.log(`Used by: ${JSON.stringify(list, null, 2)}`);
      duplicateCount++;
    }
  });
  console.log(`Total duplicate image URLs: ${duplicateCount}`);

  console.log('\n--- Missing Images in DB ---');
  console.log(JSON.stringify(noImage, null, 2));
  console.log(`Total missing images: ${noImage.length}`);

  console.log('\n--- Placeholder Images in DB ---');
  console.log(JSON.stringify(placeholderImage, null, 2));
  console.log(`Total placeholder images: ${placeholderImage.length}`);

  await mongoose.disconnect();
}

scan().catch(err => {
  console.error('Scan failed:', err.message);
  mongoose.disconnect();
});
