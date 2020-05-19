import { getGeoDistanceInMeters } from '../utils/geo';

const Endpoints = Object.freeze({
  LOCATIONS: "https://storage.googleapis.com/engineering-4b0b7d62/locations_filtered.json"
});

/**
 * Get a list of location objects. The locations are sorted by distance from the 
 * provided origin, and formatted for display in the UI.
 */
function getLocations(originLoc, customFetchPromise = null) {
  const fetchPromise = customFetchPromise || fetch(Endpoints.LOCATIONS);

  return fetchPromise
    .then((response) => response.json())
    .then((locationData) => {
      // Map server location data to local location items
      let locationItems = locationData.map((loc) => {
        const distanceInMeters = getGeoDistanceInMeters(loc, originLoc);
        return {
          id: loc.id,
          name: loc.name,
          distance: distanceInMeters,
          isFollowed: loc.following,
        };
      });
      return locationItems.sort((a, b) => a.distance - b.distance);
    });
}

export {
  getLocations,
};
