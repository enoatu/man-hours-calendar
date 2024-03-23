import React from "react";

import { ReactSortable } from "react-sortablejs";

import { Button } from "@/components/Button";

import { displayFmt } from "@/utils/date";
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

  const displayFmtTrimYear = (date: Date) => {
    // 5文字削除
    return displayFmt(date).slice(5);
  };

  type DisplayForPasteProps = {
    kind: "Plain" | "Redmine" | "GROWI";
  };
  const displayForPaste = ({ kind }: DisplayForPasteProps) => {
    let parentIndent = "";
    let childIndent = "";
    switch (kind) {
      case "Plain":
        childIndent = "*";
        break;
      case "Redmine":
        parentIndent = "*";
        childIndent = "**";
        break;
      case "GROWI":
        parentIndent = "###";
        childIndent = "*";
        break;
    }
    return (
      <div>
        {tasks.map((t, parentIndex) => {
          // === で始まるタスクは親タスクとして、そこからグループ開始として扱う
          // 次の === までのタスクをグループとして扱う
          // 親の場合のみ、タスク名と日付を表示する
          if (t.name.startsWith("===")) {
            if (kind === "Plain") {
              return null;
            }
            // 子タスクの一番最後の日付を取得する
            let endDate = "";
            for (let i = parentIndex + 1; i < tasks.length; i++) {
              if (tasks[i].name.startsWith("===")) {
                break;
              }
              endDate = displayFmtTrimYear(tasks[i].end);
            }
            return (
              <div key={t.id} className="task-item-wrapper">
                {parentIndent} {displayFmtTrimYear(t.start)}〜{endDate} {t.name.replaceAll("===", "")}
              </div>
            );
          }
          return (
            <div key={t.id} className="task-item-wrapper">
              {childIndent} {t.name}{" "}
              {kind === "Plain" ? "" : displayFmtTrimYear(t.start) + "〜" + displayFmtTrimYear(t.end)}
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div className="m-4 w-full">
      <div className="flex text-center items-center border grid grid-cols-10 gap-4">
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
        <ReactSortable list={tasks} setList={(c) => updateTasks(c)}>
          {tasks.map((t) => (
            <div key={t.id} className="flex text-center items-center cursor-move grid grid-cols-10 gap-4">
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
              <div className="col-span-2">{displayFmt(t.start)}</div>
              <div className="col-span-2">{displayFmt(t.end)}</div>
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
        <div>
          ※プレーンテキスト コピペ用
          {displayForPaste({ kind: "Plain" })}
          <br />
          ※Redmine コピペ用
          {displayForPaste({ kind: "Redmine" })}
          <br />
          ※GROWI コピペ用
          {displayForPaste({ kind: "GROWI" })}
        </div>
      </div>
    </div>
  );
};
