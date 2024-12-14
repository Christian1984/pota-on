import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import PotaShell from "./PotaShell";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
    return (
        <MantineProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <PotaShell />
            </QueryClientProvider>
        </MantineProvider>
    );
}
