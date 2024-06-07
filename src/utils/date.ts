export const fmt = (date: Date) => {
  // 2021/01/11 の形式に変換する
  // 0埋めする
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}/${month}/${day}`;
};

export const fmtDate = (date: Date | undefined | null) => {
  if (!date) {
    return null;
  }
  let result = `${date.getMonth().toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
  const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
  result += `(${dayOfWeek})`;
  return result;
};
