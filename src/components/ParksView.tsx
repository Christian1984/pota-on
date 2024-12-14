import { Table, Tabs } from "@mantine/core";
import { ParksMap } from "./ParksMap";
import { ParksTable } from "./ParksTable";

const ParksView = ({
    call,
    parks,
    activationDetails,
    mapCenter,
}: {
    call: string;
    parks: Park[];
    activationDetails: ActivationDetails;
    mapCenter: { lat: number; long: number };
}) => {
    return (
        <Tabs defaultValue="map" style={{ flexGrow: "1", display: "flex", flexDirection: "column" }}>
            <Tabs.List grow>
                <Tabs.Tab value="map">Map</Tabs.Tab>
                <Tabs.Tab value="table">Table</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="map" style={{ flexGrow: "1", display: "flex", flexDirection: "column" }}>
                <ParksMap call={call} qth={mapCenter} parks={parks} activationDetails={activationDetails} />
            </Tabs.Panel>
            <Tabs.Panel value="table" pt="xs">
                <ParksTable call={call} parks={parks} activationDetails={activationDetails} />
            </Tabs.Panel>
        </Tabs>
    );
};

export { ParksView };
