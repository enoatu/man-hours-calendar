import { useEffect } from 'react'
import { usePersistState } from '@/hooks/usePersistState'

export type RawHolidays = {[key: string]:string }
export const useHoliday = (): [string[], RawHolidays, Boolean, (arg: Boolean) => void] => {
  const [rawHolidays, setRawHolidays] = usePersistState<RawHolidays>({ key: 'rawHolidays', initialValue: {} })
  const [isRestHoliday, setIsRestHoliday] = usePersistState<Boolean>({ key: 'isRestHoliday', initialValue: true })
  const getRawHolidays = async () => {
    const res = await fetch('https://holidays-jp.github.io/api/v1/date.json')
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
    const json = await res.json()
    // key が 2021-01-01 の形式なので 2021/01/01 に変換する
    const result = {} as RawHolidays
    for (const key of Object.keys(json)) {
      const k = key.replace(/-/g, '/')
      result[k] = json[key]
    }
    return result
  }
  useEffect(() => {
    (async () => {
    if (Object.keys(rawHolidays).length === 0) {
      setRawHolidays(await getRawHolidays())
    }
    })()
  }, [])
  const holidays = Object.keys(rawHolidays).map((key) => key)
  return [holidays, rawHolidays, isRestHoliday, setIsRestHoliday]
}

