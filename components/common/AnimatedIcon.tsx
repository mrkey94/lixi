import { useState, useEffect } from "react";

export const AnimatedIcon = ({ children }: { children: React.ReactNode }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        setPosition({ x, y });
    }, []);

    return (
        <div
            className="animatedIcon"
            style={{
                position: "absolute",
                left: position.x,
                top: position.y,
                animationDuration: `${Math.random() * 2 + 1}s`,
            }}
        >
            {children}
        </div>
    );
};
