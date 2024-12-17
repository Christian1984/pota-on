import { Button, Divider, Group, Loader, TextInput } from "@mantine/core";
import { useAppStore } from "../store/AppState";
import { useShallow } from "zustand/shallow";
import { useParksQuery } from "../clients/ParksClient";
import { useState } from "react";

const HamInput = () => {
  const [appCall, setAppCall] = useAppStore(useShallow((state) => [state.call, state.setCall]));
  const [appLat, setAppLat] = useAppStore(useShallow((state) => [state.lat, state.setLat]));
  const [appLong, setAppLong] = useAppStore(useShallow((state) => [state.long, state.setLong]));
  const [appRadius, setAppRadius] = useAppStore(useShallow((state) => [state.radius, state.setRadius]));

  const [call, setCall] = useState(appCall);
  const [lat, setLat] = useState(appLat);
  const [long, setLong] = useState(appLong);
  const [radius, setRadius] = useState(appRadius);

  const setQth = useAppStore((state) => state.setQth); // TODO: remove

  const { isFetching: isParksFetching, refetch: fetchParks } = useParksQuery();

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
            setAppCall(call);
            setAppLat(lat);
            setAppLong(long);
            setAppRadius(radius);
            setQth({ lat: lat, long: long }); // TODO: remove
            fetchParks();
          }}
          disabled={isNaN(lat) || isNaN(long) || call.length < 1 || isParksFetching}
        >
          {!isParksFetching && <>Find Parks</>}
          {isParksFetching && <Loader size={16} type="dots" />}
        </Button>
      </Group>
    </>
  );
};
export { HamInput };
