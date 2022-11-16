import {AspectRatio, Box, Flex, Icon, Image, keyframes} from "@chakra-ui/react"
import {BsExclamationTriangleFill} from "react-icons/bs"
import useScannedUrl from "../../helpers/useScannedUrl"
import {ScannedEntry} from "../../types"

interface Props {
  entry: ScannedEntry
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

export default function ScannedPage(props: Props) {
  const {url, error} = useScannedUrl(props.entry)

  return (
    <Flex alignItems="center">
      <AspectRatio
        ratio={props.entry.width / props.entry.height}
        w="100%"
        bg={props.entry.averageColor}
        flexShrink={0}
      >
        <Box position="relative" width="100%" height="100%">
          {url ? (
            <Image
              src={url}
              position="absolute"
              width="100%"
              height="100%"
              animation={`${fadeIn} 0.3s`}
            />
          ) : null}
          {error ? (
            <Icon
              as={BsExclamationTriangleFill}
              color="blue.700"
              boxSize={12}
            />
          ) : null}
        </Box>
      </AspectRatio>
    </Flex>
  )
}
