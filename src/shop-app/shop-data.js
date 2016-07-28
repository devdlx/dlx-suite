(function() {


    let MyBehavior = {};

    let app = null;
    let init = null;


    class shopData {

        // Define behaviors with a getter.
        // get behaviors() {
        //     return [MyBehavior];
        // }

        // Element setup goes in beforeRegister instead of createdCallback.
        beforeRegister() {
            this.is = 'shop-data';
            // Define the properties object in beforeRegister.
            this.properties = {
                data: {
                    type: Object,
                    notify: true,
                    computed: '_computePath(app, path)'
                },

                items: {
                    type: Array,
                    notify: true,
                },

                query: String,
                idPath: {
                    type: Object,
                    value: ''
                },

                app: {
                    type: Object,
                    notify: true,
                },

                name: {
                    type: String,
                    value: ''
                },
                apiKey: {
                    type: String,
                    //value: 'AIzaSyAMDWKG7qyQ9msJaaKb7vmvK-rNu3X_7-Q'
                },

                authDomain: {
                    type: String,
                    //value: 'project-604055857022237684.firebaseapp.com'
                },

                databaseUrl: {
                    type: String,
                    //value: 'https://project-604055857022237684.firebaseio.com'
                },

                storageBucket: {
                    type: String,
                    //value: 'project-604055857022237684.appspot.com'
                },

            };

            this.listeners = {};

            this.observers = [
                '_computeApp(name, apiKey, authDomain, databaseUrl)',
                '_computeQuery(app, query, idPath)'
            ];
        }


        _computeApp(name, apiKey, authDomain, databaseUrl) {
            //console.log(name, apiKey, authDomain, databaseUrl);

            // if (!window.firebase) {
            //     this.loadFB(name, apiKey, authDomain, databaseUrl);
            //     return;
            // }


            if (apiKey && authDomain && databaseUrl) {
                init = {
                    apiKey: apiKey,
                    authDomain: authDomain,
                    databaseURL: databaseUrl
                };
                if (name) {
                    init.name = name;
                }
                firebase.initializeApp(init);
            } else {
                return null;
            }
            app = firebase.app(name);
            this.set('app', app);
        }


        _computePath(app, path) {
            console.log(app);
        }

        _computeQuery(app, query, idPath) {
            // console.log(app, query, idPath);

            this.set('items', []);

            firebase.database().ref('shop/localhost' + query).once('value', function(snap) {
                let item = snap.val();
                let key = snap.key;

                //firebase.database().ref('/shop/' + document.location.hostname + '/sidebar/items/level1/items/'+key).set(item);

            }).then((itemObject) => {
                //console.log(itemObject.val());
                let value = itemObject.val();
                for (var item in value) {
                    if (value.hasOwnProperty(item)) {
                        if (idPath.length) {
                            firebase.database().ref('shop/localhost' + idPath + '/' + item).once('value')
                                .then((deep) => {
                                    let item = deep.val();
                                    let key = deep.key;
                                    this.push('items', item);
                                    // console.log(item);
                                });
                        } else {
                            // console.log(value[item]);
                            this.push('items', value[item]);
                        }
                    }

                }
            });

        }




        // #ready
        ready() {
            if (app) {
                this.set('app', app);
            }
        }

        constructor() {
            console.log('constructor');
        }

        // #attached
        attached() {}

        // #detached
        detached() {}

        // #attributeChanged
        attributeChanged() {}

        loadFB(name, apiKey, authDomain, databaseUrl) {
            let scripts = [
                '../bower_components/firebase/firebase.js'
            ];
            for (var i = 0; i < scripts.length; i++) {
                var _s = document.createElement('script');
                _s.src = scripts[i];
                _s.onload = (e) => {
                    this._computeApp(name, apiKey, authDomain, databaseUrl);
                };
                document.body.appendChild(_s);
            }
        }


    }

    Polymer(shopData);


})();
