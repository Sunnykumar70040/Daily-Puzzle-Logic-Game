import React, { useEffect, useState, memo } from 'react';

const FloatingNumbers = () => {
    const [numbers, setNumbers] = useState([]);

    useEffect(() => {
        // Generate initial numbers
        const initialNumbers = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            value: Math.floor(Math.random() * 9) + 1,
            left: Math.random() * 100,
            animationDuration: Math.random() * 15 + 10, // 10-25s
            delay: Math.random() * 10,
            fontSize: Math.random() * 2.5 + 1.5, // 1.5-4rem
            customOpacity: Math.random() * 0.4 + 0.1
        }));
        setNumbers(initialNumbers);
    }, []);

    const handleClick = (id) => {
        setNumbers(prev => prev.map(n => 
            n.id === id ? { ...n, value: Math.floor(Math.random() * 9) + 1, customOpacity: 1, fontSize: n.fontSize + 1 } : n
        ));
    };

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
                        '--custom-opacity': num.customOpacity
                    }}
                    onClick={() => handleClick(num.id)}
                >
                    {num.value}
                </div>
            ))}
        </div>
    );
};

export default memo(FloatingNumbers);
