(function() {
	'use strict';

	function Calculator(node) {
		Calculator.ENTER_KEYCODE = 13;
		Calculator.ESCAPE_KEYCODE = 27;
		Calculator.ALLOWED_SYMBOLS_KEYCODES = [
			96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
			110, 111, 35, 36, 37, 38, 39, 40, 48, 54, 56, 57, 8
		]; //  http://filesd.net/kibor/codekeys.php
		this.node = node;
		this._drawCalculator();
		this.node.addEventListener('keydown', this._doOnKeydown.bind(this), false);
		this.node.querySelector('.buttons-wrap').addEventListener('click', this._btnPressed.bind(this), false);
	}

	function isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	Calculator.prototype._drawCalculator = function() {
		this.node.innerHTML =
			'<form class="calc"name="calc" action="">' +
			'<div class="exp-wrap">' +
			'<textarea autofocus autocomplete="off" class="expEditor" name="expEditor" type = "text" placeholder="0" rows="4" cols="32"></textarea>' +
			'</div>' +
			'<div class="buttons-wrap">' +
			'<div class="row-of-buttons">' +
			'<div class="button"><input name="btnSeven" type="Button" value="7" ></div>' +
			'<div class="button"><input name="btnEight" type="Button" value="8" ></div>' +
			'<div class="button"><input name="btnNine" type="Button" value="9" ></div>' +
			'<div class="button"><input name="btnPlus" type="Button"	value="+" ></div>' +
			'<div class="button"><input name="btnClear" type="Button" value="C" ></div>' +
			'</div>' +
			'<div class="row-of-buttons">' +
			'<div class="button"><input name="btnFour" type="Button" value="4" ></div>' +
			'<div class="button"><input name="btnFive" type="Button" value="5" ></div>' +
			'<div class="button"><input name="btnSix" type="Button" value="6" ></div>' +
			'<div class="button"><input name="btnMinus" type="Button"	value="-" ></div>' +
			'<div class="button"><input name="btnPow" type="Button" value="^" ></div>' +
			'</div>' +
			'<div class="row-of-buttons">' +
			'<div class="button"><input name="btnOne" type="Button" value="1" ></div>' +
			'<div class="button"><input name="btnTwo" type="Button" value="2" ></div>' +
			'<div class="button"><input name="btnThree" type="Button" value="3" ></div>' +
			'<div class="button"><input name="btnMultiply" type="Button"	value="*" ></div>' +
			'<div class="button"><input name="btnDivide" type="Button"	value="/" ></div>' +
			'</div>' +
			'<div class="row-of-buttons">' +
			'<div class="button"><input name="btnZero" type="Button" value="0" ></div>' +
			'<div class="button"><input name="btnDecimal" type="Button" value="." ></div>' +
			'<div class="button"><input name="btnBracketOpen" type="Button"	value="(" ></div>' +
			'<div class="button"><input name="btnBracketClose" type="Button"	value=")" ></div>' +
			'<div class="button"><input name="btnEquals" type="Button"	value="=" </div>' +
			'</div>' +
			'</form>';
	};

	Calculator.prototype._getPriority = function(operator) {
		switch (operator) {
			case "+":
			case "-":
				return 1;
			case "*":
			case "/":
				return 2;
			case "^":
				return 3;
			default:
				return 4;
		}
	};

	Calculator.prototype._getRpn = function(expression) { //Преобразование в обратную польскую запись
		var output = [];
		var operators = ['+', '*', '/', '^'];
		var stack = [];

		for (var i = 0; i < expression.length; i++) {
			if (operators.indexOf(expression[i]) > -1 ||
				(expression[i] === '-' && expression[i - 1] != '(' && output.length !== 0)) {
				if (stack.length === 0 ||
					this._getPriority(expression[i]) > this._getPriority(stack.slice(-1)[0])) {
					stack.push(expression[i]);
				} else {
					while (this._getPriority(expression[i]) <= this._getPriority(stack.slice(-1)[0]) &&
						stack.length !== 0 && stack.slice(-1)[0] != '(') {
						output.push(stack.pop());
					}
					stack.push(expression[i]);
				}
			} else if (isNumeric(expression[i]) ||
				expression[i] === '.' ||
				(expression[i] === '-' && expression[i - 1] === '(')) {
				isNumeric(expression[i - 1]) ||
					expression[i - 1] === '.' ||
					(expression[i - 1] === '-' && expression[i - 2] === '(') ||
					(isNumeric(expression[i]) && output.slice(-1)[0] === '-' && output.length === 1) ?
					output.push(output.pop() + expression[i]) : output.push(expression[i]);
			} else if (expression[i] === '-' && output.length === 0) {
				output.push(expression[i]);
			} else if (expression[i] === '(') {
				stack.push(expression[i]);
			} else if (expression[i] === ')') {
				while (stack.slice(-1)[0] != '(') {
					output.push(stack.pop());
				}
				stack.pop();
			}
		}
		while (stack.length !== 0) {
			stack.slice(-1)[0] !== ')' ? output.push(stack.pop()) : stack.pop();
		}
		return output;
	};

	Calculator.prototype._calcRpn = function(rpn) { //	Вычисление выражения в обратной польской записи
		var stack = [];
		var result;
		var n1, n2, res;
		rpn.forEach(function(item) {
			if (isNumeric(item)) {
				stack.push(item);
			} else {
				n2 = stack.pop();
				n1 = stack.pop();
				switch (item) {
					case '+':
						res = (+n1) + (+n2);
						break;
					case '-':
						res = n1 - n2;
						break;
					case '*':
						res = n1 * n2;
						break;
					case '/':
						res = n1 / n2;
						break;
					case '^':
						res = Math.pow(n1, n2);
						break;
					default:
						console.log('Unexpected operator:', item);
				}
				stack.push(res);
			}
		});
		result = +stack.pop().toFixed(10); //точность до 10 знака 
		return isNaN(result) ? "Syntax error in the expression" : result;
	};

	Calculator.prototype.calculate = function(input) {
		this.input = input || this.node.querySelector('.expEditor').value;
		var rpn = this._getRpn(this.input);
		this.node.querySelector('.expEditor').value = this._calcRpn(rpn);
	};

	Calculator.prototype._btnPressed = function(event) {
		if (event.target.value === 'C') {
			this._clear();
		} else if (event.target.value === '=') {
			this.calculate();
		}
		else{
			this.node.querySelector('.expEditor').value += event.target.value;
			this.node.querySelector('.expEditor').focus();
		}
	};

	Calculator.prototype._clear = function() {
		this.node.querySelector('.expEditor').value = '';
		this.node.querySelector('.expEditor').focus();
	};

	Calculator.prototype._doOnKeydown = function(event) {
		event = event || this.node.event;
		if (event.keyCode === Calculator.ENTER_KEYCODE) {
			event.preventDefault();
			this.calculate();
		} else if (event.keyCode === Calculator.ESCAPE_KEYCODE) {
			event.preventDefault();
			this._clear();
		} else if (Calculator.ALLOWED_SYMBOLS_KEYCODES.indexOf(event.keyCode) < 0) {
			event.preventDefault();
		}
	};

	window.Calculator = Calculator;

})();