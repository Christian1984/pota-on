import { Button, Divider, Group, Loader, TextInput } from "@mantine/core";
import { useAppStore } from "../store/AppState";
import { useShallow } from "zustand/shallow";
import { useParkQuery } from "../clients/ParksClient";

const HamInput = () => {
    const [call, setCall] = useAppStore(useShallow((state) => [state.call, state.setCall]));
    const [lat, setLat] = useAppStore(useShallow((state) => [state.lat, state.setLat]));
    const [long, setLong] = useAppStore(useShallow((state) => [state.long, state.setLong]));
    const [radius, setRadius] = useAppStore(useShallow((state) => [state.radius, state.setRadius]));

    const setQth = useAppStore((state) => state.setQth);

    const { isFetching: isParksFetching, refetch: fetchParks } = useParkQuery(lat, long, radius);

    return (
        <>
            <Divider my="xs" label="Operator Info" labelPosition="left" />

            <TextInput
                label="Callsign"
                type="text"
                placeholder="DN9CVR"
                value={call}
                onChange={(e) => {
                    setCall(e.target.value);
                }}
            />

            <Divider my="xs" label="Location" labelPosition="left" />

            <TextInput
                label="Latitude"
                type="number"
                placeholder="50.819649"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value))}
            />

            <TextInput
                label="Longitude"
                type="number"
                placeholder="6.97578"
                value={long}
                onChange={(e) => setLong(parseFloat(e.target.value))}
            />

            {/* <Divider my="xs" label="or" variant="dashed" />

            <TextInput
                label="Maidenhead Locator"
                type="text"
                placeholder="JO30lt"
                value={call}
                onChange={(e) => setCall(e.target.value)}
            /> */}

            <Group justify="flex-end" mt="md">
                <Button
                    type="button"
                    onClick={() => {
                        setQth({ lat: lat, long: long });
                        fetchParks();
                    }}
                    disabled={isNaN(lat) || isNaN(long) || call.length < 1 || isParksFetching}>
                    {!isParksFetching && <>Find Parks</>}
                    {isParksFetching && <Loader size={16} type="dots" />}
                </Button>
            </Group>
        </>
    );
};
export { HamInput };
