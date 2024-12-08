import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const ParksMap = ({ call, center, parks }: { call: string; center: { lat: number; long: number }; parks: Park[] }) => {
    const mapRef = useRef(null);
    const map = useRef<L.Map | null>(null);

    useEffect(() => {
        if (map.current) {
            map.current.panTo({ lat: center.lat, lng: center.long });
        }
    }, [center]);

    useEffect(() => {
        if (map.current == null) {
            map.current = L.map("map").setView([center.lat, center.long], 13);
            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map.current);
        }
    }, []);

    return <div ref={mapRef} id="map" style={{ flexGrow: "1", height: "100%" }}></div>;
};

export { ParksMap };
