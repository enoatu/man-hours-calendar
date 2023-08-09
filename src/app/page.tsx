'use client'
import { useState, useEffect } from 'react'
import { usePersistState } from '@/hooks/usePersistState'
import { useTranslation } from 'react-i18next'
import Calendar from 'react-calendar'
import '@/config/i18n'
import 'i18next'
import { ReactSortable } from "react-sortablejs";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece]

const fmt = (date: Date) => {
  // 2021/01/11 の形式に変換する
  // 0埋めする
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  return `${year}/${month}/${day}`
}
const displayFmt = (date: Date) => {
  const str = fmt(date)
  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
  return `${str}(${dayOfWeek})`
}

type RawHolidays= {[key: string]:string }
const useHoliday = (): [string[], RawHolidays, Boolean, (arg: Boolean) => void] => {
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

type StartDateSettingProps = {
  startDate: Value,
  changeStartDate: (arg: Value) => void,
}
const StartDateSetting = ({ startDate, changeStartDate }: StartDateSettingProps) => {
  const [isSettingStartDate, changeIsSettingStartDate] = useState<boolean>(false)
  return (
    <>
      <p>開始日: {startDate ? fmt(startDate as Date) : '未設定'}</p>
      <button onClick={() => changeIsSettingStartDate(!isSettingStartDate)}>
        {isSettingStartDate ? '設定終了' : '設定開始'}
      </button>
      {isSettingStartDate &&
        <Calendar
          onChange={(value) => {
            changeStartDate(value)
            changeIsSettingStartDate(false)
          }}
          value={startDate}
        />
      }
    </>
  )
}

type UserRestDaysSettingProps = {
  userRestDays: UserRestDays,
  setUserRestDays: (arg: UserRestDays) => void,
  rawHolidays: RawHolidays,
}
const UserRestDaysSetting = ({ userRestDays, setUserRestDays, rawHolidays }: UserRestDaysSettingProps) => {
  const [isSettingUserRestDays, changeIsSettingUserRestDays] = useState<boolean>(false)
  return (
    <>
      <button onClick={() => changeIsSettingUserRestDays(!isSettingUserRestDays)}>
        {isSettingUserRestDays ? '設定終了' : '設定開始'}
      </button>
      {isSettingUserRestDays &&
        <Calendar
          onChange={(value) => {
            if (value instanceof Date) {
              const date = fmt(value)
              if (userRestDays[date]) {
                const { [date]: _, ...rest } = userRestDays
                setUserRestDays(rest)
              } else {
                setUserRestDays({...userRestDays, [date]: '休み'})
              }
            }
          }}
          tileContent={({ date, view }) =>
            <div className="date-box">
              { view === 'month' && rawHolidays[fmt(date)] && <p style={{'color': 'red'}}>{rawHolidays[fmt(date)]}</p> }
              { view === 'month' && userRestDays[fmt(date)] && <p style={{'color': 'yellow'}}>😑💤</p> }
            </div>
          }
        />
      }
    </>
  )
}

const generateRand = () => {
  return Math.floor(Math.random() * 100000000)
}

type Task = {
  id: number,
  name: string,
  days: number,
  start: Date,
  end: Date,
}
type TaskEditProps = {
  tasks: Task[],
  updateTasks: (arg: Task[]) => void,
}
const TaskEdit = ({tasks, updateTasks}: TaskEditProps) => {
  const editTaskName = (id: number, name: string) => {
    const newTasks = tasks.map(task => {
        if (task.id === id) {
            return {...task, name}
        }
        return task
    })
    updateTasks(newTasks)
  }
  const editTaskDays = (id: number, days: string) => {
    const newTasks = tasks.map(task => {
        if (task.id === id) {
            let daysNumber = Number(days)
            if (isNaN(daysNumber) || daysNumber < 0) {
              daysNumber = 0
            }
            return {...task, days: daysNumber}
        }
        return task
    })
    updateTasks(newTasks)
  }
  const deleteTask = (id: number) => {
    if (tasks.length <= 1) {
      return
    }
    const newTasks = tasks.filter(task => task.id !== id)
    updateTasks(newTasks)
  }
  const addTask = () => {
    const newTasks = [...tasks, {
      id: generateRand(),
      name: '',
      days: 1,
      start: new Date(),
      end: new Date(),
    }]
    updateTasks(newTasks)
  }
  return (
    <div className="task-edit">
      <div className="task-list task-header">
        <div className="task-item-wrapper task-header">
          <div className="task-item task-header">タスク名</div>
          <div className="task-item task-header">かかる日数</div>
          <div className="task-item task-header">開始日<br/>(自動作成)</div>
          <div className="task-item task-header">終了日<br/>(自動作成)</div>
          <div className="task-item task-header">並替</div>
          <div className="task-item task-header">編集</div>
        </div>
      </div>
      <div className="task-list">
        <ReactSortable list={tasks} setList={(c) => updateTasks(c) }>
          {tasks.map((t) => (
            <div key={t.id} className="task-item-wrapper">
              <div className="task-item">
                <input type="text" value={t.name} onChange={(e) => editTaskName(t.id, e.target.value)}/>
              </div>
              <div className="task-item">
                <input type="text" value={t.days} onChange={(e) => editTaskDays(t.id, e.target.value)}/>
              </div>
              <div className="task-item">{displayFmt(t.start)}</div>
              <div className="task-item">{displayFmt(t.end)}</div>
              <div className="task-item">☰</div>
              <div className="task-item"><button className={tasks.length === 1 ? 'disable-delete-btn' : ''} onClick={() => deleteTask(t.id)}>削除</button></div>
            </div>
          ))}
          <div className="add-task-wrapper">
            <button className="add-task" onClick={() => addTask()}>＋タスクを追加</button>
          </div>
        </ReactSortable>
        <div>
        ※コピペ用
        {tasks.map((t) => (
          <div key={t.id} className="task-item-wrapper">
            {t.name} {displayFmt(t.start)}〜{displayFmt(t.end)}
          </div>
        ))}
        </div>
      </div>
      <style jsx>{`
        .task-edit {
          margin-top: 10px;
          margin-bottom: 10px;
        }
        .task-list {
          box-sizing: border-box;
          border: 1px #ccc solid;
          display: flex;
          flex-direction: column;
        }
        .task-item-wrapper {
          display: flex;
        }
        .task-header.task-item-wrapper {
          justify-content: center;
          text-align: center;
          align-items: center;
        }
        .task-item {
          display: flex;
          background-color: #fff;
          justify-content: flex-start;
          align-items: center;
          padding: 0 10px;
          box-sizing: border-box;
          width: 110px;
          overflow: hidden;
          flex: 3;
        }
        .task-item:nth-child(1) {
          flex: 10;
        }
        .task-item:nth-child(1) input {
          padding: 6px;
          width: 100%;
          background-color: rgba(207, 240, 240, 0.5);
        }
        .task-item:nth-child(2) {
          flex: 3;
        }
        .task-item:nth-child(2) input {
          padding: 6px;
          width: 100%;
          text-align: right;
          background-color: rgba(207, 240, 240, 0.5);
        }

        .task-item:nth-child(5) {
          flex: 1;
          font-size: 30px;
          cursor: move;
          color: #ddd;
          padding-bottom: 5px;
        }
        .task-header.task-item:nth-child(5) {
          font-size: 16px;
          color: #000;
        }
        .task-item:nth-child(6) {
          flex: 1;
          text-align: center;
        }
        .disable-delete-btn {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .add-task-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
        .add-task {
          width: 90%;
          padding: 5px 10px;
          border: 1px #ccc solid;
          border-radius: 5px;
          background-color: #fff;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

type UserRestDays = { [key: string]: string }

const  CalendarManHours = () => {
  const { t, i18n } = useTranslation('calendar-man-hours')
  i18n.addResourceBundle('ja', 'calendar-man-hours', {
    'Change indent': 'インデント変更',
    'Export': 'エクスポート',
    'Reset': 'リセット',
  })

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

  const importData = [
    'startDate',
    'isRestWeekend',
    'isRestHoliday',
    'userRestDays',
    'tasks',
  ]
  const exportLocalStorages = () => {
    const result: { [key: string]: any } = {}
    for (const key of importData) {
      result[key] = JSON.parse(localStorage.getItem(key) as string)
    }
    const blob = new Blob([JSON.stringify(result)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.download = 'localStorages.json'
    a.href = url
    a.click()
    a.remove()
  }
  const importLocalStorages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    }
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      const result = JSON.parse(reader.result as string)
      for (const key of importData) {
        localStorage.setItem(key, JSON.stringify(result[key]))
      }
    }
    reader.readAsText(file)
    location.reload()
  }

  return (
    <main>
      <h1 className="title">{t('title')}</h1>
      <p className="description">{t('description')}</p>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <StartDateSetting startDate={startDate} changeStartDate={changeStartDate} />
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
      <span>{t('Export')}</span>
      <button onClick={exportLocalStorages}>実行</button>
      <hr />
      <span>インポート</span>
      <input type="file" onChange={importLocalStorages} />
      <hr />
      <div>
      <span>{t('Reset')}</span>
        <button onClick={() => {
          if (window.confirm('リセットしますか？')) {
            localStorage.clear();
            location.reload();
          }
        }}>
        実行
        </button>
      </div>
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
