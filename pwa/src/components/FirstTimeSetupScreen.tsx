import {memo, useState} from "react"
import {Loader2} from "lucide-react"
import {isValidRemoteUrl} from "../helpers/auth"
import {Button} from "./ui/button"
import {Input} from "./ui/input"

type Status =
  | {type: "idle"}
  | {type: "loading"}
  | {type: "error"; message: string}

interface Props {
  onSubmit: (remoteUrl: string) => Promise<void>
}

export default memo(function FirstTimeSetupScreen({onSubmit}: Props) {
  const [inputValue, setInputValue] = useState("")
  const [status, setStatus] = useState<Status>({type: "idle"})

  const inputValueIsValid = isValidRemoteUrl(inputValue)
  const isLoading = status.type === "loading"

  return (
    <div className="flex h-screen items-center justify-center bg-background p-4">
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          if (!inputValueIsValid || isLoading) return

          setStatus({type: "loading"})

          try {
            await onSubmit(inputValue)
          } catch (err) {
            const message =
              err instanceof Error && err.message
                ? err.message
                : "Failed to reach server. Check the URL and try again."
            setStatus({type: "error", message})
          }
        }}
        className="w-full max-w-xs space-y-6"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Life Calendar</h1>
          <p className="text-sm text-ctp-subtext0">
            Enter your remote server URL to get started.
          </p>
        </div>
        <Input
          autoFocus
          placeholder="https://..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          aria-invalid={inputValue !== "" && !inputValueIsValid}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          inputMode="url"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={!inputValueIsValid || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Syncing...
            </>
          ) : (
            "Continue"
          )}
        </Button>
        {status.type === "error" && (
          <p className="text-sm text-destructive text-center" role="alert">
            {status.message}
          </p>
        )}
      </form>
    </div>
  )
})
