import { Table, Tabs } from "@mantine/core";
import { ParksTable } from "./ParksTabel";
import { ParksMap } from "./ParksMap";

const ParksView = ({
    call,
    parks,
    mapCenter,
}: {
    call: string;
    parks: Park[];
    mapCenter: { lat: number; long: number };
}) => {
    return (
        <Tabs defaultValue="map" style={{ flexGrow: "1", display: "flex", flexDirection: "column" }}>
            <Tabs.List grow>
                <Tabs.Tab value="map">Map</Tabs.Tab>
                <Tabs.Tab value="table">Table</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="map" style={{ flexGrow: "1", display: "flex", flexDirection: "column" }}>
                <ParksMap call={call} qth={mapCenter} parks={parks} />
            </Tabs.Panel>
            <Tabs.Panel value="table" pt="xs">
                <ParksTable call={call} parks={parks} />
            </Tabs.Panel>
        </Tabs>
    );
};

export { ParksView };
