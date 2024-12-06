import { useEffect, useState } from "react";
import { AppShell, Burger, Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { HamInput } from "./components/HamInput";

function PotaShell() {
    const [opened, { toggle }] = useDisclosure();

    const [call, setCall] = useState("DN9CVR");
    const [lat, setLat] = useState(50.819649);
    const [long, setLong] = useState(6.97578);

    const findParks = async () => {
        const resp = await fetch(
            "https://api.pota.app/park/grids/" +
                (lat - 1) +
                "/" +
                (long + 1) +
                "/" +
                (lat + 1) +
                "/" +
                (long + 1) +
                "/0"
        );
        const json = await resp.json();
        console.log(json.features.length, json);
    };

    return (
        <AppShell
            header={{ height: 48 }}
            navbar={{
                width: 300,
                breakpoint: "sm",
                collapsed: { mobile: !opened },
            }}
            padding="md">
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Title order={2}>pota on</Title>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <HamInput
                    call={call}
                    setCall={setCall}
                    lat={lat}
                    setLat={setLat}
                    long={long}
                    setLong={setLong}
                    onFindParksClicked={findParks}
                />
            </AppShell.Navbar>

            <AppShell.Main>Main</AppShell.Main>
        </AppShell>
    );
}

export default PotaShell;
