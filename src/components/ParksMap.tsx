import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useParkQuery } from "../clients/ParksClient";
import { useAppStore } from "../store/AppState";

const ParksMap = () => {
    const { data: parks, isLoading: isParksLoading } = useParkQuery();

    const call = useAppStore((state) => state.call);
    const qth = useAppStore((state) => state.qth);
    const activationDetails = useAppStore((state) => state.activationDetails);

    const mapRef = useRef(null);
    const map = useRef<L.Map | null>(null);

    const qthMarkerRef = useRef<L.Marker | null>(null);
    const parkMarkerRefs = useRef<{ reference: string; marker: L.CircleMarker }[] | null>([]);
    const lineRefs = useRef<{ reference: string; line: L.Polyline }[]>([]);

    const inactiveColor = "gray";
    const newParkColor = "red";
    const alreadyActivatedByMeColor = "green";
    const activeParkColor = "yellow";

    useEffect(() => {
        if (map.current) {
            map.current.panTo({ lat: qth.lat, lng: qth.long });
            qthMarkerRef.current = L.marker([qth.lat, qth.long]);
            qthMarkerRef.current.addTo(map.current);
        }
        return () => {
            qthMarkerRef.current?.remove();
            qthMarkerRef.current = null;
        };
    }, [qth]);

    useEffect(() => {
        if (map.current) {
            const markers = parks.map((park) => {
                const parkMarker = L.circleMarker([park.coordinates.lat, park.coordinates.long], {
                    radius: 10,
                    color: inactiveColor,
                });
                parkMarker.addTo(map.current!);

                return { reference: park.reference, marker: parkMarker };
            });

            parkMarkerRefs.current = markers;

            return () => {
                parkMarkerRefs.current?.map((marker) => marker.marker.remove());
            };
        }
    }, [parks]);

    useEffect(() => {
        if (map.current) {
            const lines = parks.map((park) => {
                const line = L.polyline(
                    [
                        [qth.lat, qth.long],
                        [park.coordinates.lat, park.coordinates.long],
                    ],
                    { color: inactiveColor, opacity: 0.25 }
                );
                line.addTo(map.current!);

                return { reference: park.reference, line: line };
            });

            lineRefs.current = lines;
            return () => {
                lineRefs.current?.map((line) => line.line.remove());
            };
        }
    }, [qth, parks]);

    useEffect(() => {
        Object.keys(activationDetails).map((key) => {
            const details = activationDetails[key];
            const marker = parkMarkerRefs.current?.find((marker) => marker.reference == key);
            const line = lineRefs.current?.find((line) => line.reference == key);
            if (details.activations == 0) {
                marker?.marker.setStyle({ color: newParkColor });
                line?.line.setStyle({ color: newParkColor });
            } else if (details.activatedByOperator) {
                marker?.marker.setStyle({ color: alreadyActivatedByMeColor });
                line?.line.setStyle({ color: alreadyActivatedByMeColor });
            } else if (details.active) {
                marker?.marker.setStyle({ color: activeParkColor });
                line?.line.setStyle({ color: activeParkColor });
            }
        });
    }, [activationDetails]);

    useEffect(() => {
        if (map.current == null) {
            map.current = L.map("map").setView([qth.lat, qth.long], 13);
            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map.current);
        }
    }, []);

    return <div ref={mapRef} id="map" style={{ flexGrow: "1", height: "100%" }}></div>;
};

export { ParksMap };
