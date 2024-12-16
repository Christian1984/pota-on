import { Loader, Table } from "@mantine/core";
import { useParksQuery } from "../clients/ParksClient";
import { useAppStore } from "../store/AppState";

export const ParksTable = () => {
    const { data: parks, isLoading: isParksLoading } = useParksQuery();

    const call = useAppStore((state) => state.call);
    const activationDetails = useAppStore((state) => state.activationDetails);

    const rows = parks.map((park) => {
        const details = activationDetails[park.reference];
        const detailsPendingContent = <Loader size={16} />;

        return (
            <Table.Tr key={park.reference}>
                <Table.Td>
                    <a href={`https://pota.app/#/park/${park.reference}`} target="_blank">
                        {park.reference}
                    </a>
                </Table.Td>
                <Table.Td>{details?.active == null ? detailsPendingContent : details.active ? "✅" : "⛔"}</Table.Td>
                <Table.Td>{park.name}</Table.Td>
                <Table.Td>{park.distance.toFixed(2)} km</Table.Td>
                <Table.Td>
                    {details?.activatedByOperator == null
                        ? detailsPendingContent
                        : details.activatedByOperator
                        ? "✅"
                        : ""}
                </Table.Td>
                <Table.Td>{details?.activations == null ? detailsPendingContent : details.activations}</Table.Td>
            </Table.Tr>
        );
    });

    return (
        // <Table stickyHeader stickyHeaderOffset={45}>
        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Reference</Table.Th>
                    <Table.Th>Active</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Distance</Table.Th>
                    <Table.Th>Activated by {call}</Table.Th>
                    <Table.Th>Total Activations</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
};
