class Calculator {
  constructor() {
    this.previousOperand = "";
    this.currentOperand = "0";
    this.operation = undefined;
    this.memory = 0;
    this.isMemorySet = false;
    this.isNewInput = true;
  }

  clear() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = undefined;
    this.isNewInput = true;
  }

  delete() {
    if (this.currentOperand.length === 1) {
      this.currentOperand = "0";
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
  }

  appendNumber(number) {
    if (this.isNewInput) {
      this.currentOperand = number.toString();
      this.isNewInput = false;
    } else {
      this.currentOperand += number.toString();
    }
  }

  chooseOperation(operation) {
    if (this.currentOperand === "") return;
    if (this.previousOperand !== "") {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
    this.isNewInput = true;
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
    this.currentOperand = computation.toString();
    this.operation = undefined;
    this.previousOperand = "";
    this.isNewInput = true;
  }

  percentage() {
    this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
  }

  negate() {
    this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
  }

  memoryAdd() {
    this.memory += parseFloat(this.currentOperand) || 0;
    this.isMemorySet = this.memory !== 0;
    this.updateMemoryIndicator();
    this.showMemoryFeedback("Added to memory");
    this.isNewInput = true;
  }

  memorySubtract() {
    this.memory -= parseFloat(this.currentOperand) || 0;
    this.isMemorySet = this.memory !== 0;
    this.updateMemoryIndicator();
    this.showMemoryFeedback("Subtracted from memory");
    this.isNewInput = true;
  }

  memoryRecall() {
    if (this.isMemorySet) {
      this.currentOperand = this.memory.toString();
      this.showMemoryFeedback("Recalled from memory");
      this.isNewInput = true;
    }
  }

  memoryClear() {
    this.memory = 0;
    this.isMemorySet = false;
    this.updateMemoryIndicator();
    this.showMemoryFeedback("Memory cleared");
  }

  updateDisplay() {
    document.querySelector(".current-operand").innerText =
      this.getDisplayNumber(this.currentOperand);
    if (this.operation != null) {
      document.querySelector(
        ".previous-operand"
      ).innerText = `${this.getDisplayNumber(this.previousOperand)} ${
        this.operation
      }`;
    } else {
      document.querySelector(".previous-operand").innerText = "";
    }
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  showMemoryFeedback(action) {
    const feedbackElement = document.querySelector(".memory-feedback");
    feedbackElement.textContent = action;
    feedbackElement.classList.add("show");
    setTimeout(() => {
      feedbackElement.classList.remove("show");
    }, 1000);
  }

  //The memory indicator is  toggled based on whether there's a non-zero value in memory.
  updateMemoryIndicator() {
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
