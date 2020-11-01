import { useState, useEffect } from 'react';

export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      // value 값이 바뀌면 이전 setTimeout을 clear 해줌
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
