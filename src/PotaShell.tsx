import { useEffect, useState } from "react";
import { AppShell, Burger, Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { HamInput } from "./components/HamInput";
import { ParksView } from "./components/ParksView";
import { throttle } from "./Throttle";

function PotaShell() {
    const throttleMs = 1000;
    const [opened, { toggle }] = useDisclosure();

    const [call, setCall] = useState("DN9CVR");
    const [lat, setLat] = useState(50.819649);
    const [long, setLong] = useState(6.97578);
    const [radiusDeg, setRadiusDeg] = useState(0.2);

    const [qth, setQth] = useState({ lat: lat, long: long });

    const [parks, setParks] = useState<Park[]>([]);
    const [activationDetails, setActivationDetails] = useState<ActivationDetails>({});

    useEffect(() => {
        parks.map(async (park) => {
            try {
                await throttle(Math.random() * throttleMs + throttleMs);

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
                await throttle(Math.random() * throttleMs + throttleMs);

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

    const calculateDistanceKm = (
        point1: { latitude: number; longitude: number },
        point2: { latitude: number; longitude: number }
    ): number => {
        const rEarth = 6371;
        const lat1 = point1.latitude * (Math.PI / 180);
        const lat2 = point2.latitude * (Math.PI / 180);
        const deltaLat = (point2.latitude - point1.latitude) * (Math.PI / 180);
        const deltaLon = (point2.longitude - point1.longitude) * (Math.PI / 180);

        const a =
            Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return rEarth * c;
    };

    const findParks = async () => {
        setQth({ lat: lat, long: long });

        const resp = await fetch(
            "https://api.pota.app/park/grids/" +
                (lat - radiusDeg) +
                "/" +
                (long - radiusDeg) +
                "/" +
                (lat + radiusDeg) +
                "/" +
                (long + radiusDeg) +
                "/0"
        );
        const parksResponse = (await resp.json()) as ParksResponse;
        const parksData: Park[] = parksResponse.features
            .map(
                (feat: any) =>
                    ({
                        coordinates: {
                            long: feat.geometry.coordinates[0],
                            lat: feat.geometry.coordinates[1],
                        },
                        distance: calculateDistanceKm(
                            { longitude: long, latitude: lat },
                            { longitude: feat.geometry.coordinates[0], latitude: feat.geometry.coordinates[1] }
                        ),
                        reference: feat.properties.reference,
                        name: feat.properties.name,
                    } as Park)
            )
            .sort((a: Park, b: Park) => a.distance - b.distance);
        // .slice(0, 10);

        setParks(parksData);
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
