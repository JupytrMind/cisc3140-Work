'use strict';

// Get the calculator display and the main calculator container
const display = document.getElementById('display');
const calculator = document.getElementById('calculator');

// Variables to store calculator state
let currentInput = '0';
let operator = null;
let firstOperand = null;
let waitingForSecondOperand = false;

// Update the display
function updateDisplay() {
    display.value = currentInput;
}

// Handle backspace button click
// Work on adding this functionality
// function handleBackspace() {
//     if (currentInput.length > 1) {
//         currentInput = currentInput.slice(0, -1);
//     } else {
//         currentInput = '0'; // Reset to zero if nothing left
//     }
//     updateDisplay();
// }

// Handle digit button clicks (0-9)
function inputDigit(digit) {
    if (waitingForSecondOperand === true) {
        currentInput = digit;
        waitingForSecondOperand = false;
    } else {
        currentInput = currentInput === '0' ? digit : currentInput + digit;
    }
    updateDisplay();
}

// Handle decimal point button click
function inputDecimal(dot) {
    if (waitingForSecondOperand === true) return; // Prevent adding decimal after operator

    if (!currentInput.includes(dot)) {
        currentInput += dot;
    }
    updateDisplay();
}

// Handle operator button clicks (+, -, *, /)
function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = operate(firstOperand, inputValue, operator);
        currentInput = String(result);
        firstOperand = result;
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
    updateDisplay();
}

// Perform arithmetic operations
function operate(num1, num2, op) {
    switch (op) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            if (num2 === 0) {
                return 'Error: Div by 0';
            }
            return num1 / num2;
        default:
            return num2;
    }
}

// Reset the calculator to initial state
function resetCalculator() {
    currentInput = '0';
    operator = null;
    firstOperand = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

// Initialize display when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
});

// Event delegation for button clicks on the calculator container
calculator.addEventListener('click', (event) => {
    const { target } = event;

    // Check if the clicked element is a button
    if (!target.matches('button')) {
        return;
    }

    // Handle different button types based on data attributes
    if (target.dataset.value) {
        inputDigit(target.dataset.value);
    } else if (target.dataset.action === 'add' ||
               target.dataset.action === 'subtract' ||
               target.dataset.action === 'multiply' ||
               target.dataset.action === 'divide') {
        handleOperator(target.textContent);
    } else if (target.dataset.value === '.') {
        inputDecimal(target.textContent);
    } else if (target.dataset.action === 'equals') {
        handleOperator(operator); // Trigger final calculation
    } else if (target.dataset.action === 'clear') {
        resetCalculator();
    }
});

// Keyboard support
window.addEventListener('keydown', (event) => {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        inputDigit(key);
    } else if (key === '.') {
        inputDecimal(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        handleOperator(key);
    } else if (key === '=' || key === 'Enter') {
        event.preventDefault(); // Prevent default Enter key behavior (e.g., form submission)
        handleOperator(operator);
    } else if (key === 'c' || key === 'C' || key === 'Escape' || key === 'Delete' || key === 'Backspace') {
        resetCalculator();
    }
});
