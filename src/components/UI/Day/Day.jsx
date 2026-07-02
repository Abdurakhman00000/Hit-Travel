import React, { useEffect, useState } from 'react';
import './Day.css';

const NumberSelector = ({ first, second, requests, setRequests }) => {
    const [start, setStart] = useState(first);
    const [end, setEnd] = useState(second);

    useEffect(() => {
        setStart(first);
        setEnd(second);
    }, [first, second]);

    useEffect(() => {
        setRequests({ ...requests, budget: [start, end] });
    }, [start, end, setRequests]);

    const handleNumberClick = (number) => {
        if (start === null || end !== start) {
            setStart(number);
            setEnd(number);
        } else if (number < start) {
            setEnd(start);
            setStart(number);
        } else if (number > start && end === start) {
            setEnd(number);
        } else {
            setStart(number);
            setEnd(number);
        }
    };

    const generateNumbers = () => {
        const numbers = [];
        for (let i = 1; i <= 28; i++) {
            const isSelected = (start !== null && end !== start) ? (i >= start && i <= end) : (i === start);
            numbers.push(
                <button
                    key={i}
                    onClick={() => handleNumberClick(i)}
                    className={isSelected ? 'selected' : ''}
                >
                    {i}
                </button>
            );
        }
        return numbers;
    };

    return (
        <div className='day_leng'>
            <p className='text'>
                Доступная длительность ночей
            </p>
            <div className='day_box'>
                {generateNumbers()}
            </div>
        </div>
    );
};

export default NumberSelector;
