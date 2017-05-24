/**
 * Toggle class of element based on scroll position and viewport. 
 *
 * @author Andreas Nymark <andreas@nymark.me>
 * @license MIT
 * @version 1
**/
var merl = merl || {};

merl.scrollToggle = ( function ( window, document ) {
	"use strict";


	var isScrolling = false,
		instances = [],
		winSize,
		defs = {
			selector: '.js-scrollToggle',
			selectBlock: '.block',
			classInView: 'is-inView',
			classOutView: 'is-outOfView',
			toggleAbove: false,
			minWidth: 600,
		};


	/**
	 * Initiate plugin
	 * @method init
	 * @param {Object} options - override default settings
	**/
	var init = function ( options ) {
		if( options ) {
			for( var o in options ) {
				defs[ o ] = options[ o ];
			}
		}

		var items = document.querySelectorAll( defs.selector ),
			len = items.length;

		measureWinSize();
		instances = [];

		if ( len > 0 && winSize.width > defs.minWidth ) {
			for ( var i = 0; i < len; i++ ) {
				instances.push( new scrollToggle( items[ i ] ) );
			}
			window.addEventListener( 'scroll', scrollHandler );
			window.addEventListener( 'resize', measureWinSize );
		}
	};


	/**
	* @constructor scrollToggle
	* @param {HTMLElement} elem - DOM Element
	*/
	var scrollToggle = function ( elem ) {
		var t = this;
		t.root = elem;
		t.blocks = t.root.querySelectorAll( defs.selectBlock );
		t.addChildClass( defs.classOutView );
	};


	scrollToggle.prototype = {


		/**
		 * Add class to child element below the fold.
		 * @method addChildClass
		 * @param {String} cls - class name
		**/
		addChildClass: function ( cls ) {
			var t = this;
			for ( var i = 0, len = t.blocks.length; i < len; i++ ) {
				var block = t.blocks[ i ],
					rect = block.getBoundingClientRect();

				if ( rect.top > winSize.height ) {
					block.classList.add( cls );
				}
			}
		},


		/**
		 * Event triggered when scrolling. Toggles class on child element when
		 * out of browser view.
		 * @method scrollEvent
		**/
		scrollEvent: function () {
			var t = this;
			for ( var i = 0, len = t.blocks.length; i < len; i++ ) {
				var block = t.blocks[ i ],
					rect = block.getBoundingClientRect();

				if ( defs.toggleAbove && rect.bottom > 0 && rect.top < winSize.height ) {
					block.classList.add( defs.classInView );
					block.classList.remove( defs.classOutView );
				} else if ( !defs.toggleAbove && rect.top < winSize.height ) {
					block.classList.add( defs.classInView );
					block.classList.remove( defs.classOutView );
				} else {
					block.classList.remove( defs.classInView );
					block.classList.add( defs.classOutView );
				}
			}
			isScrolling = false;
		},
	};


	/**
	 * Keeps isScrolling true.
	 * @method scrollHandler
	**/
	var scrollHandler = function () {
		if ( !isScrolling ) {
			window.requestAnimationFrame( scrollEvent );
		}
		isScrolling = true;
	};


	/**
	 * @method scrollEvent
	**/
	var scrollEvent = function () {
		for ( var i = 0, len = instances.length; i < len; i++ ) {
			instances[ i ].scrollEvent();
		}
		isScrolling = false;
	};


	/**
	 * @method measureWinSize
	**/
	var measureWinSize = function () {
		winSize = setWinSize();
	};


	/**
	 * @method setWinSize
	 * @return {Object}
	**/
	var setWinSize = function () {
		return {
			height: ( window.innerHeight || document.documentElement.clientHeight ),
			width: ( window.innerWidth || document.documentElement.clientWidth ),
		};
	};


	return {
		init: init,
	};
}( window, document ));
