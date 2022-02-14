class CalcController {
  constructor() {
    this._lastOperator = '';
    this._lastNumber = '';
    this._lastValue = [];

    this._operation = [];
    this._displayCalcEl = document.querySelector('#display');
    this.initButtonEvents();
    this.initKeyboard();
    this.initialize();
  }

  initialize() {
    this.setLastNumberTodisplay();
    this.pasteFromClipboard();
  }

  copyToClipboard(){
    let input = document.createElement('input');

    input.value = this.displayCalc;
    document.body.appendChild(input);
    input.select();
    document.execCommand("Copy");
    input.remove();
  }

  pasteFromClipboard(){
    document.addEventListener('paste', e=>{
        let text = e.clipboardData.getData('Text');        
        this.displayCalc = parseFloat(text);
    });
  }

  setLastNumberTodisplay() {
    let lastNumber = this.getLastItem(false);
    
    for (let i = this._operation.length -1; i >= 0; i--) {
      if (!this.isOperator(this._operation[i])) {
        lastNumber = this._operation[i];
        break;
      }
    }

    if (!lastNumber) lastNumber = 0;
    
    this.displayCalc = lastNumber;
  }

  initButtonEvents() {
    let buttons = document.querySelectorAll('.row > button');

    buttons.forEach(btn => {
      this.addEventListenerAll(btn, 'click drag', e => {
        let valueBtn = btn.textContent.toLowerCase();
        
        this.execBtn(valueBtn);
      });
    });
  }

  addEventListenerAll(element, events, fn) {
    events.split(' ').forEach(event => {
      element.addEventListener(event, fn, false);
    })
  }

  clearAll() {
    this._operation = [];
    this._lastNumber = '';
    this._lastOperator = '';
    this.setLastNumberTodisplay();
  }

  clearEntry() {
    this._operation.pop();
    this.setLastNumberTodisplay();
  }

  clearLast() {
    //this.setLastNumberTodisplay();
  }

  setError() {
    this.displayCalc = 'Error';
  }

  addOperation(value) {

    if (isNaN(this.getLastOperation())) {

      if (this.isOperator(value)) {
        this.setLastOperation(value);
      } else {
        this.pushOperation(value);        
        this.setLastNumberTodisplay();
      }

    } else {

      if (this.isOperator(value)) {
        this.pushOperation(value);
      } else {
        let newValue = this.getLastOperation().toString() + value.toString();
        this.setLastOperation(newValue);

        this.setLastNumberTodisplay();
      }

    }
  }

  isOperator(value) {
    return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
  }

  pushOperation(value) {
    this._operation.push(value);

    if (this._operation.length > 3) {
      this.calc();
    }
  }

  getResult() {
    try {
      return eval(this._operation.join(''));
    } catch (e) {
      setTimeout(() => {
        this.setError();
      }, 1);
    }
  }

  getLastOperation() {
    return this._operation[this._operation.length - 1];
  }

  setLastOperation(value) {
    return this._operation[this._operation.length - 1] = value;
  }

  getLastItem(isOperator = true) {
    let lastItem;
    
    for (let i = this._operation.length -1; i >= 0; i--) {
      if (this.isOperator(this._operation[i]) == isOperator) {
        lastItem = this._operation[i];
        break;
      }
    }

    if (!lastItem) {
      lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
    }
    
    return lastItem;
  }

  calc() {
    let last = '';
    this._lastOperator = this.getLastItem();

    if (this._operation.length < 3) {
      let firstItem = this._operation[0];
      this._operation = [firstItem, this._lastOperator, this._lastNumber];
    }

    if (this._operation.length > 3) {
      last = this._operation.pop();
      this._lastNumber = this.getResult();
    } else if (this._operation.length == 3) {
      this._lastNumber = this.getLastItem(false);
    }

    let result = this.getResult();

    if (last == '%') {
      result /= 100;
      this._operation = [result];
    } else {      
      this._operation = [result];

      if (last) this._operation.push(last);
    }
    
    this.setLastNumberTodisplay();
  }

  addDot() {

  }

  execBtn(value) {
    switch(value) {
      case 'c':
        this.clearAll();
        break;

      case 'ce':
        this.clearEntry();
        break;

      case '←':
        this.clearLast();
        break;

      case '+':
        this.addOperation('+');
        break;

      case '-':
        this.addOperation('-');
        break;

      case '/':
        this.addOperation('/');
        break;
        
      case 'x':
        this.addOperation('*');
        break;

      case '%':
        this.addOperation('%');
        break;

      case '=':
        this.calc();
        break;

      case '.':
        this.addDot();
        break;

        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          this.addOperation(parseInt(value));
          break;

      default:
        this.setError();
        break;
    }
  }

  initKeyboard(){
    document.addEventListener('keyup', e=> {
     
      switch (e.key){

        case 'Escape':
          this.clearAll();
          break;

        case 'Backspace':
          this.clearLast();
          break;

        case 'Delete':
          this.clearEntry();
          break;

        case '+':
        case '-':
        case '*':
        case '/':
        case '%':
          this.addOperation(e.key);
          break;

        case 'Enter':
        case '=':
          this.calc();
          break; 
            
        case '.':
        case ',':
          this.addDot();
          break;
            
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          this.addOperation(parseInt(e.key));
          break;

        case 'c':
          if(e.ctrlKey) this.copyToClipboard();
          break;
      }


    });
}

  get displayCalc() {
    return this._displayCalcEl.innerHTML;
  }

  set displayCalc(value) {
    if (value.toString().length > 10) {
      this.setError();
      return false;
    }

    this._displayCalcEl.innerHTML = value;
  }
}