window.n = function (selector) {
	function Nodo (el) {
		for (var i = 0; i < el.length; i++) {
			this[i] = el[i];
		}

		this.length = el.length;
	}

	// ========= UTILS =========
		Nodo.prototype.forEach = function (callback) {
			this.map(callback);
			return this;
		};

		Nodo.prototype.map = function (callback) {
			var results = [];
			for (var i = 0; i < this.length; i++) {
				results.push(callback.call(this, this[i], i));
			}
			return results;
		};

		Nodo.prototype.mapOne = function (callback) {
			var m = this.map(callback);
			return m.length > 1 ? m : m[0];
		};

	// ========== DOM MANIPULATION ==========
		Nodo.prototype.text = function (text) {
			if (typeof text !== "undefined") {
				return this.forEach(function (el) {
					el.innerText = text;
				});
			}
			else {
				return this.mapOne(function (el) {
					return el.innerText;
				});
			}
		};

		Nodo.prototype.html = function (html) {
			if (typeof html !== "undefined") {
				return this.forEach(function (el) {
					el.innerHTML = html;
				});
			}
			else {
				return this.mapOne(function (el) {
					return el.innerHTML;
				});
			}
		};

		Nodo.prototype.addClass = function (classes) {
			var className = "";

			if (typeof classes !== 'string') {
				for (var i = 0; i < classes.length; i++) {
					className += " " + classes[i];
				}
			}
			else {
				className = " " + classes;
			}

			return this.forEach(function (el) {
				el.className += className;
			});
		};

		Nodo.prototype.removeClass = function (clazz) {
			return this.forEach(function (el) {
				var cs = el.className.split(' '), i;

				while ((i = cs.indexOf(clazz)) > -1) {
					cs = cs.slice(0, i).concat(cs.slice(++i));
				}

				el.className = cs.join(' ');
			});
		};

		Nodo.prototype.attr = function (attr, val) {
			if (typeof val !== 'undefined') {
				return this.forEach(function (el) {
					el.setAttribute(attr, val);
				});
			}
			else {
				return this.mapOne(function (el) {
					return el.getAttribute(attr);
				});
			}
		};

		Nodo.prototype.append = function (el) {
			return this.forEach(function (parEl, i) {
				el.forEach(function (childEl) {
					parEl.appendChild( (i > 0) ? childEl.cloneNode(true) : childEl);
				});
			});
		};

		Nodo.prototype.prepend = function (el) {
			return this.forEach(function (parEl, i) {
				for (var j = el.length -1; j > -1; j--) {
					parEl.insertBefore((i > 0) ? el[j].cloneNode(true) : el[j], parEl.firstChild);
				}
			});
		};

		Nodo.prototype.remove = function () {
			return this.forEach(function (el) {
				return el.parentNode.removeChild(el);
			});
		};

		Nodo.prototype.on = (function () {
			if (document.addEventListener) {
				return function (evt, fn) {
					return this.forEach(function (el) {
						 el.addEventListener(evt, fn, false);
					});
				};
			}
			else if (document.attachEvent)  {
				return function (evt, fn) {
					return this.forEach(function (el) {
						 el.attachEvent("on" + evt, fn);
					});
				};
			}
			else {
				return function (evt, fn) {
					return this.forEach(function (el) {
						 el["on" + evt] = fn;
					});
				};
			}
		}());

	// ========== CONSTRUCTOR ==========
	var el;

	if (typeof selector === "string") {
		el = document.querySelectorAll(selector);
	}
	else if (selector.length) {
		el = selector;
	}
	else {
		el = [selector];
	}

	return new Nodo(el);
};
