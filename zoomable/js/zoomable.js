(function() {
	'use strict';

	var ESC_KEYCODE = 27;
	var imageHeight;
	var imageWidth;
	var imageHeightModified;
	var imageWidthModified;

	function makeZoomable(node) {
		var $img = $(node).find('img');

		createLargeImageNode();
		getLargeImage();

		$(window).on('resize', setLargeImage);
		$('.zoomable-close').on('click', closeImage);
		$(window).on('keyup', function(event) {
			if (event.keyCode === 27)
				closeImage();
		});

		function getLargeImage() {
			var imgSrc;
			var largImageSrc;

			$($img).on('click', function() {
				imgSrc = $(this).attr('src');
				largImageSrc = imgSrc.replace('/small/', '/large/');
				changeLargeImage(largImageSrc);
				$('.zoomable-img').on('load', onLoadImage);
			});
		}

		function setLargeImage() {
			var windowHeight = $(window).height();
			var windowWidth = $(window).width();
			var heightRatio = imageHeight / windowHeight;
			var widthRatio = imageWidth / windowWidth;
			var topDistance;
			var leftDistance;
			var maxRatio = (heightRatio > widthRatio) ? heightRatio : widthRatio;
			//console.log('heightRatio', heightRatio);
			//console.log('widthRatio', widthRatio);
			//console.log('maxRatio', maxRatio);
			if (maxRatio > 0.8) {	//если изображение занимает больше 80% по какому-либо измерений
				imageHeightModified = (0.8 / maxRatio) * imageHeight;
				imageWidthModified = (0.8 / maxRatio) * imageWidth;
			} else {
				imageHeightModified = imageHeight;
				imageWidthModified = imageWidth;
			}
			$('.zoomable-img').css('height', imageHeightModified + 'px');
			topDistance = (windowHeight - imageHeightModified) / 2;
			leftDistance = (windowWidth - imageWidthModified) / 2;
			//console.log('imageHeightModified ', imageHeightModified, '  imageWidthModified ', imageWidthModified);
			//console.log('imageHeight ', imageHeight, '  imageWidth ', imageWidth);
			$('.zoomable-img-wrapper').css({
				'width': imageWidthModified + 'px',
				'top': topDistance + 'px',
				'left': leftDistance + 'px'
			});
		}

		function createLargeImageNode() {
			if ($('.zoomable-holder').length !== 0) return;
			var $imageBackground = $('<div class = "zoomable-holder">');
			var $imageWrapper = $('<div class = "zoomable-img-wrapper">');
			var $largeImage = $('<img class = "zoomable-img">');
			var $closeButton = $('<div class = "zoomable-close">&#215;</div>');
			$($imageWrapper).append($largeImage);
			$($imageWrapper).append($closeButton);
			$('body').append($imageBackground);
			$('body').append($imageWrapper);
		}

		function onLoadImage() {
			//console.log('рисунок загрузился');
			imageHeight = $('.zoomable-img').height();
			imageWidth = $('.zoomable-img').width();
			$('.zoomable-img, .zoomable-close, .zoomable-holder, zoomable-img-wrapper').css('display', 'block');
			setLargeImage();
		}

		function changeLargeImage(imgSrc) {
			$('.zoomable-img').remove();
			$('.zoomable-close').before('<img class = "zoomable-img">');
			$('.zoomable-img').attr('src', imgSrc);
		}

		function closeImage() {
			$('.zoomable-img, .zoomable-close, .zoomable-holder, zoomable-img-wrapper').css('display', 'none');
		}
	}

	window.makeZoomable = makeZoomable;

})();