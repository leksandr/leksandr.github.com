(function() {
	'use strict';
	var usedEmails = ['author@mail.com', 'foo@mail.com', 'tester@mail.com'];
 
	function Validate() {
		var _this = this;
		var arisingTimeout;

		document.documentElement.addEventListener('keyup', this._validate.bind(this), false);
		document.documentElement.addEventListener('blur', this._validate.bind(this), false);
		document.documentElement.addEventListener('change', this._validate.bind(this), false);

		document.documentElement.addEventListener('keydown', function() {
			var eventKeyup = event || window.event;
			var target = eventKeyup.target || eventKeyup.srcElement;
			if (target.id != 'email')
				return;
			console.log('очистка email');
			clearTimeout(arisingTimeout);
		}, false);

		var checkboxNode = document.querySelector('input[type="checkbox"]');
		checkboxNode.addEventListener('click', _this._accessToButton.bind(_this), false);
	}

	Validate.prototype._validate = function() {
		var _this=this;
		var eventKeyup = eventKeyup || window.event;
		var target = eventKeyup.target || eventKeyup.srcElement;
		var checker;
		var checkResult = '';
		var targetId = target.id;
		if ((targetId != 'email') && (targetId != 'password') && (targetId != 'city') && (targetId != 'phone'))
			return;
		checker = _this._choseChecker(targetId).bind(_this);

		console.log('keyup ' + targetId);
		_this.arisingTimeout = setTimeout(function() {
			console.log('arise ' + targetId);
			checkResult = checker();
			console.log('checkResult', checkResult);
			if (checkResult !== "")
				_this._addAlertField(checkResult, targetId);
			else
				_this._deleteAlertField(targetId);
			_this._accessToButton();
		}, 1000);
	};

	Validate.prototype._checkEmail = function() {
		var emailForm = document.body.querySelector('#email');
		var emailFormValue = emailForm.value;
		var errorReport = "";
		var emailExpr = /[^@]+@[^@\.]+\.[^@]+/i;
		console.log(emailExpr.test(emailFormValue));

		if (emailFormValue === "") {
			return "Поле не должно быть пустым";
		} else if (!emailExpr.test(emailFormValue)) {
			errorReport += "Ошибка заполнения e-mail.";
			console.log(errorReport);
			if (/[^\w\-\_\@\.]/.test(emailFormValue)) {
				errorReport += " e-mail содержит не допустимые символы";
				console.log(errorReport);
				return errorReport;
			}
		} else {
			this._checkEmailOnServer(emailFormValue);
		}
		return errorReport;
	};

	Validate.prototype._checkEmailOnServer = function(email) {
		var _this = this;
		var uri = 'https://aqueous-reaches-8130.herokuapp.com/check-email/?email=' + email;
		var STATE_READY = 4;
		var request = new XMLHttpRequest();
		request.open('get', uri, true);
		request.onreadystatechange = function() {
			var arr;
			if (request.readyState === STATE_READY) {
				arr = JSON.parse(request.responseText);
				if (!arr.used) return;
				_this._addAlertField('Такой логин/e-mail уже занят', 'email');
			}
		};
		request.send();
	};
	/*
		Validate.prototype._checkUsedEmail = function(email) {
			for (var i = 0; i < usedEmails.length; i += 1)
				if (email === usedEmails[i])
					return true;
			return false;
		};
	*/
	Validate.prototype._checkPassword = function() {
		console.log('_checkPassword');
		var passwordForm = document.body.querySelector('#password');
		var passwordFormValue = passwordForm.value;
		var errorReport = "";

		if (passwordFormValue === "")
			return "";

		if (passwordFormValue.length < 5)
			errorReport += "Пароль слишком короткий (до 5 символов). ";

		if (/^\d+$/.test(passwordFormValue))
			errorReport += "Пароль содержит только цифры. ";

		if (/^[A-Za-z'\-\_]+$/.test(passwordFormValue))
			errorReport += "Пароль содержит только буквы и символы '-', '_'. ";

		if (/[^\w\-]+/.test(passwordFormValue))
			errorReport += "Пароль содержит недопустимые символы";

		return errorReport;
	};

	Validate.prototype._checkCity = function() {
		console.log('_checkCity');
		var cityForm = document.body.querySelector('#city');
		var cityFormValue = cityForm.value;
		var errorReport = "";

		if (cityFormValue === "")
			return "";

		if (/\d/.test(cityFormValue))
			errorReport += "Название города содержит цифры. ";

		if (/[^A-Za-zА-Яа-я\s\-]/.test(cityFormValue))
			errorReport += "Обнаружены недопустимые символы. ";

		if (/^[^A-Za-zА-Яа-я]/.test(cityFormValue))
			errorReport += "Название города должно начинаться с буквы. ";

		return errorReport;
	};

	Validate.prototype._checkPhone = function() {
		console.log('_checkPhone');
		var phoneForm = document.body.querySelector('#phone');
		var phoneFormValue = phoneForm.value;
		var errorReport = "";

		if (phoneFormValue === "")
			return "";

		if (!/^(\+380)\d+$/.test(phoneFormValue))
			errorReport += "Международный формат записи телефона не выдержан. ";

		if (/[^\d\+]/.test(phoneFormValue))
			errorReport += "Номер содержит недопустимые символы. ";

		if (phoneFormValue.length !== 13)
			errorReport += "Длина номера не соответствует международному форматую ";

		return errorReport;
	};

	Validate.prototype._choseChecker = function(targetId) {
		if (targetId === 'email')
			return this._checkEmail;
		if (targetId === 'password')
			return this._checkPassword;
		if (targetId === 'city')
			return this._checkCity;
		if (targetId === 'phone')
			return this._checkPhone;
	};

	Validate.prototype._addAlertField = function(message, id) {
		var alertDiv = document.createElement('div');
		var hasErrorDiv = "";
		if (document.querySelector('.form-group>#' + id + ' + .alert') === null) {
			alertDiv.className += ' alert alert-danger';
			hasErrorDiv = document.querySelector('#' + id).parentNode;
			hasErrorDiv.appendChild(alertDiv);
			alertDiv.innerText = message;
		} else {
			document.querySelector('.form-group>#' + id + ' + .alert').innerText = message;
		}
	};

	Validate.prototype._deleteAlertField = function(id) {
		console.log('exec _deleteAlertField');
		if (!document.body.querySelector('.form-group>#' + id + ' + .alert'))
			return;
		var parent = document.querySelector('.form-group>#' + id + ' + .alert').parentNode;
		var child = document.querySelector('.form-group>#' + id + ' + .alert');
		parent.removeChild(child);
	};

	Validate.prototype._accessToButton = function() {
		if (document.querySelector('.alert-danger') ||
			document.querySelector('input[type="checkbox"]').checked === false ||
			this._detectEmptyRequiredForms()) {
			document.querySelector('.btn-primary').setAttribute('disabled', 'disable');
			return;
		}
		document.querySelector('.btn-primary').removeAttribute('disabled');
	};

	Validate.prototype._detectEmptyRequiredForms = function() {
		var requiredForms = document.querySelectorAll('.form-group.required>.form-control');
		for (var i = 0; i < requiredForms.length; i += 1)
			if (requiredForms[i].value.length === 0)
				return true;
	};

	window.Validate = Validate;

}());
