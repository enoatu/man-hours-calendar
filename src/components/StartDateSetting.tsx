import React, { useState } from 'react'
import { Value } from '@/types/calendar'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { fmt } from '@/utils/date'
import { Modal } from '@/components/Modal'

type StartDateSettingProps = {
  className?: string,
  startDate: Value,
  changeStartDate: (arg: Value) => void,
}
export const StartDateSetting = ({ className, startDate, changeStartDate }: StartDateSettingProps) => {
  const [isSettingStartDate, changeIsSettingStartDate] = useState<boolean>(false)
  return (
    <>
      <button className={className} onClick={() => changeIsSettingStartDate(!isSettingStartDate)}>
        {startDate ? fmt(startDate as Date) : '未設定'}
      </button>
      <Modal isOpen={isSettingStartDate} closeModal={() => changeIsSettingStartDate(false)}>
        <Calendar
          onChange={(value) => {
            changeStartDate(value)
            changeIsSettingStartDate(false)
          }}
          value={startDate}
        />
      </Modal>
    </>
  )
}

