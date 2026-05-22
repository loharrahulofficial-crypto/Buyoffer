import legacyOffers from '../data/seedOffers.js';
import fs from 'fs';
import path from 'path';

console.log('Deep Scanning all deals and banners...');

// 1. Analyze seedOffers.js (legacyOffers)
const imageCount = {};
const duplicateImages = {};
const noImages = [];

legacyOffers.forEach(offer => {
  const img = offer.imageUrl;
  if (!img) {
    noImages.push(offer);
  } else {
    imageCount[img] = imageCount[img] || [];
    imageCount[img].push(offer.id + ': ' + offer.title);
  }
});

Object.entries(imageCount).forEach(([img, offers]) => {
  if (offers.length > 1) {
    duplicateImages[img] = offers;
  }
});

console.log('\n--- Duplicate Images in seedOffers.js ---');
console.log(JSON.stringify(duplicateImages, null, 2));

console.log('\n--- Missing Images in seedOffers.js ---');
console.log(JSON.stringify(noImages.map(o => o.id + ': ' + o.title), null, 2));

console.log(`\nTotal duplicate images found: ${Object.keys(duplicateImages).length}`);
console.log(`Total missing images found: ${noImages.length}`);
