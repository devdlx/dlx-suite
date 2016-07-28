window.performance && performance.mark && performance.mark('index.html');

let Polymer = {
    lazyRegister: true,
    dom: 'shadow'
};

(function() {
    if ('registerElement' in document &&
        'import' in document.createElement('link') &&
        'content' in document.createElement('template')) {
        // platform is good!
    } else {
        // polyfill the platform!
        var e = document.createElement('script');
        e.src = '/bower_components/webcomponentsjs/webcomponents-lite.min.js';
        document.body.appendChild(e);
    }

    document.addEventListener("DOMContentLoaded", function(event) {

        var splashText = document.querySelector('.splash .text');
        var content = document.querySelector('.content');


        setTimeout(function() {
            splashText.classList.add('fadeInUp');
        }, 200);

        window.addEventListener('WebComponentsReady', (e) => {
            console.log('WebComponentsReady');
        });


        setTimeout(function() {
            // console.log(splashText);
            // splashText.classList.add('ready');
            splashText.classList.add('fadeOutUp');
            content.classList.add('fadeIn');
        }, 3000);

    });







})();
