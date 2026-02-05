import {useAtomValue} from "jotai"
import {SyncState, syncStateAtom} from "../../atoms"
import {DBStats, useDatabaseStats} from "../../db"
import {formatTimestampAgo} from "../../helpers/dates"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"

export default function DatabaseStats() {
  const stats = useDatabaseStats()
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
    <div className="-mx-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Entries</TableCell>
            <TableCell className="text-right">
              {stats?.entries.toLocaleString()}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Layers</TableCell>
            <TableCell className="text-right">
              {stats?.layers.toLocaleString()}
            </TableCell>
          </TableRow>
        </TableBody>
        <TableCaption
          className={lastSyncTimestamp != null ? "opacity-100" : "opacity-0"}
        >
          Last synced{" "}
          {lastSyncTimestamp != null
            ? formatTimestampAgo(lastSyncTimestamp)
            : null}
        </TableCaption>
      </Table>
    </div>
  )
}
