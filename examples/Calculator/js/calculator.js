(function() {
	'use strict';
	var ENTER_KEYCODE = 13;
	var ESCAPE_KEYCODE = 27;
	var ALLOWED_SYMBOLS_KEYCODES = [
		96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
		110, 111, 35, 36, 37, 38, 39, 40, 48, 54, 56, 57, 8
	]; //  http://filesd.net/kibor/codekeys.php

	function isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	function getPriority(operator) {
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
	}

	function getRpn(expression) { //Преобразование в обратную польскую запись
		var output = [];
		var operators = ['+', '*', '/', '^'];
		var stack = [];

		for (var i = 0; i < expression.length; i++) {
			if (operators.indexOf(expression[i]) > -1 ||
				(expression[i] === '-' && expression[i - 1] != '(' && output.length !== 0)) {
				if (stack.length === 0 ||
					getPriority(expression[i]) > getPriority(stack.slice(-1)[0])) {
					stack.push(expression[i]);
				} else {
					while (getPriority(expression[i]) <= getPriority(stack.slice(-1)[0]) &&
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
	}

	function calcRpn(rpn) { //	Вычисление выражения в обратной польской записи
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
	}

	function calculate(input) {
		input = input || document.querySelector('.expEditor').value;
		var rpn = getRpn(input);
		document.querySelector('.expEditor').value = calcRpn(rpn);
	}

	calculate.clear = function() {
		document.querySelector('.expEditor').value = '';
		document.querySelector('.expEditor').focus();
	};

	calculate.btnPressed = function(symbol) {
		document.querySelector('.expEditor').value += symbol;
		document.querySelector('.expEditor').focus();
	};

	window.addEventListener('keydown', doOnKeydown, false);

	function doOnKeydown(event) {
		event = event || window.event;
		if (event.keyCode === ENTER_KEYCODE) {
			event.preventDefault();
			calculate();
		} else if (event.keyCode === ESCAPE_KEYCODE) {
			event.preventDefault();
			calculate.clear();
		} else if (ALLOWED_SYMBOLS_KEYCODES.indexOf(event.keyCode) < 0) {
			event.preventDefault();
		}
	}

	window.calculate = calculate;

})();