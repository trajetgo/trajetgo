import { useEffect, useState } from "react";

export default function useMediaQuery(query) {
    const [matches, setMatches] = useState(() =>
        typeof window !== "undefined"
            ? window.matchMedia(query).matches
            : false
    );

    useEffect(() => {
        const mql = window.matchMedia(query);
        const onChange = (e) => setMatches(e.matches);

        // Safari < 14 utilise addListener
        mql.addEventListener?.("change", onChange)
            ?? mql.addListener(onChange);

        setMatches(mql.matches);

        return () => {
            mql.removeEventListener?.("change", onChange)
                ?? mql.removeListener(onChange);
        };
    }, [query]);

    return matches;
}