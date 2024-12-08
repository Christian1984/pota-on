import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const ParksMap = ({ call, qth, parks }: { call: string; qth: { lat: number; long: number }; parks: Park[] }) => {
    const mapRef = useRef(null);
    const map = useRef<L.Map | null>(null);

    const qthMarkerRef = useRef<L.Marker | null>(null);
    const parkMarkerRefs = useRef<L.CircleMarker[] | null>(null);
    const lineRefs = useRef<L.Polyline[] | null>(null);

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
                    color: "red",
                });
                parkMarker.addTo(map.current!);

                return parkMarker;
            });

            parkMarkerRefs.current = markers;

            return () => {
                parkMarkerRefs.current?.map((marker) => marker.remove());
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
                    { color: "red", opacity: 0.25 }
                );
                line.addTo(map.current!);

                return line;
            });

            lineRefs.current = lines;
            return () => {
                lineRefs.current?.map((line) => line.remove());
            };
        }
    }, [qth, parks]);

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
