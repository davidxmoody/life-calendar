import {useAtom} from "jotai"
import {startTransition, useMemo} from "react"
import {selectedLayerIdsAtom} from "../../atoms"
import {useAllLayers} from "../../db"
import {Layer} from "../../types"
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

const ROW = "flex items-center gap-3 px-2 min-h-11 rounded-md cursor-pointer"

export default function LayerModal(props: Props) {
  const allLayers = useAllLayers()
  const [selectedLayerIds, setSelectedLayerIds] = useAtom(selectedLayerIdsAtom)

  const groups = useMemo(
    () => groupAndSortLayers(allLayers ?? [], selectedLayerIds),
    [allLayers, selectedLayerIds],
  )

  const defaultOpen = groups
    .filter((g) => g.layers.some((l) => l.isSelected))
    .map((g) => g.groupTitle)

  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={(open) => !open && props.onClose()}
    >
      <DialogContent className="max-w-sm gap-2">
        <DialogHeader>
          <DialogTitle>Layers</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto -mx-2">
          <Accordion type="multiple" defaultValue={defaultOpen}>
            {groups.map((group) => (
              <AccordionItem
                key={group.groupTitle}
                value={group.groupTitle}
                className="border-b-0"
              >
                <div className="flex items-stretch">
                  <label className={`${ROW} flex-1`}>
                    <Checkbox
                      className="size-5"
                      checked={
                        group.someSelected && !group.allSelected
                          ? "indeterminate"
                          : group.allSelected
                      }
                      onCheckedChange={() =>
                        startTransition(() =>
                          setSelectedLayerIds((existing) =>
                            toggle(
                              existing,
                              group.layers.map((l) => l.id),
                            ),
                          ),
                        )
                      }
                    />
                    <span className="text-base font-medium">
                      {group.groupTitle}
                    </span>
                  </label>
                  <AccordionTrigger className="px-3 py-0 flex-none [&>svg]:size-5" />
                </div>

                <AccordionContent className="pt-0 pb-1">
                  <div className="flex flex-col">
                    {group.layers.map((layer) => (
                      <label key={layer.id} className={`${ROW} pl-9`}>
                        <Checkbox
                          className="size-5"
                          checked={layer.isSelected}
                          onCheckedChange={() =>
                            startTransition(() =>
                              setSelectedLayerIds((existing) =>
                                toggle(existing, [layer.id]),
                              ),
                            )
                          }
                        />
                        <span
                          className="inline-block size-4 rounded-sm shrink-0"
                          style={{backgroundColor: layer.color}}
                          aria-hidden
                        />
                        <span className="text-base">{layer.title}</span>
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

interface ModalLayer {
  id: string
  title: string
  color: string
  order: number
  isSelected: boolean
}

interface ModalGroup {
  groupTitle: string
  minOrder: number
  allSelected: boolean
  someSelected: boolean
  layers: ModalLayer[]
}

function groupAndSortLayers(
  layers: Layer[],
  selectedLayerIds: string[],
): ModalGroup[] {
  const byTitle = new Map<string, ModalGroup>()

  for (const layer of layers) {
    const groupTitle = layer.groupTitle ?? "other"
    const order = layer.order ?? 0
    const modalLayer: ModalLayer = {
      id: layer.id,
      title: layer.title ?? layer.id,
      color: layer.color ?? "#A6E3A1",
      order,
      isSelected: selectedLayerIds.includes(layer.id),
    }

    let group = byTitle.get(groupTitle)
    if (!group) {
      group = {
        groupTitle,
        minOrder: order,
        allSelected: modalLayer.isSelected,
        someSelected: modalLayer.isSelected,
        layers: [],
      }
      byTitle.set(groupTitle, group)
    } else {
      group.minOrder = Math.min(group.minOrder, order)
      group.allSelected = group.allSelected && modalLayer.isSelected
      group.someSelected = group.someSelected || modalLayer.isSelected
    }
    group.layers.push(modalLayer)
  }

  const groups = Array.from(byTitle.values())
  for (const group of groups) {
    group.layers.sort(
      (a, b) => a.order - b.order || a.title.localeCompare(b.title),
    )
  }
  groups.sort(
    (a, b) =>
      a.minOrder - b.minOrder || a.groupTitle.localeCompare(b.groupTitle),
  )
  return groups
}
