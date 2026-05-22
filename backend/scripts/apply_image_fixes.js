import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedOffersPath = path.join(__dirname, '..', 'data', 'seedOffers.js');
const serverPath = path.join(__dirname, '..', 'server.js');

console.log('Starting Image Hotfix Application...');

// 1. Update backend/data/seedOffers.js
let seedContent = fs.readFileSync(seedOffersPath, 'utf8');

const seedReplacements = [
  { id: 30, oldUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&q=80&w=800', newUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800' }, // Restore McDonald's burger image
  { id: 56, oldUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800', newUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800' }, // Nature's Basket
  { id: 38, oldUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800', newUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800' }, // Fresh Menu
  { id: 26, oldUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800', newUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&q=80&w=800' }, // Swiggy
  { id: 37, oldUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800', newUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800' }, // Bolt Food
  { id: 54, oldUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800', newUrl: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&q=80&w=800' }, // Amazon Fresh
  { id: 59, oldUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800', newUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800' }, // Amazon Fresh Weekly
  { id: 72, oldUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800', newUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=800' }, // Shipt
  { id: 60, oldUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800', newUrl: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&q=80&w=800' }, // Wholefoods
  { id: 64, oldUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800', newUrl: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=800' }, // Misfits Market
  { id: 50, oldUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800', newUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=800' }, // Jiomart
  { id: 62, oldUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800', newUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800' }, // Instacart
  { id: 53, oldUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=800', newUrl: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800' }, // Dealshare
  { id: 58, oldUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=800', newUrl: 'https://images.unsplash.com/photo-1515706886582-54c73c5eaf41?auto=format&fit=crop&q=80&w=800' }, // Walmart
  { id: 57, oldUrl: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&q=80&w=800', newUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800' }, // Milkbasket
  { id: 70, oldUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=800', newUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800' }  // Vitacost Health
];

seedReplacements.forEach(({ id, oldUrl, newUrl }) => {
  // Use a precise regex to locate the block containing the specific id, and replace its imageUrl within that block ONLY
  const blockRegex = new RegExp(`(id:\\s*${id},(?:(?!id:)[\\s\\S])*?imageUrl:\\s*['"])${escapeRegExp(oldUrl)}(['"])`, 'g');
  if (blockRegex.test(seedContent)) {
    seedContent = seedContent.replace(blockRegex, `$1${newUrl}$2`);
    console.log(`[seedOffers.js] Successfully updated id ${id} image banner.`);
  } else {
    console.warn(`[seedOffers.js] Warning: Could not locate block for id ${id} or image did not match.`);
  }
});

fs.writeFileSync(seedOffersPath, seedContent, 'utf8');
console.log('seedOffers.js updated successfully!');


// 2. Update backend/server.js DUMMY_DEALS
let serverContent = fs.readFileSync(serverPath, 'utf8');

const dummyReplacements = [
  { id: 'd1', newUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800' }, // Domino's
  { id: 'd2', newUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800' }, // iPhone 15
  { id: 'd3', newUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800' }, // Swiggy Instamart
  { id: 'd4', newUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800' }, // Myntra
  { id: 'd5', newUrl: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=800' }  // Urban Company
];

dummyReplacements.forEach(({ id, newUrl }) => {
  const dummyBlockRegex = new RegExp(`(id:\\s*["']${id}["'],[\\s\\S]*?imageUrl:\\s*["'])(["'])`, 'g');
  if (dummyBlockRegex.test(serverContent)) {
    serverContent = serverContent.replace(dummyBlockRegex, `$1${newUrl}$2`);
    console.log(`[server.js] Successfully updated DUMMY_DEAL ${id} image banner.`);
  } else {
    console.warn(`[server.js] Warning: Could not locate DUMMY_DEAL block for ${id}.`);
  }
});

fs.writeFileSync(serverPath, serverContent, 'utf8');
console.log('server.js updated successfully!');

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
