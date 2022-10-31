import * as React from "react"
import {UnorderedList, ListItem, Box} from "@chakra-ui/react"
import {useAtom} from "jotai"
import {databaseStatsAtom} from "../../atoms"

export default function DatabaseStats() {
  const [stats] = useAtom(databaseStatsAtom)

  return (
    <Box>
      <UnorderedList>
        {stats ? (
          <>
            <ListItem>
              {(stats.markdown + stats.scanned + stats.audio).toLocaleString()}{" "}
              entries
            </ListItem>
            <ListItem>{stats.images.toLocaleString()} cached images</ListItem>
          </>
        ) : (
          <ListItem>Loading stats...</ListItem>
        )}
      </UnorderedList>
    </Box>
  )
}
