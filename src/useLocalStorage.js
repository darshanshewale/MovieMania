import { useEffect, useState } from "react";

export function useLocalStorage(initialstage, key) {
  const [value, setvalue] = useState(function () {
    const setstorage = localStorage.getItem(key);
    return setstorage ? JSON.parse(setstorage) : initialstage;
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setvalue];
}
