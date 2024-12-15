import { Table, Tabs } from "@mantine/core";
import { ParksMap } from "./ParksMap";
import { ParksTable } from "./ParksTable";

const ParksView = () => {
    return (
        <Tabs defaultValue="map" style={{ flexGrow: "1", display: "flex", flexDirection: "column" }}>
            <Tabs.List grow>
                <Tabs.Tab value="map">Map</Tabs.Tab>
                <Tabs.Tab value="table">Table</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="map" style={{ flexGrow: "1", display: "flex", flexDirection: "column" }}>
                <ParksMap />
            </Tabs.Panel>
            <Tabs.Panel value="table" pt="xs">
                <ParksTable />
            </Tabs.Panel>
        </Tabs>
    );
};

export { ParksView };
