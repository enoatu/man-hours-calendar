import React, { useState } from 'react'
import { Calendar } from 'react-calendar'
import { fmt } from '@/utils/date'
import { RawHolidays } from '@/hooks/useHoliday'

export type UserRestDays = { [key: string]: string }

export type UserRestDaysSettingProps = {
  userRestDays: UserRestDays,
  setUserRestDays: (arg: UserRestDays) => void,
  rawHolidays: RawHolidays,
}
export const UserRestDaysSetting = ({ userRestDays, setUserRestDays, rawHolidays }: UserRestDaysSettingProps) => {
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

