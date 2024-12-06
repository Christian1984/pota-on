import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import PotaShell from "./PotaShell";

export default function App() {
    return (
        <MantineProvider theme={theme}>
            <PotaShell />
        </MantineProvider>
    );
}
