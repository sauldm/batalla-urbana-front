import { useRef } from "react";

export default function ScrollableCardRow({ children }) {
    const rowRef = useRef(null);

    return (
        <div className="relative w-full max-w-full">
            <div
                ref={rowRef}
                className="
    card-row flex gap-4
    overflow-x-auto
    scroll-smooth
    no-scrollbar
    px-4 tablet:px-10
  "
            >
                {children}
            </div>


        </div>
    );
}
