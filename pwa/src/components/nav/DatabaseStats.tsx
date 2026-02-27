import {useAtomValue} from "jotai"
import {SyncState, syncStateAtom} from "../../atoms"
import {DBStats, useDatabaseStats} from "../../db"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"

const rtf = new Intl.RelativeTimeFormat(undefined, {numeric: "auto"})

function formatTimestampAgo(timestamp: number): string {
  const seconds = Math.round((timestamp - Date.now()) / 1000)
  const absSeconds = Math.abs(seconds)

  if (absSeconds < 60) return rtf.format(seconds, "second")
  const minutes = Math.round(seconds / 60)
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute")
  const hours = Math.round(seconds / 3600)
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour")
  const days = Math.round(seconds / 86400)
  return rtf.format(days, "day")
}

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
