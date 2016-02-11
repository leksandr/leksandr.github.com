(function() {
	'use strict';
 
	function TagList(node, arrayTag) {
		var KEYCODE_ENTER = 13;
		this.$node = $(node);
		this.arrayTag = arrayTag ? this.trimArray(arrayTag) : [];
		this.storeTag = [];
		this.newMenu = 'Завершить редактирование';

		this.createWidget();
		this.createList(this.arrayTag);
		this.resizeForm();

		$(this.$node).find('.taglist-form>button').click(this.appendToListFromInput.bind(this));
		$(this.$node).find('.taglist-form>input').keydown((function(event) {
			if (event.keyCode === KEYCODE_ENTER) {
				//event.preventDefault();
				event.returnValue = false;
				this.appendToListFromInput();
			}
		}).bind(this));
		$('.taglist-delete-all-tags').click(this.deleteAllTags.bind(this));
		$(window).resize(this.resizeForm);
	}

	TagList.prototype.createWidget = function() {
		var $wrapper = $('<div class = "taglist-vidget">');
		var $menu = $(
			'<div class = "taglist-menu-wrapper">' +
			'<span class="taglist-menu">Редактировать теги</span>' +
			'<span class="taglist-delete-all-tags taglist-view-mode">Удалить все теги</span>' +
			'</div>');
		var $placeForTags = $('<div class = "taglist-place taglist-view-mode">');
		var $form = $('<form class="taglist-form taglist-view-mode">')
			.append($('<input type="text">'))
			.append($('<button>добавить</button>'));
		$($menu).find('.taglist-menu').click(this.startFinishEdit.bind(this));
		$($wrapper).append($menu);
		$($wrapper).append($placeForTags);
		$($wrapper).append($form);
		$(this.$node).append($wrapper);

	};

	TagList.prototype.createList = function(arrayTag) {
		if (arrayTag.length === 0) return;
		var _this = this;
		$.each(arrayTag, function(index, value) {
			_this.appendToList(value);
		});
	};

	TagList.prototype.trimArray = function(array) {
		return $.map(array, function(value, index) {
			return $.trim(array[index]);
		});
	};

	TagList.prototype.appendToList = function(value) {
		if (this.findDuplicate(value) || value.length === 0) return true;
		this.storeTag.push(value);

		var $listElementWrapper = $('<div class = "taglist-tag-wrapper">');
		var $listElement = $('<span class = "taglist-tag">' + value + '</span>');
		var $deleteTag = $('<span class = "taglist-delete">&#9747;</span>');

		$($deleteTag).click(this.deleteTag.bind(this));
		$($listElementWrapper).append($listElement).append($deleteTag);
		$(this.$node).find('.taglist-place').append($listElementWrapper);
	};

	TagList.prototype.appendToListFromInput = function() {
		//event.preventDefault();
		event.returnValue = false;
		var inputValue = $(this.$node).find('.taglist-form>input').prop('value');
		inputValue = $.trim(inputValue);
		var notAppend = this.appendToList(inputValue);
		if (notAppend) {
			$(this.$node).find('.taglist-form>input').focus();
			return;
		}
		$(this.$node).find('.taglist-form>input').prop('value', '').focus();
		console.log('send');
	};

	TagList.prototype.deleteTag = function(event) {
		var index = $.inArray($(event.target).prev().prop('textContent'), this.storeTag);
		this.storeTag.splice(index, 1);
		$(event.target).parent().remove();
	};

	TagList.prototype.deleteAllTags = function() {
		$(this.$node).find('.taglist-tag-wrapper').remove();
		this.storeTag = [];
	};

	TagList.prototype.startFinishEdit = function() {
		this.currentMenu = this.newMenu;
		this.newMenu = $(this.$node).find('.taglist-menu').text();
		$(this.$node).find('.taglist-menu').text(this.currentMenu);
		$(this.$node).find('.taglist-place, .taglist-form, .taglist-delete-all-tags').toggleClass('taglist-view-mode');
		this.resizeForm();
	};

	TagList.prototype.findDuplicate = function(value) {
		if ($.inArray(value, this.storeTag) != -1)
			return true;
	};

	TagList.prototype.resizeForm = function() {
		$('.taglist-form:not(.taglist-view-mode)').each(function() {
			var formWidth = $(this).parent().width();
			var buttonWidth = $(this).find('button').eq(0).width();
			var inputWidth = formWidth - buttonWidth - 35;
			$(this).find('input').width(inputWidth);
		});
	};

	window.TagList = TagList;
})();
