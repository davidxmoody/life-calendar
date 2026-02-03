import {useAtom, useAtomValue} from "jotai"
import {startTransition} from "react"
import {layerIdsAtom, searchRegexAtom, selectedLayerIdsAtom} from "../../atoms"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"
import {Checkbox} from "../ui/checkbox"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "../ui/dialog"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function LayerModal(props: Props) {
  const [searchRegex, setSearchRegex] = useAtom(searchRegexAtom)
  const layerIds = useAtomValue(layerIdsAtom)
  const [selectedLayerIds, setSelectedLayerIds] = useAtom(selectedLayerIdsAtom)

  const groups = groupLayers(layerIds, selectedLayerIds)

  const defaultOpen = groups
    .filter((group) => group.layers.some((l) => l.isSelected))
    .map((group) => group.groupName)

  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={(open) => !open && props.onClose()}
    >
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>Layers</DialogTitle>
        </DialogHeader>
        <div className="pb-4">
          <div
            className="overflow-hidden transition-all duration-400"
            style={{
              height: searchRegex ? 36 : 0,
              opacity: searchRegex ? 1 : 0,
            }}
          >
            <label className="flex items-center gap-2 pl-4 h-9">
              <Checkbox
                checked={!!searchRegex}
                onCheckedChange={() =>
                  startTransition(() => setSearchRegex(""))
                }
              />
              <span>search</span>
            </label>
          </div>

          <Accordion type="multiple" defaultValue={defaultOpen}>
            {groups.map(({groupName, allSelected, someSelected, layers}) => (
              <AccordionItem key={groupName} value={groupName}>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 pl-4 pr-2">
                    <Checkbox
                      disabled={!!searchRegex}
                      checked={
                        someSelected && !allSelected
                          ? "indeterminate"
                          : allSelected
                      }
                      onCheckedChange={() =>
                        startTransition(() =>
                          setSelectedLayerIds((existingLayerIds) =>
                            toggle(
                              existingLayerIds,
                              layers.map((x) => x.layerId),
                            ),
                          ),
                        )
                      }
                    />
                    <span>{groupName}</span>
                  </label>
                  <AccordionTrigger className="flex-1 justify-end py-2" />
                </div>

                <AccordionContent>
                  <div className="flex flex-col gap-1 ml-6">
                    {layers.map(({layerId, layerName, isSelected}) => (
                      <label key={layerId} className="flex items-center gap-2">
                        <Checkbox
                          disabled={!!searchRegex}
                          checked={isSelected}
                          onCheckedChange={() =>
                            startTransition(() =>
                              setSelectedLayerIds((existingLayerIds) =>
                                toggle(existingLayerIds, [layerId]),
                              ),
                            )
                          }
                        />
                        <span>{layerName}</span>
                      </label>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function toggle(existing: string[], changed: string[]) {
  if (changed.some((x) => existing.includes(x))) {
    return existing.filter((x) => !changed.includes(x))
  }

  return [...existing, ...changed]
}

function groupLayers(layerIds: string[], selectedLayerIds: string[]) {
  const groups: Array<{
    groupName: string
    allSelected: boolean
    someSelected: boolean
    layers: Array<{layerId: string; layerName: string; isSelected: boolean}>
  }> = []

  for (const layerId of layerIds) {
    const {groupName, layerName} = decomposeLayerId(layerId)

    const layer = {
      layerId,
      layerName,
      isSelected: selectedLayerIds.includes(layerId),
    }

    const group = groups.find((g) => g.groupName === groupName)
    if (group) {
      group.layers.push(layer)
      group.allSelected = group.allSelected && layer.isSelected
      group.someSelected = group.someSelected || layer.isSelected
    } else {
      groups.push({
        groupName,
        allSelected: layer.isSelected,
        someSelected: layer.isSelected,
        layers: [layer],
      })
    }
  }

  return groups
}

function decomposeLayerId(layerId: string) {
  const separatorIndex = layerId.indexOf("/")
  if (separatorIndex <= 0 || separatorIndex === layerId.length - 1) {
    return {groupName: "other", layerName: layerId}
  }

  return {
    groupName: layerId.slice(0, separatorIndex),
    layerName: layerId.slice(separatorIndex + 1),
  }
}
