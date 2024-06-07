import React from "react";

import { SwitchCheckbox } from "@/components/SwitchCheckbox";

export type DisplaySettingData = {
  isDisplayWeekday?: boolean;
  isZeroPadding?: boolean;
};

export const displaySettingInitialData: DisplaySettingData = {
  isDisplayWeekday: true,
  isZeroPadding: true
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
  return (
    <>
      <div className={className}>
        <div className="grid grid-cols-2">
          <span>曜日を表示</span>
          <SwitchCheckbox
            value={Boolean(displaySetting.isDisplayWeekday)}
            onChange={(e) => setDisplaySetting({ ...displaySetting, isDisplayWeekday: e.target.checked })}
          />
        </div>
        <div className="grid grid-cols-2">
          <span>日付を0埋めする</span>
          <SwitchCheckbox
            value={Boolean(displaySetting.isZeroPadding)}
            onChange={(e) => setDisplaySetting({ ...displaySetting, isZeroPadding: e.target.checked })}
          />
        </div>
      </div>
    </>
  );
};
