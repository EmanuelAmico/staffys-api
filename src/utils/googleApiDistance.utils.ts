import axios from "axios";

const parseDistance = (distanceText: string): number => {
  const distanceValue = parseFloat(distanceText.replace(/[^0-9.]/g, ""));
  return distanceValue;
};

export const geocodeAddress = async (address: string, province: string) => {
  const countryFilter = "country:AR";
  const provinceFilter = `administrative_area:${encodeURIComponent(province)}`;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&components=${encodeURIComponent(countryFilter)}|${encodeURIComponent(
    provinceFilter
  )}&key=${process.env.GOOGLE_API_KEY}`;

  const response = await axios.get(url);

  if (
    response.data &&
    response.data.results &&
    response.data.results.length > 0
  ) {
    const { lat, lng } = response.data.results[0].geometry.location;
    return { lat, lng };
  }

  return null;
};

export const calculateDistanceUsingDirectionsAPI = async (
  originLat: number,
  originLng: number,
  destinationLat: number,
  destinationLng: number
) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destinationLat},${destinationLng}&key=${process.env.GOOGLE_API_KEY}`;
    const response = await axios.get(url);

    if (
      response.data &&
      response.data.routes &&
      response.data.routes.length > 0 &&
      response.data.routes[0].legs &&
      response.data.routes[0].legs.length > 0
    ) {
      const distanceText = response.data.routes[0].legs[0].distance.text;
      const distanceInKm = parseDistance(distanceText);

      return distanceInKm;
    }

    return null;
  } catch (error) {
    console.error(error);
  }
};
