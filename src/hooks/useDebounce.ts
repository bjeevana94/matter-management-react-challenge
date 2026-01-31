import { useEffect, useState } from "react";

const useDebounce = (value: string, interval: number = 150) => {
    const [debouncedValue, setDebounceValue] = useState<string>();

    useEffect(() => {
        const fn = setTimeout(() => setDebounceValue(value), interval);
        return () => clearTimeout(fn)
    }, [value, interval])

    return debouncedValue;
}

export default useDebounce;