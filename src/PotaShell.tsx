import { useEffect, useState } from "react";
import { AppShell, Burger, Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { HamInput } from "./components/HamInput";
import { ParksView } from "./components/ParksView";
import { throttle } from "./Throttle";
import { useQueryClient } from "@tanstack/react-query";
import { useParkQuery } from "./clients/ParksClient";

function PotaShell() {
    const throttleMs = 1000;
    const [opened, { toggle }] = useDisclosure();

    const [call, setCall] = useState("DN9CVR");
    const [lat, setLat] = useState(50.819649);
    const [long, setLong] = useState(6.97578);
    const [radiusDeg, setRadiusDeg] = useState(0.2);

    const [qth, setQth] = useState({ lat: lat, long: long });

    const [activationDetails, setActivationDetails] = useState<ActivationDetails>({});

    const { data: parks, isLoading: isParksLoading, refetch: fetchParks } = useParkQuery(lat, long, radiusDeg);

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

                setActivationDetails((details) => ({
                    ...details,
                    [park.reference]: { ...details[park.reference], ...newDetails },
                }));
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
                console.log(park.name, parkActivationResp);
                const newDetails: ParkActivationDetails = {
                    activations: parkActivationResp.filter((activation) => activation.totalQSOs >= 10).length,
                    activatedByOperator:
                        parkActivationResp.filter(
                            (activation) => activation.activeCallSign === call && activation.totalQSOs >= 10
                        ).length > 0,
                    lastRefresh: new Date(),
                };

                setActivationDetails((details) => ({
                    ...details,
                    [park.reference]: { ...details[park.reference], ...newDetails },
                }));
            } catch (e) {
                console.warn("could not update activation details for park [", park.name, "], reason:", e);
            }
        });
    }, [parks]);

    useEffect(() => {
        console.log(activationDetails);
    }, [activationDetails]);

    const findParks = async () => {
        setQth({ lat: lat, long: long });
        fetchParks();
    };

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

            <AppShell.Main style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <ParksView call={call} parks={parks} activationDetails={activationDetails} mapCenter={qth} />
            </AppShell.Main>
        </AppShell>
    );
}

export default PotaShell;
