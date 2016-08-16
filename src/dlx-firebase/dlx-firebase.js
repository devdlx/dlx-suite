'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    'use strict';

    var MyBehavior = {};
    var app = null;
    var init = null;
    var user = null;

    var dlxFirebase = function () {
        _createClass(dlxFirebase, [{
            key: 'beforeRegister',


            // Element setup goes in beforeRegister instead of createdCallback.
            value: function beforeRegister() {
                this.is = 'dlx-firebase';

                // Define the properties object in beforeRegister.
                this.properties = {
                    data: {
                        type: Object,
                        notify: true
                    },

                    path: {
                        type: String,
                        notify: true
                    },

                    items: {
                        type: Array,
                        notify: true
                    },

                    query: {
                        type: String,
                        notify: true
                    },
                    idPath: {
                        type: Object,
                        value: ''
                    },

                    app: {
                        type: Object,
                        notify: true
                    },

                    name: {
                        type: String,
                        value: ''
                    },
                    apiKey: {
                        value: '',
                        type: String
                    },

                    authDomain: {
                        value: '',
                        type: String
                    },

                    databaseUrl: {
                        value: '',
                        type: String
                    },

                    storageBucket: {
                        value: '',
                        type: String
                    },

                    user: {
                        type: Object,
                        notify: true,
                        value: true
                    },
                    signedIn: {
                        type: Boolean,
                        notify: true,
                        value: false,
                        computed: '_computeSignedIn(app, user)'
                    }
                };

                this.listeners = {};

                this.observers = ['_computeApp(name, apiKey, authDomain, databaseUrl)', '_computePath(app, path)', '_computeQuery(app, query, idPath)', '_computeUserState(app)'];
            }

            // #_computeApp

        }, {
            key: '_computeApp',
            value: function _computeApp(name, apiKey, authDomain, databaseUrl) {

                if (!name && !apiKey && !authDomain && !databaseUrl) {
                    return;
                }

                // console.log(name, apiKey, authDomain, databaseUrl);
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
                    // app = firebase.initializeApp(init, name || null);
                    app = firebase.initializeApp(init);
                    this.set('app', app);
                } else {
                    return null;
                }
                //app = firebase.app(name);
            }
        }, {
            key: 'save',
            value: function save(path, item) {
                // console.log(app, path);
                return this.app.database().ref(path).push(item);
            }
        }, {
            key: '_computePath',
            value: function _computePath(app, path) {
                var _this = this;

                // console.log(app, path);
                app.database().ref(path).once('value').then(function (snap) {
                    var item = snap.val();
                    var key = snap.key;
                    // console.log(item);
                    _this.set('data', item);
                    // return item;
                });
            }
        }, {
            key: '_computeQuery',
            value: function _computeQuery(app, query, idPath) {
                // console.log(app, query, idPath);

                this.set('items', []);

                // app.database().ref(query).push({
                //     "title": 'Savage Mode | 21 Savage & Metro Boomin',
                //     "image": "https://i1.sndcdn.com/artworks-000171601684-t2q183-large.jpg",
                //     "link": "soundcloud/playlists/241605487",
                //     "type": "soundcloud:playlist",
                //     "description": "21 Savage & Metro Boomin's collaborative album, #SAVAGEMODE available on iTunes: smarturl.it/SavageModeiTunes\n\nhttp://21savage.com\nhttp://twitter.com/21savage\nhttp://instagram.com/21savage\nhttp://facebook.com/21savage\nhttp://youtube.com/c/21savage",
                //     "data_items": "soundcloud:tracks",
                //     "data_items_title": "title",
                //     "data_items_link": "${soundcloud:tracks:publisher_metadata:urn}",
                //
                app.database().ref(query).on('child_added', function (snap) {
                    var item = snap.val();
                    var key = snap.key;
                    this.push('items', item);
                }.bind(this));
            }
        }, {
            key: '_computeQueryIdPath',
            value: function _computeQueryIdPath(app, query, idPath) {
                var _this2 = this;

                // console.log(app, query, idPath);

                this.set('items', []);

                // app.database().ref(query).push({
                //     "title": 'Savage Mode | 21 Savage & Metro Boomin',
                //     "image": "https://i1.sndcdn.com/artworks-000171601684-t2q183-large.jpg",
                //     "link": "soundcloud/playlists/241605487",
                //     "type": "soundcloud:playlist",
                //     "description": "21 Savage & Metro Boomin's collaborative album, #SAVAGEMODE available on iTunes: smarturl.it/SavageModeiTunes\n\nhttp://21savage.com\nhttp://twitter.com/21savage\nhttp://instagram.com/21savage\nhttp://facebook.com/21savage\nhttp://youtube.com/c/21savage",
                //     "data_items": "soundcloud:tracks",
                //     "data_items_title": "title",
                //     "data_items_link": "${soundcloud:tracks:publisher_metadata:urn}",
                //
                app.database().ref(query).once('value', function (snap) {
                    var item = snap.val();
                    var key = snap.key;
                }).then(function (itemObject) {
                    // console.log(itemObject.val());

                    var arr = [];
                    var value = itemObject.val();
                    for (var item in value) {
                        if (value.hasOwnProperty(item)) {
                            if (idPath.length) {
                                app.database().ref(idPath + '/' + item).once('value').then(function (deep) {
                                    var item = deep.val();
                                    var key = deep.key;
                                    _this2.push('items', item);
                                    // arr.push(item);
                                    // console.log(item);
                                });
                            } else {
                                // console.log(value[item]);
                                _this2.push('items', value[item]);
                                // arr.push(item);
                            }
                        }
                    }
                    // this.set('items', arr);
                    // console.log(this.items);
                });
            }
        }, {
            key: 'attached',
            value: function attached() {}
            //console.log('attached');


            // #ready

        }, {
            key: 'ready',
            value: function ready() {
                // console.dir(app);
                if (app) {
                    this.set('app', app);
                }
                if (app && user) {
                    this.set('user', user);
                }
            }
        }, {
            key: 'behaviors',


            // Define behaviors with a getter.
            get: function get() {
                return [MyBehavior];
            }
        }]);

        function dlxFirebase() {
            _classCallCheck(this, dlxFirebase);

            console.log('constructor');
        }

        // #detached


        _createClass(dlxFirebase, [{
            key: 'detached',
            value: function detached() {}

            // #attributeChanged

        }, {
            key: 'attributeChanged',
            value: function attributeChanged() {}
        }, {
            key: 'loadFB',
            value: function loadFB(name, apiKey, authDomain, databaseUrl) {
                var _this3 = this;

                var scripts = ['../bower_components/firebase/firebase.js'];
                for (var i = 0; i < scripts.length; i++) {
                    var _s = document.createElement('script');
                    _s.src = scripts[i];
                    _s.onload = function (e) {
                        _this3._computeApp(name, apiKey, authDomain, databaseUrl);
                    };
                    document.body.appendChild(_s);
                }
            }
        }, {
            key: '_computeUserState',
            value: function _computeUserState(app) {
                var _this4 = this;

                app.auth().onAuthStateChanged(function (user) {
                    // console.log(user.toJSON());
                    _this4._computeUser(user);
                }, function (error) {
                    console.log(error);
                });
            }
        }, {
            key: '_computeSignedIn',
            value: function _computeSignedIn(app, user) {
                // console.log(app, user);
                return app && user;
            }
        }, {
            key: '_computeUserFromStorage',
            value: function _computeUserFromStorage(app) {

                var _user = localStorage.getItem("dlx-firebase-user");
                console.log(_user);
                if (_user) {
                    this._computeUser(_user);
                }
            }
        }, {
            key: '_computeUser',
            value: function _computeUser(user) {
                var _this5 = this;

                if (user) {
                    // User is signed in.
                    // console.log(user);
                    var displayName = user.displayName || user.email;
                    var email = user.email;
                    var emailVerified = user.emailVerified;
                    var photoURL = user.photoURL; // || 'https://s3.amazonaws.com/sensortower-itunes/blog/0126-app-store-review-fraud.jpg';
                    var uid = user.uid;
                    var providerData = user.providerData;
                    user.getToken().then(function (accessToken) {
                        // console.log({
                        //     displayName: displayName,
                        //     email: email,
                        //     emailVerified: emailVerified,
                        //     photoURL: photoURL,
                        //     uid: uid,
                        //     accessToken: accessToken,
                        //     providerData: providerData
                        // });

                        var _user = {
                            displayName: displayName,
                            email: email,
                            emailVerified: emailVerified,
                            photoURL: photoURL,
                            uid: uid,
                            accessToken: accessToken,
                            providerData: providerData
                        };
                        _this5.set('user', _user || user);
                        localStorage.setItem("dlx-firebase-user", _user || user);
                    });
                } else {
                    this.set('user', null);
                    // User is signed out.
                    //console.log('Signed out');
                    //return null;
                }
            }
        }, {
            key: 'logout',
            value: function logout() {
                return this.signOut();
            }
        }, {
            key: 'signOut',
            value: function signOut() {
                var _this6 = this;

                return firebase.auth().signOut().then(function () {
                    // Sign-out successful.
                    _this6.set('user', null);
                    _this6.fire('toast', {
                        message: 'Signed Out'
                    }, {
                        bubbles: false
                    });
                }, function (error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode, errorMessage);
                    this.fire('dlx-firebase-auth-error', {
                        errorCode: errorCode,
                        errorMessage: errorMessage
                    }, {
                        bubbles: false
                    });
                });
            }
        }, {
            key: 'signIn',
            value: function signIn(email, password) {
                var _this7 = this;

                return firebase.auth().signInWithEmailAndPassword(email, password).then(function (e) {
                    console.log(e);
                    //user = e;
                    _this7.set('user', user);
                    _this7.fire('dlx-firebase-auth-signedin', {
                        user: user
                    }, {
                        bubbles: false
                    });
                }).catch(function (error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode, errorMessage);
                    _this7.fire('dlx-firebase-auth-error', {
                        errorCode: errorCode,
                        errorMessage: errorMessage
                    }, {
                        bubbles: false
                    });
                });
            }
        }, {
            key: 'createUser',
            value: function createUser(email, password, password2) {
                var _this8 = this;

                if (password !== password2) {
                    this.fire('dlx-firebase-auth-error', {
                        errorCode: 400,
                        errorMessage: 'passwords do not match'
                    }, {
                        bubbles: false
                    });
                    return;
                }

                return firebase.auth().createUserWithEmailAndPassword(email, password).then(function (e) {
                    console.log(e);
                    _this8._computeUser(e);
                }).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode, errorMessage);
                    this.fire('dlx-firebase-auth-error', {
                        errorCode: errorCode,
                        errorMessage: errorMessage
                    }, {
                        bubbles: false
                    });
                });
            }
        }, {
            key: 'auth',
            value: function auth(_provider) {
                var _this9 = this;

                console.log(_provider);
                if (_provider === 'google') {
                    var provider = new firebase.auth.GoogleAuthProvider();
                    provider.addScope('https://www.googleapis.com/auth/plus.login');
                    provider.addScope('https://www.googleapis.com/auth/youtube.upload');
                }

                if (_provider === 'facebook') {
                    var provider = new firebase.auth.FacebookAuthProvider();
                    provider.addScope('user_birthday');
                }

                if (_provider === 'twitter') {
                    var provider = new firebase.auth.TwitterAuthProvider();
                }

                app.auth().signInWithPopup(provider).then(function (result) {
                    // var token = result.credential.accessToken;
                    // The signed-in user info.
                    _this9._computeUser(result.user);
                }).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;
                    // ...
                    console.log(error);
                    this.fire('dlx-firebase-auth-error', {
                        errorCode: errorCode,
                        errorMessage: errorMessage
                    }, {
                        bubbles: false
                    });
                });
            }
        }]);

        return dlxFirebase;
    }();

    // Register the element using Polymer's constructor.


    Polymer(dlxFirebase);

    // const load = window.chrome.loadTimes();
    // let fp = (load.firstPaintTime - load.startLoadTime) * 1000;
    // if (fp) {
    //     // ga('send', 'timing', 'load', 'firstPaint', fp);
    //     console.log('First Paint:', fp.toFixed(2), 'ms');
    // }
})();
//# sourceMappingURL=dlx-firebase.js.map