export const calculateDistanceAndTime = (distanceInMeters) => {
    const distanceInKm = (distanceInMeters / 1000).toFixed(1);
    const averageSpeed = 5.5; // Average speed in km/h
    const timeInMinutes = Math.ceil((distanceInKm / averageSpeed) * 60);
    return { distanceInKm, timeInMinutes };
};
