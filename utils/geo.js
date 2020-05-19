// NOTE(christoffer)
// The haversine formule caluclates distances on a perfect Sphere. However
// the Earth isn't perfectly round (it's flatter at the poles). Exactly what
// the best value to use as an approximation for the radius of the Earth
// seems to be up for debate. For our purposes we chose the Mean Radius as 
// defined by International Union of Geodesy and Geophysics.
//
// I have no idea what that is, but boy does that name give the impression 
// that they know stuff about how big the Earth is!. But in seriousness this
// is the value used on the Wikipedia page discussing Geographical distance, 
// so it's bound to have at least some merit.
//
// Ref: 
// https://en.wikipedia.org/wiki/Earth_radius#Mean_radius
// https://en.wikipedia.org/wiki/Geographical_distance
const EARTH_MEAN_RADIUS_KM = 6371.0;

/**
 * Returns the approximate distance (in meters) between two locations on Earth.
 * The locations are given as objects like {latitude: Number, longitude: Number}.
 * 
 * The returned value is not the exact distance, but rather an approximation accurate
 * to a couple of meters. The function has an unhandled special case where the two 
 * locations are on, or close to, different polar sides of the earth.
 * 
 * See https://en.wikipedia.org/wiki/Haversine_formula for more information.
 */
function getGeoDistanceInMeters(locA, locB) {
  const _hav = (angleRad) => (1 - Math.cos(angleRad)) / 2;
  const _degToRad = (deg) => deg * Math.PI / 180;

  // Reduce list of locations by distance from center location.
  const pointARad = { latitude: _degToRad(locB.latitude), longitude: _degToRad(locB.longitude) };
  const pointBRad = { latitude: _degToRad(locA.latitude), longitude: _degToRad(locA.longitude) };
  const deltaLat = pointARad.latitude - pointBRad.latitude;
  const deltaLong = pointARad.longitude - pointBRad.longitude;

  const h = _hav(deltaLat) + Math.cos(pointBRad.latitude) * Math.cos(pointARad.latitude) * _hav(deltaLong);
  const distanceKm = 2 * EARTH_MEAN_RADIUS_KM * Math.asin(Math.sqrt(h));
  return Math.round(distanceKm * 1000);
}

export {
  getGeoDistanceInMeters
};
