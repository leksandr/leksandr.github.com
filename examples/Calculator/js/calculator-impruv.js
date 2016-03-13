(function() {
	'use strict';
	var ENTER_KEYCODE = 13;

	function isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	function getPriority(operator) {
		switch (operator) {
			//case "(":
			//case ")":
			//return 0;
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

	function getRpn(expression) {
		var output = [];
		var operators = ['+', '*', '/', '^'];
		var stack = [];
		//debugger;
		for (var i = 0; i < expression.length; i++) {
			if (operators.indexOf(expression[i]) > -1 || (expression[i] === '-' && expression[i - 1] != '(' && output.length !== 0)) {
				if (stack.length === 0 || getPriority(expression[i]) > getPriority(stack.slice(-1)[0])) {
					//console.log('before',getPriority(expression[i]),getPriority(stack.slice(-1)[0]), stack);
					stack.push(expression[i]);
					//console.log('after',getPriority(expression[i]),getPriority(stack.slice(-1)[0]), stack);
				} else {
					while (getPriority(expression[i]) <= getPriority(stack.slice(-1)[0]) && stack.length !== 0 && stack.slice(-1)[0] != '(') {
						output.push(stack.pop());
					}
					stack.push(expression[i]);
				}
			} else if (isNumeric(expression[i]) || expression[i] === '.' || (expression[i] === '-' && expression[i - 1] === '(')) {
				isNumeric(expression[i - 1]) || 
				expression[i - 1] === '.' || 
				(expression[i - 1] === '-' && expression[i - 2] === '(')||
				(isNumeric(expression[i]) && output.slice(-1)[0] === '-' && output.length === 1) ? output.push(output.pop() + expression[i]) : output.push(expression[i]);
			} else if (expression[i] === '-' && output.length === 0) {
				output.push(expression[i]);
			}/* else if (isNumeric(expression[i]) && stack.slice(-1)[0] === '-' && stack.length === 1) {
				output.push(output.pop() + expression[i]);
			} */else if (expression[i] === '(') {
				stack.push(expression[i]);
			} else if (expression[i] === ')') {
				console.log(stack)
				while (stack.slice(-1)[0] != '(') {
					output.push(stack.pop());
				}
				stack.pop();
			}
		}
		while (stack.length !== 0) {
			stack.slice(-1)[0] !== ')' ? output.push(stack.pop()) : stack.pop();
		}

		//console.log(stack, output);
		return output;
	}

	//var rpn = getRpn('7+(2*(2+3))^2-10^2+(44-4/2)');

	function calcRpn(rpn) {
		var stack = [];
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
		//console.log(stack.pop());
		return stack.pop();
	}

	//calcRpn(rpn);

	function calculate() {
		var input = document.querySelector('.expEditor').value;
		var rpn = getRpn(input);
		console.log('(rpn)', rpn);
		console.log('input', document.querySelector('.expEditor'))
		document.querySelector('.expEditor').value = calcRpn(rpn);
		//console.log(document.querySelector('#editWide').value)//.value=calcRpn(rpn);
		//return calcRpn(rpn);

	}

	calculate.clear = function() {
		document.querySelector('.expEditor').value = '';
	};
	calculate.btnPressed = function(symbol) {
		document.querySelector('.expEditor').value += symbol;
	};

	//window.addEventListener('keyup', doOnKeydown, false);

	calculate.doOnKeydown = function(event) {
		event = event || window.event;
		//event.preventDefault();  //вместо него event.returnValue = false;
		//event.returnValue = false;
		if (event.keyCode === ENTER_KEYCODE) {
			event.preventDefault();
			calculate();
			console.log('enter', window.calculate);
		}
		return false;
	};
	/*function clear() {
		console.log('clear');
	}*/

	//window.clear = clear;
	window.calculate = calculate;
	//calculator('7+(2*(2+3))^2-10^2+(44-4/2)');
	//calculator('7+(-2+(-1))')
})();