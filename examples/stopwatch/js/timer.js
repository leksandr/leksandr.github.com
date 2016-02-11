/*
Реализовать виджет "секундомер". Кнопки "стоп", "старт" (одна и та же кнопка), "сброс", "круг". 
Секундомер работает с точностью до миллисекунд. Когда он запущен, показывается время в формате чч:мм:сс:мс. 
Нажатие на кнопку "стоп" останавливает ход секундомера. Кнопка "круг" добавляет текущее значение 
секундомера в список результатов. Элементы из списка результатов можно удалять поштучно. 
Кнопка "сброс" останавливает секнудомер, если тот бежит, сбрасывает значение в нули, 
убирает все результаты, если такие есть. "круг" работает одинаково для остановленного и запущенного секундомеров.
 
Управление с клавиатуры (проверь, чтобы работало в разных расскладках): s - start/stop, l - lap, r - reset. 
Если на странице несколько секундомеров, с клавиатуры управляется тот, над последним из которых находилась мышка.
*/
(function() {
	'use strict';

	function StopWatch(node) {
		StopWatch.START_STOP_KEYCODE = 83;
		StopWatch.LAP_KEYCODE = 76;
		StopWatch.RESET_KEYCODE = 82;
		StopWatch.currentTimer = this;

		this.node = node;
		this.laps = [];
		this.lapElement = null;
		this.timeIndicatorNode = 0;
		this.elapsedTime = 0;
		this.intervalId = null;

		this.drawWidget();

		this.timeIndicatorNode = this.node.querySelector('.stopwatch-current');
		this.lastLapsNode = this.node.querySelector('.stopwatch-laps');
		this.startStopButtonNode = this.node.querySelector('.btn-primary');
		this.lapButtonNode = this.node.querySelector('.btn-info');
		this.resetButtonNode = this.node.querySelector('.btn-sm');

		this.startStopButtonNode.addEventListener('click', (function(event) {
			if (event.target.textContent === 'Start') {
				this.start();
				event.target.textContent = 'Stop';
			} else {
				this.stop();
				event.target.textContent = 'Start';
			}
		}).bind(this), false);

		this.resetButtonNode.addEventListener('click', this.reset.bind(this), false);

		this.lapButtonNode.addEventListener('click', (function() {
			this.laps.push(this.elapsedTime);
			this.drawLaps();
		}).bind(this), false);

		this.lastLapsNode.addEventListener('click', this.removeLap, false);

		window.addEventListener('keyup', this.doOnKeyup.bind(this), false);

		this.node.addEventListener('mouseenter', (function(event) {
			StopWatch.currentTimer = this;
		}).bind(this), false);
	}


	StopWatch.prototype.doOnKeyup = function(event) {
		if (StopWatch.currentTimer === this) {
			if (event.keyCode === StopWatch.START_STOP_KEYCODE) {
				if (this.startStopButtonNode.textContent === 'Start') {
					this.start();
					this.startStopButtonNode.textContent = 'Stop';
				} else {
					this.stop();
					this.startStopButtonNode.textContent = 'Start';
				}
			} else if (event.keyCode === StopWatch.LAP_KEYCODE) {
				this.laps.push(this.elapsedTime);
				this.drawLaps();
			} else if (event.keyCode === StopWatch.RESET_KEYCODE) {
				this.reset();
			}
		}
	};

	StopWatch.prototype.drawWidget = function() {
		this.node.innerHTML = '<div class="container">' +
			'<div class="row">' +
			'<div class="col-xs-4">' +
			'<h2 class="stopwatch-current">00:00:00:000</h2>' +
			'<div class="stopwatch-laps">' +
			'<div class="alert alert-info">' +
			'00:00:00:000' +
			'<span class="label label-danger">×</span>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div class="col-xs-4 stopwatch-controls">' +
			'<div class="btn-group btn-group-lg">' +
			'<button class="btn btn-primary">Start</button>' +
			'<button class="btn btn-info">Lap</button>' +
			'</div>' +
			'<button class="btn btn-danger btn-sm">Reset</button>' +
			'</div>' +
			'</div>' +
			'</div>';

		this.lapElement = this.node.querySelector('.alert.alert-info');
		this.closeLapElement = this.node.querySelector('.label.label-danger');
		this.node.querySelector('.stopwatch-laps').removeChild(this.lapElement);
	};

	StopWatch.prototype.start = function() {
		var _this = this;
		this.startStopButtonNode.textContent = 'Stop';
		var lastUpdateTime = (new Date()).getTime();
		this.intervalId = setInterval(function() {
			var newUpdateTime = (new Date()).getTime();
			_this.elapsedTime += (newUpdateTime - lastUpdateTime);
			lastUpdateTime = newUpdateTime;
			_this.drawTime(_this.timeIndicatorNode, _this.elapsedTime);
		}, 16);
	};

	StopWatch.prototype.stop = function() {
		this.startStopButtonNode.textContent = 'Start';
		clearInterval(this.intervalId);
		this.intervalId = null;
	};

	StopWatch.prototype.reset = function() {
		this.stop();
		this.elapsedTime = 0;
		this.timeIndicatorNode.textContent = '00:00:00:000';
	};

	StopWatch.prototype.drawTime = function(nodeIndicator, elapsedTime) {
		var ms = elapsedTime % 1000;
		var sec = ((elapsedTime % 60000) - ms) / 1000;
		var min = ((elapsedTime % 3600000) - (elapsedTime % 60000)) / 60000;
		var hour = ((elapsedTime % 86400000) - (elapsedTime % 3600000)) / 3600000;
		ms = this.addZeroes(ms, 3);
		sec = this.addZeroes(sec, 2);
		min = this.addZeroes(min, 2);
		hour = this.addZeroes(hour, 2);
		nodeIndicator.textContent = hour + ':' + min + ':' + sec + ':' + ms;
	};

	StopWatch.prototype.drawLaps = function() {
		var _this = this;
		var lapElement = _this.lapElement.cloneNode();
		var closeLapElement = _this.closeLapElement.cloneNode(true);
		_this.laps.forEach(function(lap, lapIndex) {
			_this.drawTime(lapElement, lap);
			lapElement.appendChild(closeLapElement);
			_this.lastLapsNode.insertBefore(lapElement, _this.lastLapsNode.firstChild);
		});
	};

	StopWatch.prototype.removeLap = function(event) {
		if (event.target.className == 'label label-danger') {
			event.target.parentNode.parentNode.removeChild(event.target.parentNode);
		}
	};

	StopWatch.prototype.addZeroes = function(number, length) {
		var my_string = '' + number;
		while (my_string.length < length) {
			my_string = '0' + my_string;
		}
		return my_string;
	};

	window.StopWatch = StopWatch;
})();
