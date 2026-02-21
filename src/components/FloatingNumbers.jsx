import React, { useEffect, useState } from 'react';

const FloatingNumbers = () => {
    const [numbers, setNumbers] = useState([]);

    useEffect(() => {
        // Generate initial numbers
        const initialNumbers = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            value: Math.floor(Math.random() * 9) + 1,
            left: Math.random() * 100,
            animationDuration: Math.random() * 10 + 10, // 10-20s
            delay: Math.random() * 5,
            fontSize: Math.random() * 2 + 1, // 1-3rem
            opacity: Math.random() * 0.3 + 0.1
        }));
        setNumbers(initialNumbers);
    }, []);

    return (
        <div className="floating-numbers-container">
            {numbers.map((num) => (
                <div
                    key={num.id}
                    className="floating-number"
                    style={{
                        left: `${num.left}%`,
                        animationDuration: `${num.animationDuration}s`,
                        animationDelay: `${num.delay}s`,
                        fontSize: `${num.fontSize}rem`,
                        opacity: num.opacity
                    }}
                >
                    {num.value}
                </div>
            ))}
        </div>
    );
};

export default FloatingNumbers;
