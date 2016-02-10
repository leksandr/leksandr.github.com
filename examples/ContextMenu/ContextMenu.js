/* 
Реализовать ContextMenu

первый аргумент - узел на котором будет работать контекстное меню
второй аргумент - описание структуры меню. Пример описания прикладывается. Структура может быть любой по вложенности и количеству элементов меню. (рекурсивно генерировать DOM будет ок)
подменю может содержать вложенные подменю
при правом клике по узлу, для которого было создано ContextMenu показывать меню прямо под местом клика.
при клике по пункту меню должна выполняться соответствующая функция
каждый элемент, содержащий подменю, должен быть отмечен ">" символом
подменю открывается при наведении на пункт подменю, и закрывается при уходе мышки с подменю или пункта подменю (смотри события mouseenter и mouseleave)
с позиционированием (чтобы все меню и подменю вмещались в видимую часть экрана) можно не заморачиваться
стилизовать меню можно на свой вкус (главное - видимые границы элементов)
*/

(function() {
	'use strict';

	var ESC_KEYCODE = 27;

	function topWalker(node, testFunc, lastParent) {
		while (node && node !== lastParent) {
			if (testFunc(node)) {
				return node;
			}
			node = node.parentNode;
		}
	}

	function ContextMenu(node, structureMenu) {
		this.root = node;
		this.root.addEventListener('contextmenu', this._onRootContextMenu.bind(this), false);
		this.menu = this._createMenu(structureMenu);
		this.menu.className += " context-menu";
		this._hoverSubmenu();
		this.root.appendChild(this.menu);
		document.documentElement.addEventListener('click', this._onGlobalClick.bind(this), false);
		document.documentElement.addEventListener('keyup', this._onGlobalKeyup.bind(this), false);

		if (!ContextMenu.menus) {
			ContextMenu.menus = [];
		}
		ContextMenu.menus.push(this);
	}

	ContextMenu.prototype._createMenu = function(structureMenu) {
		var elementUl = document.createElement('ul');

		for (var i = 0; i < structureMenu.length; i += 1) {
			var elementLi = document.createElement('li');
			elementLi.innerText = structureMenu[i].title;
			if (structureMenu[i].hasOwnProperty('submenu')) {
				var submenuArrow = document.createElement('span');
				submenuArrow.innerText = '\u25B6';
				elementLi.appendChild(submenuArrow);
				elementLi.appendChild(this._createMenu(structureMenu[i].submenu));
				elementLi.className += " context-menu-has-submenu";
			} else {
				elementLi.addEventListener('click', structureMenu[i].action, false);
				elementLi.addEventListener('click', this._hide.bind(this), false);
			}
			elementUl.appendChild(elementLi);
		}
		return elementUl;
	};

	ContextMenu.prototype._hoverSubmenu = function() {
		var hoverSubmenuItems = this.menu.querySelectorAll('.context-menu-has-submenu');
		Array.prototype.forEach.call(hoverSubmenuItems, function(hoverSubmenuItem) {
			var submenuNode = hoverSubmenuItem.querySelector('ul');
			hoverSubmenuItem.addEventListener('mouseenter', function() {
				//console.log("mouseenter");
				submenuNode.style.visibility = 'visible';
			});
			hoverSubmenuItem.addEventListener('mouseleave', function() {
				//console.log("mouseleave");
				submenuNode.style.visibility = 'hidden';
			});
		});
	};

	ContextMenu.prototype._onRootContextMenu = function(event) {
		//event.preventDefault();  вместо него event.returnValue = false;
		event.returnValue = false;
		var x = event.pageX;
		var y = event.pageY;
		this._show(x, y);
	};

	ContextMenu.prototype._onGlobalClick = function(event) {
		var menu = this.menu;
		if (!topWalker(event.target, function(node) {
				return menu === node;
			}))
			this._hide();
	};

	ContextMenu.prototype._onGlobalKeyup = function(event) {
		if (event.keyCode === ESC_KEYCODE)
			this._hide();
	};

	ContextMenu.prototype._show = function(left, top) {
		//event.preventDefault();  вместо него event.returnValue = false;
		event.returnValue = false;
		ContextMenu.menus.forEach(function(menuInstance) {
			menuInstance._hide();
		});
		this.menu.style.display = 'inline-block';
		this.menu.style.left = left + 'px';
		this.menu.style.top = top + 'px';
	};

	ContextMenu.prototype._hide = function() {
		this.menu.style.display = 'none';
	};

	window.ContextMenu = ContextMenu;
}());
