import { useState, useEffect } from "react";

function useLocalStorage(key:string, initialValue:any) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key)
      // console.log(item, "localstorage", typeof item);
      return (item && item !== 'undefined') ? JSON.parse(item) : initialValue;
    }
    return initialValue;
  });

  // Function to set value in localStorage and state
  const setValue = (value:any) => {
    // Save the value to state
    setStoredValue(value);
    // Save the value to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
