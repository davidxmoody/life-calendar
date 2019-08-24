import moment from "moment"

export default function useCurrentDate() {
  // TODO auto-refresh every day
  return moment().format("YYYY-MM-DD")
}
