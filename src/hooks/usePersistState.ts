import { useCallback, useState } from "react";

type Props<T> = {
    key: string;
    initialValue: T;
    type?: string;
};

type Result<T> = readonly [T, (v: T) => void];

export const usePersistState = <T>({ key, initialValue }: Props<T>): Result<T> => {
  if (typeof window === "undefined") {
    return [initialValue, () => {}] as const;
  }
  const cast = (key: string, value: T): T => {
    switch (key) {
      case "startDate":
        if (typeof value === "string") {
          return new Date(value) as unknown as T;
        }
        return value;
      case "tasks":
        if (Array.isArray(value)) {
          return value.map((v) => {
            return {
              ...v,
              start: new Date(v.start),
              end: new Date(v.date),
            }
          }) as unknown as T;
        }
        return value;
      default:
        return value;
    }
  }
  const getItemFromStorage = <T>(key: string, defaultValue?: T) => {
    try {
      const val = JSON.parse(localStorage.getItem(key) + "");
      if (val !== null) {
        return cast(key, val);
      }
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const [state, setState] = useState<T>(getItemFromStorage<T>(key, initialValue) as T);

  const setValue = useCallback(
    (value: T) => {
      localStorage.setItem(key, JSON.stringify(value));
      setState(value);
    },
    [key]
  );

  return [state, setValue] as const;
};
