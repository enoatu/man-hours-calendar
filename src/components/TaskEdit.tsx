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
        if (name.startsWith("===")) {
          return { ...task, name, days: 0 };
        } else {
          return { ...task, name };
        }
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
        days: 0,
        start: new Date(),
        end: new Date()
      }
    ];
    updateTasks(newTasks);
  };

  const parentData = {
    index: 0,
    bgColor: "bg-white"
  };
  const hasParent = () => parentData.index !== 0;

  const getParentTaskDays = (tasks: Task[], index: number) => {
    let days = 0;
    for (let i = index + 1; i < tasks.length; i++) {
      if (tasks[i].name.startsWith("===")) {
        break;
      }
      days += tasks[i].days;
    }
    return days;
  };

  const getParentTaskStart = (tasks: Task[], index: number) => {
    // 次の子タスクの開始日、 子タスクがなかったら 自身の開始日
    return tasks[index + 1]?.start || tasks[index].start;
  };

  const getParentTaskEnd = (tasks: Task[], index: number) => {
    // 次の親タスクの開始日の前日
    const nextParentIndex = tasks.findIndex((t, i) => i > index && t.name.startsWith("==="));
    if (nextParentIndex === -1) {
      // 親タスクが見つからなかったら最後のタスクの終了日
      return tasks[tasks.length - 1].end;
    }
    return tasks[nextParentIndex - 1].end;
  };

  const [isHideSvg, setIsHideSvg] = React.useState(false);

  const isMigrate1Checks = tasks.filter((t) => t.name.startsWith("===") && t.days !== 0);
  React.useEffect(() => {
    if (isMigrate1Checks.length > 0) {
      setTimeout(() => {
        alert("親タスク自体に「かかる日数」が設定されています。\n日数を0にして、その分を子タスクに分配してください");
      }, 1000);
    }
  }, []);

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
        <style>{`
          .sortable-chosen svg {
            display: none;
          }
        `}</style>
        <ReactSortable
          list={tasks}
          setList={(c) => updateTasks(c)}
          handle=".js-drag-handle"
          onStart={() => setIsHideSvg(true)}
          onEnd={() => setIsHideSvg(false)}
        >
          {tasks.map((t, index) => {
            const isParent = t.name.startsWith("===");
            if (isParent) {
              parentData.index += 1;
              parentData.bgColor = parentData.index % 2 === 0 ? "bg-gray-100" : "bg-white";
            }
            return (
              <div
                key={t.id}
                className={"relative flex text-center items-center grid grid-cols-11 gap-4 " + parentData.bgColor}
              >
                <div className="col-span-1 w-full p-3 cursor-move js-drag-handle">☰</div>
                {!isParent && hasParent() && !isHideSvg && (
                  <>
                    {tasks[index - 1]?.name.startsWith("===") ? (
                      <svg className="absolute top-0 left-[11%] w-8 h-[50px] z-0">
                        <line x1="0" y1={0} x2="0" y2={25} stroke="black" strokeWidth="1" />
                        <line x1="0" y1={25} x2="100" y2={25} stroke="black" strokeWidth="1" />
                      </svg>
                    ) : (
                      <svg className="absolute -top-[25px] left-[11%] w-8 h-[75px] z-0">
                        <line x1="0" y1={0} x2="0" y2={50} stroke="black" strokeWidth="1" />
                        <line x1="0" y1={50} x2="100" y2={50} stroke="black" strokeWidth="1" />
                      </svg>
                    )}
                  </>
                )}
                <input
                  type="text"
                  className={
                    "w-full p-3 bg-sky-50 col-span-4 z-10" + (!isParent && hasParent() ? " max-w-[90%] ml-auto" : "")
                  }
                  value={t.name}
                  onChange={(e) => editTaskName(t.id, e.target.value)}
                />
                {!isParent ? (
                  <>
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
                  </>
                ) : (
                  <>
                    {isMigrate1Checks.some((x) => x.id === t.id) ? (
                      <input
                        type="text"
                        className="w-full p-3 border border-red-400 col-span-1 bg-sky-50 col-span-1 text-right"
                        title="親タスク自体にかかる日数が1日以上設定されています。日数を0にして、その分を子タスクに分配してください"
                        value={t.days}
                        onChange={(e) => editTaskDays(t.id, e.target.value)}
                      />
                    ) : (
                      <div className="col-span-1 flex justify-between">
                        <span className="text-left w-full">計</span>
                        <span className="pr-3 text-right">{getParentTaskDays(tasks, index)}</span>
                      </div>
                    )}
                    <div className="col-span-2">{fmtDate(getParentTaskStart(tasks, index))}</div>
                    <div className="col-span-2">{fmtDate(getParentTaskEnd(tasks, index))}</div>
                  </>
                )}
                <div className="col-span-1">
                  <Button
                    className={"p-3 whitespace-nowrap " + (tasks.length === 1 ? "disabled" : "bg-red-300")}
                    onClick={() => deleteTask(t.id)}
                  >
                    削除
                  </Button>
                </div>
              </div>
            );
          })}
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
