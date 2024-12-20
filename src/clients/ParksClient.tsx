import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { throttle } from "../Throttle";
import { useAppStore } from "../store/AppState";

const calculateDistanceKm = (
    point1: { latitude: number; longitude: number },
    point2: { latitude: number; longitude: number }
): number => {
    const rEarth = 6371;
    const lat1 = point1.latitude * (Math.PI / 180);
    const lat2 = point2.latitude * (Math.PI / 180);
    const deltaLat = (point2.latitude - point1.latitude) * (Math.PI / 180);
    const deltaLon = (point2.longitude - point1.longitude) * (Math.PI / 180);

    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return rEarth * c;
};

export const useParksQuery = () => {
    const lat = useAppStore((state) => state.lat);
    const long = useAppStore((state) => state.long);
    const radiusDeg = useAppStore((state) => state.radius);

    return useQuery({
        queryKey: ["parks", lat, long, radiusDeg],
        enabled: false,
        initialData: [],
        queryFn: async () => {
            await throttle();

            const resp = await fetch(
                "https://api.pota.app/park/grids/" +
                    (lat - radiusDeg) +
                    "/" +
                    (long - radiusDeg) +
                    "/" +
                    (lat + radiusDeg) +
                    "/" +
                    (long + radiusDeg) +
                    "/0"
            );
            const parksResponse = (await resp.json()) as ParksResponse;
            const parksData: Park[] = parksResponse.features
                .map(
                    (feat: any) =>
                        ({
                            coordinates: {
                                long: feat.geometry.coordinates[0],
                                lat: feat.geometry.coordinates[1],
                            },
                            distance: calculateDistanceKm(
                                { longitude: long, latitude: lat },
                                { longitude: feat.geometry.coordinates[0], latitude: feat.geometry.coordinates[1] }
                            ),
                            reference: feat.properties.reference,
                            name: feat.properties.name,
                        } as Park)
                )
                .sort((a: Park, b: Park) => a.distance - b.distance);

            return parksData;
        },
    });
};

export const useActivationDetailsQueries = () => {
    const { data: parks } = useParksQuery();

    return useQueries({
        queries: parks.map((park) => ({
            queryKey: ["activation", park.reference],
            queryFn: async () => {
                await throttle();

                const resp = await fetch("https://api.pota.app/park/" + park.reference + "?count=all");
                const parkActivationResp = (await resp.json()) as ParkDetailsResponse;
                // console.log(park.name, parkActivationResp);
                const details: ParkActivationDetails = {
                    active: parkActivationResp.active == 1,
                    lastRefresh: new Date(),
                };

                return details;
            },
        })),
    });
};
