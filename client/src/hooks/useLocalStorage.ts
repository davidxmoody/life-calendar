import {useState, useCallback} from "react"

export default function useLocalStorage(
  key: string,
  initialValue: string,
): [string, (newValue: string) => void] {
  const [data, setData] = useState(() => {
    const item = localStorage.getItem(key)
    return item != null ? item : initialValue
  })

  const setDataAndLocalStorage = useCallback(
    (newData: string) => {
      localStorage.setItem(key, newData)
      setData(newData)
    },
    [key],
  )

  return [data, setDataAndLocalStorage]
}
