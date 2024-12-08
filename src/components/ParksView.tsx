import { Table, Tabs } from "@mantine/core";
import { ParksTable } from "./ParksTabel";
import { ParksMap } from "./ParksMap";

const ParksView = ({ call, parks }: { call: string; parks: Park[] }) => {
    return (
        <Tabs defaultValue="map">
            <Tabs.List grow>
                <Tabs.Tab value="map">Map</Tabs.Tab>
                <Tabs.Tab value="table">Table</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="map" pt="xs">
                <ParksMap call={call} parks={parks} />
            </Tabs.Panel>
            <Tabs.Panel value="table" pt="xs">
                <ParksTable call={call} parks={parks} />
            </Tabs.Panel>
        </Tabs>
    );
};

export { ParksView };
