import { Table } from "@mantine/core";

const ParksTable = ({ call, parks }: { call: string; parks: Park[] }) => {
    const rows = parks.map((park) => (
        <Table.Tr key={park.name}>
            <Table.Td>
                <a href={`https://pota.app/#/park/${park.reference}`} target="_blank">
                    {park.reference}
                </a>
            </Table.Td>
            <Table.Td>{park.active ? "✅" : "⛔"}</Table.Td>
            <Table.Td>{park.name}</Table.Td>
            <Table.Td>{park.distance.toFixed(2)} km</Table.Td>
            <Table.Td>{park.activatedByOperator ? "✅" : ""}</Table.Td>
            <Table.Td>{park.activations}</Table.Td>
        </Table.Tr>
    ));
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

export { ParksTable };
