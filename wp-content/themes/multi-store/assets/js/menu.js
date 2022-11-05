// mobile menu plugin
(function($){
    var classToggler = function (param) {

        this.animation = param.animation,
            this.toggler = param.toggler,
            this.className = param.className,
            this.exceptions = param.exceptions;

        this.init = function () {
            var that = this;
            // for stop propagation
            var stopToggler = this.implode(this.exceptions);
            if ( typeof stopToggler !== 'undefined' ) {
                $( document ).on('click', stopToggler, function (e) {
                    e.stopPropagation();
                });
            }

            // for toggle class
            var toggler = this.implode(this.toggler);
            if (typeof toggler !== 'undefined') {

                $(document).on('click', toggler, function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    that.toggle();
                });
            }
        }

        //class toggler
        this.toggle = function () {
            var selectors = this.implode(this.animation);
            if (typeof selectors !== 'undefined') {
                $(selectors).toggleClass(this.className);
                if ($(selectors).hasClass(this.className)) {
                    $('.multi-store-menu-list > li:first-child a').focus();
                } else {
                    $('#menu-icon').focus();
                }
            }
        }

        // array selector maker
        this.implode = function (arr, imploder) {

            // checking arg is array or not
            if (!(arr instanceof Array)) {
                return arr;
            }
            // setting default imploder
            if (typeof imploder == 'undefined') {
                imploder = ',';
            }

            // making selector
            var data = arr;
            var ele = '';
            for (var j = 0; j < arr.length; j++) {
                ele += arr[j];
                if (j !== arr.length - 1) {
                    ele += imploder;
                }
            }
            data = ele;
            return data;
        }
    } //End mobileMenu

    $.fn.multiStoreMobileMenu = function (config) {

        /* defining default config*/
        var defaultConfig = {
            icon: '#menu-icon',
            closeIcon: true,
            overlay: true
        }
        $.extend(defaultConfig, config);
        var wrapperId = '#' + this.attr('id');
        if (!$(wrapperId).length) {
            console.error('Selected Element not found in DOM (Mobile menu plugin)');
            return this;
        }

        var _this = this;
        var shiftMenu = function () {

            var mobileMenuHTML = '<div>' + $(wrapperId).html() + '</div>',
                that = this;

            mobileMenuHTML = $(mobileMenuHTML).find('*').each(function (index, value) {
                var id = $(value).attr('id');
                if (id) {
                    $(value).attr('id', 'multi-store-' + id);
                }
            });

            /* constructor function */
            this.init = function () {
                $(document).ready(function () {
                    that.createMenu();
                    that.addDownArrow();
                    that.toggleSubUl();
                    that.menuToggler();
                    that.addClassOnFirstUl();
                });
            };

            this.createMenu = function () {
                var closeHTML = defaultConfig.closeIcon ? this.closeMenuIcon() : null,
                    overlayHTML = defaultConfig.overlay ? this.addOverlay() : null;
                $('body').append('<div class="multi-store-mobile-menu" id="multi-store-mobile-menu">' + closeHTML + '<ul class="multi-store-menu-list">' + mobileMenuHTML.html() + '</ul><button class="circular-focus screen-reader-text" data-goto=".multi-store-inner-box">Circular focus</button></div>' + overlayHTML)
            };

            this.closeMenuIcon = function () {
                return ('<div class="multi-store-close-wrapper"><button data-goto=".multi-store-menu-list > li:last-child a" class="circular-focus screen-reader-text">circular focus</button> <button tabindex="0" class="multi-store-inner-box" id="multi-store-close"><span class="screen-reader-text">close</span><span class="multi-store-inner"></span></button> </div>');
            };

            this.addOverlay = function () {
                return ('<div class="multi-store-mobile-menu-overlay"></div>');
            };

            this.addClassOnFirstUl = function () {
                if ($('#multi-store-mobile-menu ul').first().hasClass('menu') ) { } else {
                    $('#multi-store-mobile-menu ul').first().addClass('menu');
                }
            }

            this.addDownArrow = function () {
                var $mobileMenu = $('#multi-store-mobile-menu'),
                    $hasSubUl = $('#multi-store-mobile-menu .menu-item-has-children'),
                    haveClassOnLi = $mobileMenu.find('.menu-item-has-children');

                if ( haveClassOnLi.length > 0 ) {
                    $hasSubUl.children( 'a' ).append( '<a href="#" class="multi-store-arrow-box"><span class="multi-store-down-arrow"></span></a>');
                } else {
                    $('#multi-store-mobile-menu ul li:has(ul)').children('a').append('<a href="#" class="multi-store-arrow-box"><span class="multi-store-down-arrow"></span></a>');
                }
            };

            this.toggleSubUl = function () {
                $(document).on('click', '.multi-store-arrow-box', toggleSubMenu);

                function toggleSubMenu(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $(this).toggleClass('open').parent().next().slideToggle();
                }
            };

            this.menuToggler = function () {
                var menuConfig = {
                    animation: ['.multi-store-mobile-menu-overlay', '#multi-store-mobile-menu', 'body', '#menu-icon'],
                    exceptions: ['#multi-store-mobile-menu'],
                    toggler: ['#menu-icon', '.multi-store-mobile-menu-overlay', '#multi-store-close'],
                    className: 'multi-store-menu-open'
                };
                new classToggler(menuConfig).init();
            };

        }; /* End shiftMenu */

        /* instance of shiftmenu */
        new shiftMenu().init();

    };
})(jQuery);
