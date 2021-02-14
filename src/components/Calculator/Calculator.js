import React from 'react';
import './Calculator.scss'
import Button from "../Button/Button";


const Calculator = () => {
    const [expression, setExpression] = React.useState('0');
    const [result, setResult] = React.useState('');
    const [isOperation, setIsOperation] = React.useState(false);
    const [isEndOperation, setIsEndOperation] = React.useState(false);
    const display = React.useRef();

    React.useEffect(() => {
        // listening or was the operator last
        if (expression.slice(-1) === '%') {
            setIsOperation(false)
        }
        else if (expression.slice(-1) === ' ') {
            setIsOperation(true)
        }
        else {
            setIsOperation(false)
        }

        // If we try to delete everything, then replace with 0
        if (expression === '') {
            setExpression('0');
        }

        // Listening to display the result
        if (expression.slice(-1) === '%'
            || expression.slice(-1) !== ' ' ) {

            // Making calculations with %
            const arrExpression = expression.split(' ');
            arrExpression.forEach((item, index) => {
                if (item.includes('%')) {
                    if (arrExpression[index - 1] === '+' || arrExpression[index - 1] === '-')  {
                        arrExpression[index] = +arrExpression[index - 2] / 100 * +item.slice(0, -1);
                    } else if (index === 0 || arrExpression[index - 1] === '*' || arrExpression[index - 1] === '/')  {
                        arrExpression[index] = +item.slice(0, -1) / 100;
                    }
                }
            })

            setResult(eval(arrExpression.join(' ')));

        } else if (expression.split(' ').length < 3) {
            setResult('');
        }
    }, [expression, isOperation]);


    const addNum = React.useCallback((num) => {
        // If we enter a number after clicking on =
        if (isEndOperation) {
            setExpression(`${num}`);
            scrollToEndDisplay();
            setIsEndOperation(false);
            return null;
        }


        if (expression.slice(-1) === '%' ) {
            setExpression(`${expression} * ${num}`);
        }
        else {
            expression === '0'
                ? setExpression(`${expression}${num}`.slice(1))
                : setExpression(`${expression}${num}`);
        }

        scrollToEndDisplay();
    }, [expression, isEndOperation]);

    const clearLast = React.useCallback(() => {
            if (expression === '0') return null;

            if (expression.slice(-1) === ' ') {
                setExpression(expression.slice(0, -3))
            }
            else {
                setExpression(expression.slice(0, -1))
            }
        }, [expression, setExpression]);

    const addOperator = React.useCallback((operator) => {
        if (isOperation) return null;
        if (expression.slice(-1) === '.') return null;

        if (operator === '%') {
            if (expression === '0') return null;
            setExpression(`${expression}${operator}`);
        } else {
            setExpression(`${expression} ${operator} `);
        }

        setIsEndOperation(false);
        scrollToEndDisplay();
    }, [isOperation, expression, setIsEndOperation]);

    const addFractionalPart = React.useCallback(() => {
        if (isOperation) return null;
        if (isEndOperation) return null;
        if (expression.slice(-1) === '%') return null;

        const arrExpression = expression.split(' ');
        if (arrExpression[arrExpression.length - 1].includes('.')) {
            return null;
        }

        setExpression(`${expression}.`);

        scrollToEndDisplay();
    }, [isOperation, isEndOperation, expression]);

    const getResult = React.useCallback(() => {
        if (expression === '0') return null;
        if (expression.slice(-1) === ' ') return null;

        const arrExpression = expression.split(' ');
        const lastSymbol = arrExpression[arrExpression.length - 1];
        if (arrExpression.length === 1 && lastSymbol.slice(-1) !== '%') return null;

        setExpression(`${result}`);
        setResult('');
        setIsEndOperation(true);
    },[expression, setExpression, setResult, setIsEndOperation, result]);

    // listener on the keyboard
    const handleBoardClip = React.useCallback( event => {
        console.log(event.key);

        switch (event.key) {
            case ('0'):
            case ('Insert'):
                addNum('0');
                break;

            case ('1'):
            case ('End'):
                addNum('1');
                break;

            case ('2'):
            case ('ArrowDown'):
                addNum('2');
                break;

            case ('3'):
            case ('PageDown'):
                addNum('3');
                break;

            case ('4'):
            case ('ArrowLeft'):
                addNum('4');
                break;

            case ('5'):
            case ('Clear'):
                addNum('5');
                break;

            case ('6'):
            case ('ArrowRight'):
                addNum('6');
                break;

            case ('7'):
            case ('Home'):
                addNum('7');
                break;

            case ('8'):
            case ('ArrowUp'):
                addNum('8');
                break;

            case ('9'):
            case ('PageUp'):
                addNum('9');
                break;

            case ('Backspace'):
                clearLast();
                break;

            case ('/'):
                addOperator('/');
                break;

            case ('*'):
                addOperator('*');
                break;

            case ('-'):
                addOperator('-');
                break;

            case ('+'):
                addOperator('+');
                break;

            case ('Delete'):
                addFractionalPart();
                break;

            case ('='):
                getResult();
                break;

            default:
                return null;
        }

    }, [addNum, clearLast, addOperator, addFractionalPart, getResult]);

    React.useEffect(() => {
        document.addEventListener('keydown', handleBoardClip);

        return () => {
            document.removeEventListener('keydown', handleBoardClip);
        };
    }, [handleBoardClip]);


    const clear = () => {
        setExpression('0');
        setResult('');
    }

    // Added scroll to display, will scroll to the right
    const scrollToEndDisplay = () => {
        display.current.scrollLeft = display.current.scrollWidth;
    }

    return (
        <div className='container'>
            <div className="calculator">
                <div className="calculator-display" ref={display}>
                    <div className="calculator-equation">{expression}</div>
                    <div className="calculator-result">{result}</div>
                </div>
                <div className="calculator-buttons-grid">
                    <Button className="btn--gray" type="button" onClick={clear}>AC</Button>
                    <Button className="btn--gray" type="button" onClick={clearLast}>
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 489.425 489.425" style={{enableBackground: 'new 0 0 489.425 489.425'}}><path d="M122.825,394.663c17.8,19.4,43.2,30.6,69.5,30.6h216.9c44.2,0,80.2-36,80.2-80.2v-200.7c0-44.2-36-80.2-80.2-80.2h-216.9 c-26.4,0-51.7,11.1-69.5,30.6l-111.8,121.7c-14.7,16.1-14.7,40.3,0,56.4L122.825,394.663z M29.125,233.063l111.8-121.8 c13.2-14.4,32-22.6,51.5-22.6h216.9c30.7,0,55.7,25,55.7,55.7v200.6c0,30.7-25,55.7-55.7,55.7h-217c-19.5,0-38.3-8.2-51.5-22.6 l-111.7-121.8C23.025,249.663,23.025,239.663,29.125,233.063z"/><path d="M225.425,309.763c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l47.8-47.8l47.8,47.8c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6 c4.8-4.8,4.8-12.5,0-17.3l-47.9-47.8l47.8-47.8c4.8-4.8,4.8-12.5,0-17.3s-12.5-4.8-17.3,0l-47.8,47.8l-47.8-47.8 c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l47.8,47.8l-47.8,47.8C220.725,297.263,220.725,304.962,225.425,309.763z"/></svg>
                    </Button>
                    <Button className="btn--light-coral" type="button" onClick={addOperator.bind(null, '%')}>%</Button>
                    <Button className="btn--light-coral" type="button" onClick={addOperator.bind(null, '/')}>/</Button>
                    <Button type="button" onClick={addNum.bind(null, '7')}>7</Button>
                    <Button type="button" onClick={addNum.bind(null, '8')}>8</Button>
                    <Button type="button" onClick={addNum.bind(null, '9')}>9</Button>
                    <Button className="btn--light-coral" type="button" onClick={addOperator.bind(null, '*')}>*</Button>
                    <Button type="button" onClick={addNum.bind(null, '4')}>4</Button>
                    <Button type="button" onClick={addNum.bind(null, '5')}>5</Button>
                    <Button type="button" onClick={addNum.bind(null, '6')}>6</Button>
                    <Button className="btn--light-coral" type="button" onClick={addOperator.bind(null, '-')}>-</Button>
                    <Button type="button" onClick={addNum.bind(null, '1')}>1</Button>
                    <Button type="button" onClick={addNum.bind(null, '2')}>2</Button>
                    <Button type="button" onClick={addNum.bind(null, '3')}>3</Button>
                    <Button className="btn--light-coral" type="button" onClick={addOperator.bind(null, '+')}>+</Button>
                    <Button type="button" onClick={addFractionalPart}>.</Button>
                    <Button type="button" onClick={addNum.bind(null, 0)}>0</Button>
                    <Button className="btn--coral grid-2c" type="button" onClick={getResult} style={{gridColumn: 'span 2'}}>=</Button>
                </div>
            </div>
        </div>
    );
};

export default Calculator;
