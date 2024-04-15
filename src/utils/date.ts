export const fmt = (date: Date) => {
  // 2021/01/11 の形式に変換する
  // 0埋めする
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}/${month}/${day}`;
};
export const displayFmt = (date: Date) => {
  const str = fmt(date);
  const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
  return `${str}(${dayOfWeek})`;
};

export const displayFmtTrimYear = (date: Date) => {
  // 5文字削除
  return displayFmt(date).slice(5);
};
