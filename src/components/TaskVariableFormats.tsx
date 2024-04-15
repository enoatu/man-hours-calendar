import React from "react";

import { Task } from "@/components/TaskEdit";

import { displayFmtTrimYear } from "@/utils/date";

type DisplayForPasteProps = {
  kind: "Plain" | "Redmine" | "GROWI";
};

const displayForPaste = (tasks: Task[], { kind }: DisplayForPasteProps) => {
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
      parentIndent = "### ";
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
            {t.name} {displayFmtTrimYear(t.start) + "〜" + displayFmtTrimYear(t.end)}
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
          let endDate = "";
          for (let i = parentIndex + 1; i < tasks.length; i++) {
            if (tasks[i].name.startsWith("===")) {
              break;
            }
            endDate = displayFmtTrimYear(tasks[i].end);
          }
          return (
            <div key={t.id} className="task-item-wrapper">
              {parentIndent}
              {displayFmtTrimYear(t.start)}〜{endDate} {t.name.replaceAll("===", "")}
            </div>
          );
        }
        return (
          <div key={t.id} className="task-item-wrapper">
            {childIndent}
            {t.name} {kind === "Plain" ? displayFmtTrimYear(t.start) + "〜" + displayFmtTrimYear(t.end) : ""}
          </div>
        );
      })}
    </div>
  );
};
type TaskVariableFormatsProps = {
  tasks: Task[];
};
export const TaskVariableFormats = ({ tasks }: TaskVariableFormatsProps) => {
  return (
    <div>
      ※プレーンテキスト コピペ用
      {displayForPaste(tasks, { kind: "Plain" })}
      <br />
      ※Redmine コピペ用 (親タスク名の先頭に === をつけるとグループ化されます)
      {displayForPaste(tasks, { kind: "Redmine" })}
      <br />
      ※GROWI コピペ用 (親タスク名の先頭に === をつけるとグループ化されます)
      {displayForPaste(tasks, { kind: "GROWI" })}
    </div>
  );
};
