class Calculator {
  constructor() {
    this.previousOperand = "";
    this.currentOperand = "0";
    this.operation = undefined;
    this.memory = 0;
    this.isMemorySet = false;
  }

  clear() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = undefined;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
    if (this.currentOperand === "") this.currentOperand = "0";
  }

  appendNumber(number) {
    if (number === "." && this.currentOperand.includes(".")) return;
    this.currentOperand =
      this.currentOperand === "0"
        ? number.toString()
        : this.currentOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (this.currentOperand === "") return;
    if (this.previousOperand !== "") {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "×":
        computation = prev * current;
        break;
      case "÷":
        computation = prev / current;
        break;
      default:
        return;
    }
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = "";
  }

  percentage() {
    this.currentOperand = parseFloat(this.currentOperand) / 100;
  }

  negate() {
    this.currentOperand = parseFloat(this.currentOperand) * -1;
  }

  memoryAdd() {
    this.memory += parseFloat(this.currentOperand);
    this.isMemorySet = true;
  }

  memorySubtract() {
    this.memory -= parseFloat(this.currentOperand);
    this.isMemorySet = true;
  }

  memoryRecall() {
    this.currentOperand = this.memory.toString();
  }

  memoryClear() {
    this.memory = 0;
    this.isMemorySet = false;
  }

  updateDisplay() {
    document.querySelector(".current-operand").innerText =
      this.currentOperand || "0";
    if (this.operation != null) {
      document.querySelector(
        ".previous-operand"
      ).innerText = `${this.previousOperand} ${this.operation}`;
    } else {
      document.querySelector(".previous-operand").innerText = "";
    }
    document
      .querySelector(".memory-indicator")
      .classList.toggle("active", this.isMemorySet);
  }
}

const calculator = new Calculator();

document.querySelector(".buttons").addEventListener("click", (e) => {
  if (!e.target.matches("button")) return;

  const button = e.target;
  const action = button.dataset.action;

  if (!action) {
    calculator.appendNumber(button.innerText);
  } else {
    switch (action) {
      case "add":
      case "subtract":
      case "multiply":
      case "divide":
        calculator.chooseOperation(button.innerText);
        break;
      case "equals":
        calculator.compute();
        break;
      case "clear":
        calculator.clear();
        break;
      case "backspace":
        calculator.delete();
        break;
      case "percent":
        calculator.percentage();
        break;
      case "negate":
        calculator.negate();
        break;
      case "memory-add":
        calculator.memoryAdd();
        break;
      case "memory-subtract":
        calculator.memorySubtract();
        break;
      case "memory-recall":
        calculator.memoryRecall();
        break;
      case "memory-clear":
        calculator.memoryClear();
        break;
    }
  }
  calculator.updateDisplay();
});

document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (/^[0-9.]$/.test(key)) {
    calculator.appendNumber(key);
  } else if (["+", "-", "*", "/"].includes(key)) {
    const operationMap = { "+": "+", "-": "-", "*": "×", "/": "÷" };
    calculator.chooseOperation(operationMap[key]);
  } else if (key === "Enter" || key === "=") {
    calculator.compute();
  } else if (key === "Backspace") {
    calculator.delete();
  } else if (key === "Escape") {
    calculator.clear();
  } else if (key === "%") {
    calculator.percentage();
  }
  calculator.updateDisplay();
});

// Initial display update
calculator.updateDisplay();

// Ensure the display shows 0 on load
document.querySelector(".current-operand").innerText = "0";

// For demonstration purposes, let's perform some calculations
console.log("Demonstration of calculator functionality:");

calculator.appendNumber(5);
calculator.chooseOperation("+");
calculator.appendNumber(3);
calculator.compute();
console.log("5 + 3 =", calculator.currentOperand);

calculator.clear();
calculator.appendNumber(10);
calculator.chooseOperation("×");
calculator.appendNumber(4);
calculator.compute();
console.log("10 × 4 =", calculator.currentOperand);

calculator.percentage();
console.log("Result as percentage:", calculator.currentOperand);

calculator.negate();
console.log("Negated result:", calculator.currentOperand);

calculator.memoryAdd();
console.log("Added to memory");

calculator.clear();
calculator.appendNumber(50);
calculator.memorySubtract();
console.log("Subtracted 50 from memory");

calculator.memoryRecall();
console.log("Memory recall:", calculator.currentOperand);

calculator.memoryClear();
console.log("Memory cleared");
