import React, { useState } from 'react'
import { Calendar } from 'react-calendar'
import { fmt } from '@/utils/date'
import type { RawHolidays } from '@/hooks/useHoliday'
import { Modal } from '@/components/Modal'

export type UserRestDays = { [key: string]: string }

export type UserRestDaysSettingProps = {
  className?: string,
  userRestDays: UserRestDays,
  setUserRestDays: (arg: UserRestDays) => void,
  rawHolidays: RawHolidays,
}
export const UserRestDaysSetting = ({ className, userRestDays, setUserRestDays, rawHolidays }: UserRestDaysSettingProps) => {
  const [isSettingUserRestDays, changeIsSettingUserRestDays] = useState<boolean>(false)
  return (
    <>
      <button className={className} onClick={() => changeIsSettingUserRestDays(!isSettingUserRestDays)}>
       { Object.keys(userRestDays).length }日間
      </button>
      <Modal isOpen={isSettingUserRestDays} closeModal={() => changeIsSettingUserRestDays(false)} >
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
      </Modal>
    </>
  )
}

