import { useEffect, useState } from "react";
import { AppShell, Burger, Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { HamInput } from "./components/HamInput";
import { ParksView } from "./components/ParksView";
import { throttle } from "./Throttle";
import { useParkQuery } from "./clients/ParksClient";
import { useAppStore } from "./store/AppState";
import { useShallow } from "zustand/shallow";

function PotaShell() {
    const [opened, { toggle }] = useDisclosure();

    const call = useAppStore((state) => state.call);
    const lat = useAppStore((state) => state.lat);
    const long = useAppStore((state) => state.long);
    const [activationDetails, setActivationDetails] = useAppStore(
        useShallow((state) => [state.activationDetails, state.setActivationDetails])
    );

    const { data: parks, isLoading: isParksLoading, refetch: fetchParks } = useParkQuery();

    useEffect(() => {
        parks.map(async (park) => {
            try {
                await throttle();

                const resp = await fetch("https://api.pota.app/park/" + park.reference + "?count=all");
                const parkActivationResp = (await resp.json()) as ParkDetailsResponse;
                // console.log(park.name, parkActivationResp);
                const newDetails: ParkActivationDetails = {
                    active: parkActivationResp.active == 1,
                    lastRefresh: new Date(),
                };

                setActivationDetails(park.reference, newDetails);
            } catch (e) {
                console.warn("could not update activation details for park [", park.name, "], reason:", e);
            }
        });
    }, [parks]);

    useEffect(() => {
        parks.map(async (park) => {
            try {
                await throttle();

                const resp = await fetch("https://api.pota.app/park/activations/" + park.reference + "?count=all");
                const parkActivationResp = (await resp.json()) as ParkActivationResponse;
                if (park.reference == "DE-0048") {
                    console.log(park.name, parkActivationResp);
                    console.log(
                        parkActivationResp.filter(
                            (activation) => activation.activeCallsign === call && activation.totalQSOs >= 10
                        )
                    );
                }
                const newDetails: ParkActivationDetails = {
                    activations: parkActivationResp.filter((activation) => activation.totalQSOs >= 10).length,
                    activatedByOperator:
                        parkActivationResp.filter(
                            (activation) => activation.activeCallsign === call && activation.totalQSOs >= 10
                        ).length > 0,
                    lastRefresh: new Date(),
                };

                setActivationDetails(park.reference, newDetails);
            } catch (e) {
                console.warn("could not update activation details for park [", park.name, "], reason:", e);
            }
        });
    }, [parks]);

    // useEffect(() => {
    //     console.log("activationDetails changed ->", activationDetails);
    // }, [activationDetails]);

    return (
        <AppShell
            header={{ height: 48 }}
            navbar={{
                width: 300,
                breakpoint: "sm",
                collapsed: { mobile: !opened },
            }}
            styles={{ main: { height: "100%" } }}
            padding={0}>
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Title order={3}>pota on (by DN9CVR)</Title>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md" withBorder={false}>
                <HamInput />
            </AppShell.Navbar>

            <AppShell.Main style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <ParksView />
            </AppShell.Main>
        </AppShell>
    );
}

export default PotaShell;
