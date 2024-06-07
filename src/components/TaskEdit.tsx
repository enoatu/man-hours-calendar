import React from "react";

import { ReactSortable } from "react-sortablejs";

import { Button } from "@/components/Button";

import { fmtDate } from "@/utils/date";
import { generateRand } from "@/utils/number";

export type Task = {
  id: number;
  name: string;
  days: number;
  start: Date;
  end: Date;
};
export type TaskEditProps = {
  tasks: Task[];
  updateTasks: (arg: Task[]) => void;
};

export const TaskEdit = ({ tasks, updateTasks }: TaskEditProps) => {
  const editTaskName = (id: number, name: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, name };
      }
      return task;
    });
    updateTasks(newTasks);
  };
  const editTaskDays = (id: number, days: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        let daysNumber = Number(days);
        if (isNaN(daysNumber) || daysNumber < 0) {
          daysNumber = 0;
        }
        return { ...task, days: daysNumber };
      }
      return task;
    });
    updateTasks(newTasks);
  };
  const deleteTask = (id: number) => {
    if (tasks.length <= 1) {
      return;
    }
    const newTasks = tasks.filter((task) => task.id !== id);
    updateTasks(newTasks);
  };
  const addTask = () => {
    const newTasks = [
      ...tasks,
      {
        id: generateRand(),
        name: "",
        days: 1,
        start: new Date(),
        end: new Date()
      }
    ];
    updateTasks(newTasks);
  };

  return (
    <div className="m-4 w-full">
      <div className="flex text-center items-center border grid grid-cols-11 gap-4">
        <div className="col-span-1"></div>
        <div className="col-span-4">タスク名</div>
        <div className="col-span-1">かかる日数</div>
        <div className="col-span-2">
          <span>
            開始日
            <br />
            (自動作成)
          </span>
        </div>
        <div className="col-span-2">
          <span>
            終了日
            <br />
            (自動作成)
          </span>
        </div>
        <div className="col-span-1">編集</div>
      </div>
      <div className="border flex flex-col">
        <ReactSortable list={tasks} setList={(c) => updateTasks(c)} handle=".js-drag-handle">
          {tasks.map((t) => (
            <div key={t.id} className="flex text-center items-center grid grid-cols-11 gap-4">
              <div className="col-span-1 w-full p-3 cursor-move js-drag-handle">☰</div>
              <input
                type="text"
                className="w-full p-3 bg-sky-50 col-span-4"
                value={t.name}
                onChange={(e) => editTaskName(t.id, e.target.value)}
              />
              <input
                type="text"
                className="w-full p-3 bg-sky-50 col-span-1 text-right"
                value={t.days}
                onChange={(e) => editTaskDays(t.id, e.target.value)}
              />
              {t.start <= new Date() && new Date() <= t.end ? (
                <>
                  <div className="col-span-2 outline outline-yellow-200">{fmtDate(t.start)}</div>
                  <div className="col-span-2 outline outline-yellow-200">{fmtDate(t.end)}</div>
                </>
              ) : (
                <>
                  <div className="col-span-2">{fmtDate(t.start)}</div>
                  <div className="col-span-2">{fmtDate(t.end)}</div>
                </>
              )}
              <div className="col-span-1">
                <Button
                  className={"p-3 " + (tasks.length === 1 ? "disabled" : "bg-red-300")}
                  onClick={() => deleteTask(t.id)}
                >
                  削除
                </Button>
              </div>
            </div>
          ))}
          <div className="flex justify-center item-center">
            <Button className="w-full" onClick={() => addTask()}>
              ＋タスクを追加
            </Button>
          </div>
        </ReactSortable>
      </div>
    </div>
  );
};
