import legacyOffers from '../data/seedOffers.js';

console.log('Starting Network deep scan of all deal banner images in seedOffers.js...');

async function testImages() {
  const brokenImages = [];
  const checked = new Set();

  for (const offer of legacyOffers) {
    const img = offer.imageUrl;
    if (!img) {
      console.log(`Offer ${offer.id} has no image URL.`);
      continue;
    }
    if (checked.has(img)) continue;
    checked.add(img);

    try {
      const res = await fetch(img, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: AbortSignal.timeout(5000)
      });

      if (res.status !== 200) {
        brokenImages.push({ id: offer.id, title: offer.title, imageUrl: img, status: res.status });
        console.log(`❌ Broken Image: Offer ${offer.id} - ${offer.title} [Status ${res.status}]`);
      } else {
        console.log(`✅ OK: Offer ${offer.id} - ${offer.title}`);
      }
    } catch (err) {
      brokenImages.push({ id: offer.id, title: offer.title, imageUrl: img, error: err.message });
      console.log(`❌ Network Error: Offer ${offer.id} - ${offer.title} [${err.message}]`);
    }
  }

  console.log('\n--- Deep Scan Network Results ---');
  console.log(`Total unique images checked: ${checked.size}`);
  console.log(`Total broken/inaccessible images: ${brokenImages.length}`);
  if (brokenImages.length > 0) {
    console.log(JSON.stringify(brokenImages, null, 2));
  }
}

testImages();
