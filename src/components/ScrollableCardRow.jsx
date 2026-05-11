import { useRef, useState, useEffect } from "react";

export default function ScrollableCardRow({ children }) {
    const rowRef = useRef(null);
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(false);

    const updateArrows = () => {
        const el = rowRef.current;
        if (!el) return;
        setCanLeft(el.scrollLeft > 0);
        setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    useEffect(() => {
        updateArrows();
        const el = rowRef.current;
        if (!el) return;

        const onWheel = (e) => {
            if (e.deltaY === 0) return;
            e.preventDefault();
            el.scrollLeft += e.deltaY;
        };

        el.addEventListener("scroll", updateArrows);
        el.addEventListener("wheel", onWheel, { passive: false });
        const ro = new ResizeObserver(updateArrows);
        ro.observe(el);
        return () => {
            el.removeEventListener("scroll", updateArrows);
            el.removeEventListener("wheel", onWheel);
            ro.disconnect();
        };
    }, [children]);


    const scroll = (dir) => {
        rowRef.current?.scrollBy({ left: dir * 160, behavior: "smooth" });
    };

    return (
        <div className="relative w-full max-w-full flex items-center">

            <button
                onClick={() => scroll(-1)}
                disabled={!canLeft}
                className="shrink-0 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-black/50 text-white text-xs transition-opacity"
                style={{ opacity: canLeft ? 1 : 0.2, pointerEvents: canLeft ? "auto" : "none" }}
            >
                ‹
            </button>

            <div
                ref={rowRef}
                className="card-row flex gap-4 overflow-x-auto scroll-smooth no-scrollbar flex-1 px-2"
                style={{ justifyContent: "safe center" }}
            >
                {children}
            </div>

            <button
                onClick={() => scroll(1)}
                disabled={!canRight}
                className="shrink-0 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-black/50 text-white text-xs transition-opacity"
                style={{ opacity: canRight ? 1 : 0.2, pointerEvents: canRight ? "auto" : "none" }}
            >
                ›
            </button>

        </div>
    );
}
