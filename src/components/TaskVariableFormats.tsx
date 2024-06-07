import React from "react";

import { DisplaySettingData, FmtDate } from "@/components/DisplaySetting";
import { Task } from "@/components/TaskEdit";

type DisplayForPasteProps = {
  tasks: Task[];
  kind: "Plain" | "Redmine" | "GROWI";
  displaySetting: DisplaySettingData;
};

const DisplayForPaste = ({ tasks, kind, displaySetting }: DisplayForPasteProps) => {
  let normalIndent = "";
  let parentIndent = "";
  let childIndent = "";
  switch (kind) {
    case "Plain":
      break;
    case "Redmine":
      normalIndent = "* ";
      parentIndent = "* ";
      childIndent = "** ";
      break;
    case "GROWI":
      normalIndent = "* ";
      parentIndent = "#### ";
      childIndent = "* ";
      break;
  }
  const hasParent = tasks.some((t) => t.name.startsWith("==="));
  if (!hasParent) {
    return (
      <div>
        {tasks.map((t) => (
          <div key={t.id} className="task-item-wrapper">
            {normalIndent}
            {t.name} <FmtDate date={t.start} displaySetting={displaySetting} />〜
            <FmtDate date={t.end} displaySetting={displaySetting} />
          </div>
        ))}
      </div>
    );
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
          let endDate = null;
          for (let i = parentIndex + 1; i < tasks.length; i++) {
            if (tasks[i].name.startsWith("===")) {
              break;
            }
            endDate = tasks[i].end;
          }
          return (
            <div key={t.id} className="task-item-wrapper">
              {parentIndent}
              <FmtDate date={t.start} displaySetting={displaySetting} />〜
              <FmtDate date={endDate} displaySetting={displaySetting} /> {t.name.replaceAll("===", "")}
            </div>
          );
        }
        return (
          <div key={t.id} className="task-item-wrapper">
            {childIndent}
            {t.name}{" "}
            {kind === "Plain" ? (
              <>
                <FmtDate date={t.start} displaySetting={displaySetting} />〜
                <FmtDate date={t.end} displaySetting={displaySetting} />
              </>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
type TaskVariableFormatsProps = {
  tasks: Task[];
  displaySetting: DisplaySettingData;
};
export const TaskVariableFormats = ({ tasks, displaySetting }: TaskVariableFormatsProps) => {
  return (
    <div>
      ※プレーンテキスト コピペ用
      <DisplayForPaste tasks={tasks} kind="Plain" displaySetting={displaySetting} />
      <br />
      ※Redmine コピペ用 (親タスク名の先頭に === をつけるとグループ化されます)
      <DisplayForPaste tasks={tasks} kind="Redmine" displaySetting={displaySetting} />
      <br />
      ※GROWI コピペ用 (親タスク名の先頭に === をつけるとグループ化されます)
      <DisplayForPaste tasks={tasks} kind="GROWI" displaySetting={displaySetting} />
    </div>
  );
};
