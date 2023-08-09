'use client'

import { useState, useEffect } from 'react'
import { usePersistState } from '@/hooks/usePersistState'
import { useHoliday } from '@/hooks/useHoliday'
import Calendar from 'react-calendar'
import { Value } from '@/types/calendar'
import { fmt } from '@/utils/date'
import { generateRand } from '@/utils/number'
import { UserRestDaysSetting, UserRestDays } from '@/components/UserRestDaysSetting'
import { DataControl } from '@/components/DataControl'
import { StartDateSetting } from '@/components/StartDateSetting'
import { TaskEdit,  Task } from '@/components/TaskEdit'

const CalendarManHours = () => {
  const [value, change] = useState<Value>(new Date())
  const [startDate, changeStartDate] = usePersistState<Value>({ key: 'startDate', initialValue: new Date(new Date().toDateString()) }) // 0時にする
  const [isRestWeekend, setIsRestWeekend] = usePersistState<Boolean>({ key: 'isRestWeekend', initialValue: true })
  const [holidays, rawHolidays, isRestHoliday, setIsRestHoliday] = useHoliday()
  const [userRestDays, setUserRestDays] = usePersistState<UserRestDays>({ key: 'userRestDays', initialValue: {}})
  const [tasks, changeTasks] = usePersistState<Task[]>({
    key: 'tasks',
    initialValue: [
      {
        id: generateRand(),
        name: '準備',
        days: 2,
        start: new Date(),
        end: new Date(),
      },
      {
        id: generateRand(),
        name: '実行',
        days: 5,
        start: new Date(),
        end: new Date(),
      },
    ]
  })
  const isWeekend = (date: string) => {
    return new Date(date).getDay() === 0 || new Date(date).getDay() === 6
  }

  const isRestDay = (date: string) => {
    if (isRestWeekend && isWeekend(date)) {
      return true
    }
    if (isRestHoliday && holidays.includes(date)) {
      return true
    }
    if (userRestDays[date]) {
      return true
    }
    return false
  }

  const updateTasks = (newTasks?:Task[]) => {
    console.log('tasksが更新されました')
    let start = new Date(startDate as Date)
    let end = new Date(startDate as Date)
    const result = []
    for (const task of (newTasks || tasks)) {
      // restDaysに含まれている日はスキップする
      for (let i = 0; i < task.days; i++) {
        console.log(task.name + 'の' + (i + 1) + '日目'+ fmt(end))
        console.log('スキップ後' + fmt(start) + 'から' + fmt(end))
        while (true) {
          if (!isRestDay(fmt(end))) {
            break
          }
          console.log(fmt(end) + 'は休みなのでスキップします')
          end.setDate(end.getDate() + 1)
          console.log('スキップ後' + fmt(start) + 'から' + fmt(end))
        }
        // (次のループのため)はendを進める
        i !== task.days - 1 && end.setDate(end.getDate() + 1)
      }
      result.push({...task, start: new Date(start), end: new Date(end)})
      // 開始日を1日進め、終了日を開始日と同じにする
      if (task.days === 0) {
        console.log(task.name + 'の日数が0なのでスキップしますs')
      } else {
        start = new Date(end)
        start.setDate(start.getDate() + 1)
        while (true) {
          if (!isRestDay(fmt(start))) {
            break
          }
          console.log(fmt(start) + 'は休みなのでスキップしますs')
          start.setDate(start.getDate() + 1)
          console.log('sスキップ後' + fmt(start) + 'から' + fmt(end))
        }
        end = new Date(start)
      }
    }
    changeTasks(result)
  }
  useEffect(() => {
    updateTasks()
  }, [startDate, isRestWeekend, isRestHoliday, userRestDays])

  return (
    <main>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <div className="col-span-2 md:col-span-1">
          <StartDateSetting startDate={startDate} changeStartDate={changeStartDate} />
        </div>
        <p style={{paddingTop: 10}}>土日を休みとする:<button onClick={() => setIsRestWeekend(!isRestWeekend)}> {isRestWeekend ? 'はい' : 'いいえ'}</button></p>
        <p style={{paddingBottom: 10}}>祝日を休みとする:<button onClick={() => setIsRestHoliday(!isRestHoliday)}> {isRestHoliday ? 'はい' : 'いいえ'}</button></p>
        <p>その他休み設定: {Object.keys(userRestDays).length ? 'あり': '未設定'}</p>
        <UserRestDaysSetting
          userRestDays={userRestDays}
          setUserRestDays={setUserRestDays}
          rawHolidays={rawHolidays}
        />
      </div>
      <TaskEdit tasks={tasks} updateTasks={updateTasks} />
      <Calendar
        onChange={change}
        value={value}
        tileContent={({ date, view }) =>
          <div className="date-box">
            { view === 'month' && rawHolidays[fmt(date)] && <p style={{'color': 'red'}}>{rawHolidays[fmt(date)]}</p> }
            { view === 'month' && tasks.map((t) => {
              // タスク名
              if (!isRestDay(fmt(date)) && t.start <= date && date <= t.end && t.days > 0) {
                return <p style={{ 'fontSize': 7 }}>{t.name}</p>
              }
            })}
            { view === 'month' && isRestWeekend && isWeekend(fmt(date)) && <p>🛌💤</p> }
            { view === 'month' && isRestHoliday && holidays.includes(fmt(date)) && <p>🇯🇵</p> }
            { view === 'month' && userRestDays[fmt(date)] && <p>😑💤</p> }
          </div>
        }
      />
      <hr />
      <DataControl />
    </main>
  )
}
export default (() => {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])
  return isClient ? <CalendarManHours /> : null
})
