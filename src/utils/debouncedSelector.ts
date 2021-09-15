import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

type EqualFn<T> = (before: T, after: T) => boolean;
export function useDebounceSelector<T extends (...args: any) => any>(
    fn: T,
    equalFn?: EqualFn<ReturnType<T>>,
    time = 500
): ReturnType<T> {
    // eslint-disable-next-line
    const [_, setSate] = useState();
    const refData = useRef<any>();
    const refTimeout = useRef<any>();

    useSelector((state: any) => {
        const now_state = fn(state);
        if (now_state === refData.current) {
            return;
        }
        if (equalFn?.(refData.current, now_state)) {
            return;
        }
        refData.current = now_state;
        clearTimeout(refTimeout.current);
        refTimeout.current = setTimeout(() => {
            setSate(refData.current);
        }, time);

        return;
    });

    useEffect(() => {
        return () => clearTimeout(refTimeout.current);
    }, []);

    return refData.current;
}
