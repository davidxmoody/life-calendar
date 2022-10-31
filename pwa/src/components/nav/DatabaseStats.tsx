import * as React from "react"
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  TableCaption,
} from "@chakra-ui/react"
import {useAtom} from "jotai"
import {databaseStatsAtom} from "../../atoms"
import {formatTimestampAgo} from "../../helpers/dates"

export default function DatabaseStats() {
  const [stats] = useAtom(databaseStatsAtom)

  return (
    <TableContainer>
      <Table size="sm">
        <TableCaption>
          Last synced {formatTimestampAgo(stats.lastSyncTimestamp)}
        </TableCaption>
        <Thead>
          <Tr>
            <Th>Type</Th>
            <Th isNumeric>Count</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Markdown</Td>
            <Td isNumeric>{stats.markdown.toLocaleString()}</Td>
          </Tr>
          <Tr>
            <Td>Scanned</Td>
            <Td isNumeric>{stats.scanned.toLocaleString()}</Td>
          </Tr>
          <Tr>
            <Td>Scanned (cached)</Td>
            <Td isNumeric>{stats.images.toLocaleString()}</Td>
          </Tr>
          <Tr>
            <Td>Audio</Td>
            <Td isNumeric>{stats.audio.toLocaleString()}</Td>
          </Tr>
          <Tr>
            <Td>Layers</Td>
            <Td isNumeric>{stats.layers.toLocaleString()}</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  )
}
