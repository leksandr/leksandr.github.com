(function() {
	'use strict'; 

	function CreateSlider(node, slides) {
		this.sliderNode = $(node); 
		this.slides = slides;
		this.STEP = -910;
		this.startCarouselTimeout = null;
		this.carouselInterval = null;

		this._createSliderDOM();
		this._startCarousel();
		this._clickOnButtonNavigation();
	}

	CreateSlider.prototype._createSliderDOM = function() {
		var slider =
			$('<div/>')
			.append($('<div/>')
				.append($('<div/>'))
				.append($('<div/>'))
				.append($('<div/>'))
				.append($('<div/>')))
			.append($('<div/>')
				.append($('<div/>')
					.append($('<img/>'))
					.append($('<img/>'))
					.append($('<img/>'))
					.append($('<img/>'))));

		slider.addClass('slider-node');
		slider.children('div').eq(0).addClass('slider-navigation');
		slider.find('.slider-navigation>div').addClass('slider-button');
		slider.find('.slider-navigation>div').eq(0).addClass('active-button');
		slider.children('div').eq(1).addClass('slider-slides');
		slider.find('.slider-slides>div').eq(0).addClass('slider-slides-holder');
		slider.find('.slider-slides-holder>img').addClass('slider-img');

		for (var i = 0; i < 4; i += 1) {
			slider.find('div>img').eq(i).attr({
				src: slides[i]
			});
		}

		this.sliderNode.append(slider);
	};

	CreateSlider.prototype._clickOnButtonNavigation = function() {
		var _this = this;
		$(this.sliderNode).find('.slider-node').on('click', '.slider-button', function() {
			var self = $(this);
			var content;
			var indexButton;
			var jump = 0;

			_this._stopCarousel();
			_this._resetCarouselTimeout();

			indexButton = $(_this.sliderNode).find('.slider-button').index(this);
			jump = indexButton * _this.STEP;
			content = self.closest('.slider-node').find('.slider-slides-holder');

			_this._slide(content, jump, 500);
			_this.startCarouselTimeout = setTimeout(
				_this._doCarousel.bind(_this, content, jump, 500), 3000);
		});
	};

	CreateSlider.prototype._startCarousel = function() {
		var content = $(this.sliderNode).find('.slider-slides-holder');
		this._doCarousel(content, 0, 500);
	};

	CreateSlider.prototype._doCarousel = function(content, distance, speedOfSlide) {
		this.carouselInterval = setInterval((function() {
			distance = (distance === this.STEP * 3) ? 0 : distance + this.STEP;
			this._slide(content, distance, speedOfSlide);
		}).bind(this), 2000);

	};

	CreateSlider.prototype._slide = function(content, distance, speedOfSlide) {
		this._unmarkButtons();
		this._markButton(distance);
		content.stop().animate({
			'margin-left': distance + 'px'
		}, speedOfSlide);
	};

	CreateSlider.prototype._stopCarousel = function() {
		clearInterval(this.carouselInterval);
		this.carouselInterval = null;
	};

	CreateSlider.prototype._resetCarouselTimeout = function() {
		clearTimeout(this.startCarouselTimeout);
		this.startCarouselTimeout = null;
	};

	CreateSlider.prototype._unmarkButtons = function() {
		$(this.sliderNode).find('.slider-button').removeClass('active-button');
	};

	CreateSlider.prototype._markButton = function(distance) {
		var indexButton = distance / this.STEP;
		var activeButton = $(this.sliderNode).find('.slider-button').eq(indexButton);
		activeButton.addClass('active-button');
	};

	window.CreateSlider = CreateSlider;

})();
