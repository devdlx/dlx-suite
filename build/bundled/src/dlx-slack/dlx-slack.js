(function() {
    'use strict';


    let MyBehavior = {
    };

    class dlxSlack {

        // Define behaviors with a getter.
        get behaviors() {
            return [MyBehavior];
        }

        // Element setup goes in beforeRegister instead of createdCallback.
        beforeRegister() {
            this.is = 'dlx-slack';

            // Define the properties object in beforeRegister.
            this.properties = {
                symbols: {
                    type: Array,
                    value: function() {
                        return [];
                    },
                    //observer: '_updateQuotes'
                }
            };
        }

        // #ready
        ready() {

        }

        attached() {}
        detached() {}
        attributeChanged() {}

        _updateQuotes() {
            // Same as the vanilla component.
        }
    }

    // Register the element using Polymer's constructor.
    Polymer(dlxSlack);
     const load = window.chrome.loadTimes();
            let fp = (load.firstPaintTime - load.startLoadTime) * 1000;
            if (fp) {
//                 ga('send', 'timing', 'load', 'firstPaint', fp);
                // console.log('First Paint:',fp, 'ms');
            }

})();
