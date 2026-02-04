import {memo, useState} from "react"
import {isValidRemoteUrl, useRemoteUrl} from "../helpers/auth"
import {Button} from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import {Input} from "./ui/input"

export default memo(function FirstTimeSetupModal() {
  const [remoteUrl, setRemoteUrl] = useRemoteUrl()
  const [inputValue, setInputValue] = useState("")

  const inputValueIsValid = isValidRemoteUrl(inputValue)

  return (
    <Dialog open={!remoteUrl}>
      <DialogContent showCloseButton={false} className="max-w-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (inputValueIsValid) {
              setRemoteUrl(inputValue)
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>First time setup</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              autoFocus
              placeholder="Remote server URL"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              aria-invalid={!inputValueIsValid}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              inputMode="url"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!inputValueIsValid}>
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
})
