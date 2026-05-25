import { useRef, useState, useEffect, Children, cloneElement } from "react";

const GAP = 8;
const MIN_VISIBLE = 22;

const getCardDims = (cW) => {
    if (cW < 400) return { w: 68, h: 99 };
    if (cW < 600) return { w: 80, h: 117 };
    return { w: 98, h: 143 };
};

export default function BuiltDistrictsGrid({ children }) {
    const containerRef = useRef(null);
    const [containerW, setContainerW] = useState(null);
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [clickedIdx, setClickedIdx] = useState(null);

    const cards = Children.toArray(children);
    const count = cards.length;

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const check = () => setContainerW(el.clientWidth);
        check();
        const ro = new ResizeObserver(check);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    if (count === 0) return <div ref={containerRef} className="w-full" />;

    const dims = containerW !== null ? getCardDims(containerW) : { w: 98, h: 143 };
    const { w: CARD_W, h: CARD_H } = dims;

    if (containerW === null) {
        return <div ref={containerRef} className="w-full" style={{ height: CARD_H }} />;
    }

    const naturalW = CARD_W * count + GAP * (count - 1);
    const overflows = naturalW > containerW;

    const offset = overflows
        ? Math.max(MIN_VISIBLE, (containerW - CARD_W) / Math.max(count - 1, 1))
        : CARD_W + GAP;

    const totalW = overflows ? containerW : naturalW;
    const startX = overflows ? 0 : Math.max(0, (containerW - totalW) / 2);

    return (
        <div ref={containerRef} className="w-full">
            {clickedIdx !== null && (
                <div
                    className="fixed inset-0"
                    style={{ zIndex: 49 }}
                    onClick={() => setClickedIdx(null)}
                />
            )}
            <div className="relative" style={{ height: CARD_H }}>
                {cards.map((card, i) => {
                    const isActive = hoveredIdx === i || (overflows && clickedIdx === i);
                    return (
                        <div
                            key={i}
                            onMouseEnter={() => setHoveredIdx(i)}
                            onMouseLeave={() => setHoveredIdx(null)}
                            onClickCapture={(e) => {
                                if (!overflows) return;
                                if (clickedIdx === i) {
                                    e.stopPropagation();
                                    setClickedIdx(null);
                                } else {
                                    e.stopPropagation();
                                    setClickedIdx(i);
                                }
                            }}
                            style={{
                                position: "absolute",
                                left: startX + i * offset,
                                width: CARD_W,
                                height: CARD_H,
                                zIndex: isActive ? 100 : i,
                                transform: isActive ? "translateY(-14px)" : "none",
                                transition: "transform 150ms ease",
                            }}
                        >
                            {cloneElement(card, {
                                fluid: true,
                                onModalOpen: () => { setHoveredIdx(null); setClickedIdx(null); }
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
