import React from "react";

import { SwitchCheckbox } from "@/components/SwitchCheckbox";

export type DisplaySettingData = {
  isDisplayWeekday?: boolean;
  isZeroPadding?: boolean;
  isDisplayParentTitle: boolean;
  isAddParentBlankLine: boolean;
  redmineIndentNormal: string;
  redmineIndentParent: string;
  redmineIndentChild: string;
  markdownIndentNormal: string;
  markdownIndentParent: string;
  markdownIndentChild: string;
};

export const displaySettingInitialData: DisplaySettingData = {
  isDisplayWeekday: false,
  isZeroPadding: false,
  isDisplayParentTitle: false,
  isAddParentBlankLine: true,
  redmineIndentNormal: "* ",
  redmineIndentParent: "* ",
  redmineIndentChild: "** ",
  markdownIndentNormal: "* ",
  markdownIndentParent: "#### ",
  markdownIndentChild: "* "
};

export const FmtDate = ({
  date,
  displaySetting
}: {
  date: Date | undefined | null;
  displaySetting: DisplaySettingData;
}) => {
  // TODO: context に移す
  if (!date) {
    return null;
  }
  let result = "";
  if (!displaySetting?.isZeroPadding) {
    // m/d
    result = `${date.getMonth() + 1}/${date.getDate()}`;
  } else {
    // mm/dd
    result = `${date.getMonth().toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
  }

  if (displaySetting?.isDisplayWeekday) {
    const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
    result += `(${dayOfWeek})`;
  }
  return <>{result}</>;
};

export type DisplaySettingProps = {
  className?: string;
  displaySetting: DisplaySettingData;
  setDisplaySetting: (arg: DisplaySettingData) => void;
};
export const DisplaySetting = ({ className, displaySetting, setDisplaySetting }: DisplaySettingProps) => {
  const [isShow, setIsShow] = React.useState(false);
  return isShow ? (
    <>
      <button onClick={() => setIsShow(false)}>▲ 閉じる</button>
      <div className={"grid grid-cols-1 gap-4 p-4 bg-gray-100 " + className}>
        <h3 className="font-bold">コピペ用</h3>
        <div className="grid grid-cols-2">
          <span>曜日を表示</span>
          <SwitchCheckbox
            value={Boolean(displaySetting.isDisplayWeekday)}
            onChange={(e) => setDisplaySetting({ ...displaySetting, isDisplayWeekday: e.target.checked })}
          />
        </div>
        <div className="grid grid-cols-2">
          <span>日付を0埋めする(例: 1/1 → 01/01)</span>
          <SwitchCheckbox
            value={Boolean(displaySetting.isZeroPadding)}
            onChange={(e) => setDisplaySetting({ ...displaySetting, isZeroPadding: e.target.checked })}
          />
        </div>
        <div className="grid grid-cols-2">
          <span>親タスクのタイトルを表示</span>
          <SwitchCheckbox
            value={Boolean(displaySetting.isDisplayParentTitle)}
            onChange={(e) => setDisplaySetting({ ...displaySetting, isDisplayParentTitle: e.target.checked })}
          />
        </div>
        <div className="grid grid-cols-2">
          <span>親タスクの前に空行を追加</span>
          <SwitchCheckbox
            value={Boolean(displaySetting.isAddParentBlankLine)}
            onChange={(e) => setDisplaySetting({ ...displaySetting, isAddParentBlankLine: e.target.checked })}
          />
        </div>
        <p>※インデントは末尾に半角スペースを含めてください</p>
        <div className="grid grid-cols-2">
          <span>Redmineインデント ノーマル</span>
          <input
            type="text"
            value={displaySetting.redmineIndentNormal}
            onChange={(e) => setDisplaySetting({ ...displaySetting, redmineIndentNormal: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2">
          <span>Redmineインデント グループ親タスク</span>
          <input
            type="text"
            value={displaySetting.redmineIndentParent}
            onChange={(e) => setDisplaySetting({ ...displaySetting, redmineIndentParent: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2">
          <span>Redmineインデント 子タスク</span>
          <input
            type="text"
            value={displaySetting.redmineIndentChild}
            onChange={(e) => setDisplaySetting({ ...displaySetting, redmineIndentChild: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2">
          <span>Markdownインデント ノーマル</span>
          <input
            type="text"
            value={displaySetting.markdownIndentNormal}
            onChange={(e) => setDisplaySetting({ ...displaySetting, markdownIndentNormal: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2">
          <span>Markdownインデント グループ親タスク</span>
          <input
            type="text"
            value={displaySetting.markdownIndentParent}
            onChange={(e) => setDisplaySetting({ ...displaySetting, markdownIndentParent: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2">
          <span>Markdownインデント 子タスク</span>
          <input
            type="text"
            value={displaySetting.markdownIndentChild}
            onChange={(e) => setDisplaySetting({ ...displaySetting, markdownIndentChild: e.target.value })}
          />
        </div>
      </div>
    </>
  ) : (
    <button onClick={() => setIsShow(true)}>▼ 開く</button>
  );
};
