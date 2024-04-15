"use client";

import { useEffect, useState } from "react";

import Calendar from "react-calendar";

import { DataControl } from "@/components/DataControl";
import { StartDateSetting } from "@/components/StartDateSetting";
import { Task, TaskEdit } from "@/components/TaskEdit";
import { TaskVariableFormats } from "@/components/TaskVariableFormats";
import { UserRestDays, UserRestDaysSetting } from "@/components/UserRestDaysSetting";

import { useHoliday } from "@/hooks/useHoliday";
import { usePersistState } from "@/hooks/usePersistState";

import { fmt } from "@/utils/date";
import { generateRand } from "@/utils/number";

import { Value } from "@/types/calendar";

const CalendarManHours = () => {
  const [value, change] = useState<Value>(new Date());
  const [startDate, changeStartDate] = usePersistState<Value>({
    key: "startDate",
    initialValue: new Date(new Date().toDateString())
  }); // 0時にする
  const [isRestWeekend, setIsRestWeekend] = usePersistState<boolean>({ key: "isRestWeekend", initialValue: true });
  const [holidays, rawHolidays, isRestHoliday, setIsRestHoliday] = useHoliday();
  const [userRestDays, setUserRestDays] = usePersistState<UserRestDays>({ key: "userRestDays", initialValue: {} });
  const [tasks, changeTasks] = usePersistState<Task[]>({
    key: "tasks",
    initialValue: [
      {
        id: generateRand(),
        name: "準備",
        days: 2,
        start: new Date(),
        end: new Date()
      },
      {
        id: generateRand(),
        name: "実行",
        days: 5,
        start: new Date(),
        end: new Date()
      }
    ]
  });
  const isWeekend = (date: string) => {
    return new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
  };

  const isRestDay = (date: string) => {
    if (isRestWeekend && isWeekend(date)) {
      return true;
    }
    if (isRestHoliday && holidays.includes(date)) {
      return true;
    }
    if (userRestDays[date]) {
      return true;
    }
    return false;
  };

  const updateTasks = (newTasks?: Task[]) => {
    let start = new Date(startDate as Date);
    let end = new Date(startDate as Date);
    const result = [];
    for (const task of newTasks || tasks) {
      // restDaysに含まれている日はスキップする
      for (let i = 0; i < task.days; i++) {
        while (true) {
          if (!isRestDay(fmt(end))) {
            break;
          }
          console.log(fmt(end) + "は休みなのでスキップします");
          end.setDate(end.getDate() + 1);
        }
        // (次のループのため)はendを進める
        i !== task.days - 1 && end.setDate(end.getDate() + 1);
      }
      result.push({ ...task, start: new Date(start), end: new Date(end) });
      // 開始日を1日進め、終了日を開始日と同じにする
      if (task.days === 0) {
        console.log(task.name + "の日数が0なのでスキップしますs");
      } else {
        start = new Date(end);
        start.setDate(start.getDate() + 1);
        while (true) {
          if (!isRestDay(fmt(start))) {
            break;
          }
          console.log(fmt(start) + "は休みなのでスキップしますs");
          start.setDate(start.getDate() + 1);
        }
        end = new Date(start);
      }
    }
    changeTasks(result);
  };
  useEffect(() => {
    updateTasks();
  }, [startDate, isRestWeekend, isRestHoliday, userRestDays]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2 mx-auto">
      <div className="grid grid-cols-2 gap-4 p-2 items-center text-center w-96">
        <span className="text-lg font-bold">開始日</span>
        <StartDateSetting className="w-full" startDate={startDate} changeStartDate={changeStartDate} />
        <span className="text-lg font-bold">土日を休みとする</span>
        <div className="flex justify-between items-center w-full gap-4">
          {["はい", "いいえ"].map((label, i) => (
            <div className="flex-1" key={i}>
              <input
                id={`isRestWeekend${i}`}
                className="peer hidden [&:checked_+_label]:block"
                type="radio"
                name="isRestWeekend"
                value={String(i === 0)}
                checked={isRestWeekend === (i === 0)}
                onChange={() => setIsRestWeekend(i === 0)}
              />
              <label
                htmlFor={`isRestWeekend${i}`}
                className="block cursor-pointer border border-gray-100 bg-white p-2 text-sm font-medium shadow-sm hover:border-gray-200 peer-checked:border-primary-500 peer-checked:ring-1 peer-checked:ring-blue-500"
              >
                {label}
              </label>
            </div>
          ))}
        </div>
        <span className="text-lg font-bold">祝日を休みとする</span>
        <div className="flex justify-between items-center w-full gap-4">
          {["はい", "いいえ"].map((label, i) => (
            <div className="flex-1" key={i}>
              <input
                id={`isRestHoliday${i}`}
                className="peer hidden [&:checked_+_label]:block"
                type="radio"
                name="isRestHoliday"
                value={String(i === 0)}
                checked={isRestHoliday === (i === 0)}
                onChange={() => setIsRestHoliday(i === 0)}
              />
              <label
                htmlFor={`isRestHoliday${i}`}
                className="block cursor-pointer border border-gray-100 bg-white p-2 text-sm font-medium shadow-sm hover:border-gray-200 peer-checked:border-primary-500 peer-checked:ring-1 peer-checked:ring-blue-500"
              >
                {label}
              </label>
            </div>
          ))}
        </div>
        <span className="text-lg font-bold">その他の休み設定</span>
        <UserRestDaysSetting
          className="w-full"
          userRestDays={userRestDays}
          setUserRestDays={setUserRestDays}
          rawHolidays={rawHolidays}
        />
      </div>
      <Calendar
        onChange={change}
        value={value}
        tileContent={({ date, view }) => (
          <div className="date-box">
            {view === "month" && rawHolidays[fmt(date)] && <p style={{ color: "red" }}>{rawHolidays[fmt(date)]}</p>}
            {view === "month" &&
              tasks.map((t, i) => {
                // タスク名
                if (!isRestDay(fmt(date)) && t.start <= date && date <= t.end && t.days > 0) {
                  return (
                    <p key={i} style={{ fontSize: 7 }}>
                      {t.name}
                    </p>
                  );
                }
              })}
            {view === "month" && isRestWeekend && isWeekend(fmt(date)) && <p>🛌💤</p>}
            {view === "month" && isRestHoliday && holidays.includes(fmt(date)) && <p>🇯🇵</p>}
            {view === "month" && userRestDays[fmt(date)] && <p>😑💤</p>}
          </div>
        )}
      />
      <TaskEdit tasks={tasks} updateTasks={updateTasks} />
      <hr />
      <div>
        <div className="mt-8 max-w-2xl">
          <h2 className="text-lg font-bold">データ管理</h2>
          <DataControl className="mt-2" />
        </div>
      </div>
      <TaskVariableFormats tasks={tasks} />
    </div>
  );
};
const Main = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient ? <CalendarManHours /> : null;
};
export default Main;
