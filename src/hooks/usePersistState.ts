import { useCallback, useState } from "react";

type Props<T> = {
    key: string;
    initialValue: T;
    type?: string;
};

const obj: Record<string, any> = {}
const isNoLocalStorage = false

const set = (key: string, value: any) => {
  if (isNoLocalStorage) {
    obj[key] = value;
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

const get = (key: string) => {
  if (isNoLocalStorage) {
    return obj[key]
  }
  return JSON.parse(localStorage.getItem(key) + "");
};

type Result<T> = readonly [T, (v: T) => void];

export const usePersistState = <T>({ key, initialValue }: Props<T>): Result<T> => {
  "use client";
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
      const val = get(key);
      if (val !== null) {
        return cast(key, val);
      }
      set(key, defaultValue);
      return defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const [state, setState] = useState<T>(getItemFromStorage<T>(key, initialValue) as T);

  const setValue = useCallback(
    (value: T) => {
      set(key, value);
      setState(value);
    },
    [key]
  );

  return [state, setValue] as const;
};
