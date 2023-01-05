import {
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  TableCaption,
  Box,
} from "@chakra-ui/react"
import {useAtomValue} from "jotai"
import {Suspense} from "react"
import {databaseStatsAtom, SyncState, syncStateAtom} from "../../atoms"
import {DBStats} from "../../db"
import {formatTimestampAgo} from "../../helpers/dates"

export default function DatabaseStats() {
  return (
    <Suspense fallback={<StatsTable />}>
      <StatsTableWithData />
    </Suspense>
  )
}

function StatsTableWithData() {
  const stats = useAtomValue(databaseStatsAtom)
  const syncState = useAtomValue(syncStateAtom)
  return <StatsTable stats={stats} syncState={syncState} />
}

function StatsTable({
  stats,
  syncState,
}: {
  stats?: DBStats
  syncState?: SyncState
}) {
  const lastSyncTimestamp =
    syncState?.lastSyncTimestamp ?? stats?.lastSyncTimestamp

  return (
    <Box marginX={-4}>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Type</Th>
            <Th isNumeric>Count</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Markdown</Td>
            <Td isNumeric>{stats?.markdown.toLocaleString()}</Td>
          </Tr>
          <Tr>
            <Td>Scanned</Td>
            <Td isNumeric>{stats?.scanned.toLocaleString()}</Td>
          </Tr>
          <Tr>
            <Td>Scanned (cached)</Td>
            <Td isNumeric>{stats?.images.toLocaleString()}</Td>
          </Tr>
          <Tr>
            <Td>Audio</Td>
            <Td isNumeric>{stats?.audio.toLocaleString()}</Td>
          </Tr>
          <Tr>
            <Td>Layers</Td>
            <Td isNumeric>{stats?.layers.toLocaleString()}</Td>
          </Tr>
          <Tr>
            <Td>Events</Td>
            <Td isNumeric>{stats?.events.toLocaleString()}</Td>
          </Tr>
        </Tbody>
        <TableCaption opacity={lastSyncTimestamp != null ? 1 : 0}>
          Last synced{" "}
          {lastSyncTimestamp != null
            ? formatTimestampAgo(lastSyncTimestamp)
            : null}
        </TableCaption>
      </Table>
    </Box>
  )
}
