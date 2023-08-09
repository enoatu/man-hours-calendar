import React, { useState } from 'react'
import { Value } from '@/types/calendar'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { fmt } from '@/utils/date'
import { Modal } from '@/components/Modal'

type StartDateSettingProps = {
  startDate: Value,
  changeStartDate: (arg: Value) => void,
}
export const StartDateSetting = ({ startDate, changeStartDate }: StartDateSettingProps) => {
  const [isSettingStartDate, changeIsSettingStartDate] = useState<boolean>(false)
  return (
    <div className="flex flex-col p-2 border-b-2 border-gray-400">
      <h3 className="text-lg font-bold pb-2 mb-2">開始日</h3>
      <div className="flex flex-row">
        <p></p>
        <button className="border-2 border-gray-400 p-2 rounded-lg m-2" onClick={() => changeIsSettingStartDate(!isSettingStartDate)}>
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
      </div>
    </div>
  )
}

