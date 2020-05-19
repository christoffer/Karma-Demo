/**
 * Formats a distance in meters to a format suitable for human perception.
 * Distances are gradually made more fuzzy roughly along with the decreasing 
 * ability to distinguish between them.
 * 
 * Note, this formatter does not consier locale or language.
 */
function formatDistanceForHumans(distanceInMeters) {
  let roughDistance;
  if (distanceInMeters < 250) {
    roughDistance = Math.round(distanceInMeters / 5) * 5;
  } else if (distanceInMeters < 1000) {
    roughDistance = Math.round(distanceInMeters / 50) * 50;
  } else if (distanceInMeters < 10000) {
    roughDistance = Math.round(distanceInMeters / 100) * 100;
  } else {
    roughDistance = Math.round(distanceInMeters / 1000) * 1000;
  }

  if (roughDistance < 1000) {
    return `${roughDistance}m`;
  } else if (roughDistance < 20000) {
    return `${(roughDistance / 1000).toFixed(1)}km`
  } else {
    return `${(roughDistance / 10000).toFixed(1)}mil`
  }
}

export {
  formatDistanceForHumans,
};
