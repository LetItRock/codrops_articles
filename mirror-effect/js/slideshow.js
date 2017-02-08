/**
 *
 * Author: Pavlo Tymchuk
 */
;(function(window){
    'use strict';

    // helper function
    function extend(a, b) {
        for(var key in b) {
            if(b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }

    function Slideshow(el, options) {
        this.el = el;
        this.options = extend({}, this.options);
        extend(this.options, options);
        this.items = [].slice.call(this.el.querySelectorAll('.slide'));
        this.itemsTotal = this.items.length;
        this.nav = this.el.querySelector('.slideshow__nav');
        this.navitems = [].slice.call(this.nav.querySelectorAll('.btn--nav'));
        this.current = 0;
        this._init();
    }

    Slideshow.prototype.options = {
        duration: {show: 1500, hide: 500},
        delay: {show: 250, hide: 0},
        easing: {show: 'easeOutExpo', hide: 'easeOutExpo'},
        titleAnimation: 'vertical'
    };

    Slideshow.prototype._init = function() {
        var self = this;

        // Initialize a MirrorFx instance per item and store the references in an array:
        this.mirrorElems = [];
        this.items.forEach(function(item) {
            self.mirrorElems.push(new MirrorFx(item.querySelector('.mirror')));
        });

        // Show the first item´s images and title:
        this.items[this.current].classList.add('slide--current');
        this.mirrorElems[this.current].show();
        this._showTitle();

        // Set the current class to the navigation link.
        this.navitems[this.current].classList.add('btn--current');
        // Init/Bind the events.
        this._initEvents();
    };

    Slideshow.prototype._showTitle = function (pos) {
        this._toggleTitle('show', pos);
    };

    Slideshow.prototype._hideTitle = function (pos) {
        this._toggleTitle('hide', pos);
    };

    Slideshow.prototype._toggleTitle = function (action, pos) {
        var pos = pos != undefined ? pos : this.current,
            title = this.items[pos].querySelector('.slide__title');

        anime.remove(title);
        var opts = {
            targets: title,
            duration: this.options.duration[action],
            easing: this.options.easing[action],
            delay: this.options.delay[action],
            opacity: action === 'show' ? [0, 1] : [1, 0]
        };

        if(this.options.titleAnimation === 'vertical') {
            opts.translateY = action === 'show' ? [50, 0] : [0, 50];
        } else {
            opts.translateX = action === 'show' ? [50, 0] : [0, 50];
        }

        anime(opts);
    };

    Slideshow.prototype._initEvents = function () {
        var self = this;

        this.navitems.forEach(function (item, pos) {
            self._clickNavItem = function (ev) {
                if(self.current === pos || self.isAnimating) {
                    return false;
                }
                self.isAnimating = true;
                self._navigate(pos);
            };
            item.addEventListener('click', self._clickNavItem);
        });
    };

    Slideshow.prototype._navigate = function(pos) {
        var self = this,
            currentItem = this.items[this.current],
            currentItemTitle = currentItem.querySelector('.slide__title'),
            nextItem = this.items[pos];

        this.navitems[this.current].classList.remove('btn--current');
        this.navitems[pos].classList.add('btn--current');

        this.mirrorElems[this.current].hide(function () {
            currentItem.style.opacity = 0;
            currentItem.classList.remove('slide--current');

            self.current = pos;

            self.mirrorElems[self.current].show();

            nextItem.style.opacity = 1;
            nextItem.classList.add('slide--current');
            // show next title
            self._showTitle(pos);

            self.isAnimating = false;
        });

        this._hideTitle();
    };

    window.Slideshow = Slideshow;

})(window);