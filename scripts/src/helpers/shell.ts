import {execSync} from "node:child_process"

export default function shell(command: string) {
  return execSync(command, {encoding: "utf-8"}).trim()
}
