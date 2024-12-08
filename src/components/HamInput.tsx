import { Button, Checkbox, Divider, Group, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";

const HamInput = ({
    call,
    setCall,
    lat,
    setLat,
    long,
    setLong,
    onFindParksClicked,
}: {
    call: string;
    setCall: React.Dispatch<React.SetStateAction<string>>;
    lat: number;
    setLat: React.Dispatch<React.SetStateAction<number>>;
    long: number;
    setLong: React.Dispatch<React.SetStateAction<number>>;
    onFindParksClicked: () => void;
}) => {
    const form = useForm({
        mode: "controlled",
        initialValues: {
            email: "",
            termsOfService: false,
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
        },
    });

    return (
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
            {/* <Title order={2}> Operator Info</Title> */}
            <Divider my="xs" label="Operator Info" labelPosition="left" />

            <TextInput
                label="Callsign"
                type="text"
                placeholder="DN9CVR"
                value={call}
                onChange={(e) => setCall(e.target.value)}
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
                    onClick={onFindParksClicked}
                    disabled={isNaN(lat) || isNaN(long) || call.length < 1}>
                    Find Parks
                </Button>
            </Group>
        </form>
    );
};
export { HamInput };
