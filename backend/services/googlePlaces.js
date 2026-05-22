const CATEGORY_TYPES = {
  food: 'restaurant',
  grocery: 'supermarket',
  traveling: 'lodging',
  shopping: 'shopping_mall',
  home: 'home_goods_store'
};

const getNearbyPlaces = async ({ lat, lng, radius = 5, category }) => {
  if (!process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API_KEY === 'YOUR_KEY_HERE') {
    return [];
  }

  const mappedType = CATEGORY_TYPES[category] || undefined;
  const params = new URLSearchParams({
    location: `${lat},${lng}`,
    radius: String(Number(radius) * 1000),
    key: process.env.GOOGLE_PLACES_API_KEY
  });

  if (mappedType) {
    params.append('type', mappedType);
  }

  const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Google Places request failed with ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data.results)) {
    return [];
  }

  return data.results.map((place) => ({
    placeId: place.place_id,
    name: place.name,
    address: place.vicinity || place.formatted_address || '',
    rating: place.rating,
    photo: place.photos && place.photos[0]
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
      : undefined,
    coordinates: {
      lat: place.geometry && place.geometry.location ? place.geometry.location.lat : undefined,
      lng: place.geometry && place.geometry.location ? place.geometry.location.lng : undefined
    },
    openNow: place.opening_hours ? place.opening_hours.open_now : undefined,
    source: 'google_places'
  }));
};

module.exports = { getNearbyPlaces };
