(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.performance && performance.mark && performance.mark('index.html');

let Polymer = {
    lazyRegister: true,
    dom: 'shadow'
};

(function () {
    if ('registerElement' in document && 'import' in document.createElement('link') && 'content' in document.createElement('template')) {
        // platform is good!
    } else {
        // polyfill the platform!
        var e = document.createElement('script');
        e.src = '/bower_components/webcomponentsjs/webcomponents-lite.min.js';
        document.body.appendChild(e);
    }

    document.addEventListener("DOMContentLoaded", function (event) {

        var splashText = document.querySelector('.splash .text');
        var content = document.querySelector('.content');

        setTimeout(function () {
            splashText.classList.add('fadeInUp');
        }, 200);

        window.addEventListener('WebComponentsReady', e => {
            console.log('WebComponentsReady');
        });

        setTimeout(function () {
            // console.log(splashText);
            // splashText.classList.add('ready');
            splashText.classList.add('fadeOutUp');
            content.classList.add('fadeIn');
        }, 3000);
    });
})();

},{}]},{},[1])


//# sourceMappingURL=build.js.map
