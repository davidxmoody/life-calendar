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
  onDemo: () => Promise<void>
}

export default memo(function FirstTimeSetupScreen({onSubmit, onDemo}: Props) {
  const [inputValue, setInputValue] = useState("")
  const [status, setStatus] = useState<Status>({type: "idle"})

  const inputValueIsValid = isValidRemoteUrl(inputValue)
  const isLoading = status.type === "loading"

  async function run(action: () => Promise<void>) {
    if (isLoading) return

    setStatus({type: "loading"})

    try {
      await action()
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Failed to reach server. Check the URL and try again."
      setStatus({type: "error", message})
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!inputValueIsValid) return
          run(() => onSubmit(inputValue))
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

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-ctp-surface1" />
          <span className="text-xs text-ctp-overlay0">or</span>
          <div className="h-px flex-1 bg-ctp-surface1" />
        </div>

        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isLoading}
            onClick={() => run(onDemo)}
          >
            Try it with demo data
          </Button>
          <p className="text-xs text-ctp-overlay0 text-center">
            Generates a made-up life of placeholder entries, stored only in this
            browser.
          </p>
        </div>
        {status.type === "error" && (
          <p className="text-sm text-destructive text-center" role="alert">
            {status.message}
          </p>
        )}
      </form>
    </div>
  )
})
