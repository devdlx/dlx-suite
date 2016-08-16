(function() {
    'use strict';


    let MyBehavior = {};
    let app = null;
    let init = null;
    let user = null;

    class dlxFirebase {

        // Define behaviors with a getter.
        get behaviors() {
            return [MyBehavior];
        }

        // Element setup goes in beforeRegister instead of createdCallback.
        beforeRegister() {
            this.is = 'dlx-firebase';

            // Define the properties object in beforeRegister.
            this.properties = {
                data: {
                    type: Object,
                    notify: true,
                    // computed: '_computePath(app, path)'
                },

                path: {
                    type: String,
                    notify: true,
                },

                items: {
                    type: Array,
                    notify: true,
                },

                query: {
                    type: String,
                    notify: true,
                },
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
                    value: '',
                    type: String,
                    //value: 'AIzaSyAMDWKG7qyQ9msJaaKb7vmvK-rNu3X_7-Q'
                },

                authDomain: {
                    value: '',
                    type: String,
                    //value: 'project-604055857022237684.firebaseapp.com'
                },

                databaseUrl: {
                    value: '',
                    type: String,
                    //value: 'https://project-604055857022237684.firebaseio.com'
                },


                storageBucket: {
                    value: '',
                    type: String,
                    //value: 'project-604055857022237684.appspot.com'
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
                },
            };

            this.listeners = {};

            this.observers = [
                '_computeApp(name, apiKey, authDomain, databaseUrl)',
                '_computePath(app, path)',
                '_computeQuery(app, query, idPath)',
                '_computeUserState(app)'
            ];
        }

        // #_computeApp
        _computeApp(name, apiKey, authDomain, databaseUrl) {

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


        save(path, item) {
            // console.log(app, path);
            return this.app.database().ref(path).push(item);
        }


        _computePath(app, path) {
            // console.log(app, path);
            app.database().ref(path).once('value').then((snap) => {
                let item = snap.val();
                let key = snap.key;
                // console.log(item);
                this.set('data', item);
                // return item;
            });
        }

        _computeQuery(app, query, idPath) {
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
            app.database().ref(query).on('child_added', function(snap) {
                let item = snap.val();
                let key = snap.key;
                this.push('items', item);

            }.bind(this));

        }

        _computeQueryIdPath(app, query, idPath) {
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
            app.database().ref(query).once('value', function(snap) {
                let item = snap.val();
                let key = snap.key;

            }).then((itemObject) => {
                // console.log(itemObject.val());

                let arr = [];
                let value = itemObject.val();
                for (var item in value) {
                    if (value.hasOwnProperty(item)) {
                        if (idPath.length) {
                            app.database().ref(idPath + '/' + item).once('value')
                                .then((deep) => {
                                    let item = deep.val();
                                    let key = deep.key;
                                    this.push('items', item);
                                    // arr.push(item);
                                    // console.log(item);
                                });
                        } else {
                            // console.log(value[item]);
                            this.push('items', value[item]);
                            // arr.push(item);
                        }
                    }
                }
                // this.set('items', arr);
                // console.log(this.items);
            });

        }


        attached() {
            //console.log('attached');
        }

        // #ready
        ready() {
            // console.dir(app);
            if (app) {
                this.set('app', app);
            }
            if (app && user) {
                this.set('user', user);
            }
        }

        constructor() {
            console.log('constructor');
        }


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


        _computeUserState(app) {
            app.auth().onAuthStateChanged((user) => {
                // console.log(user.toJSON());
                this._computeUser(user);
            }, function(error) {
                console.log(error);
            });
        }


        _computeSignedIn(app, user) {
            // console.log(app, user);
            return app && user;
        }

        _computeUserFromStorage(app) {

            var _user = localStorage.getItem("dlx-firebase-user");
            console.log(_user);
            if (_user) {
                this._computeUser(_user);
            }
        }

        _computeUser(user) {

            if (user) {
                // User is signed in.
                // console.log(user);
                var displayName = user.displayName || user.email;
                var email = user.email;
                var emailVerified = user.emailVerified;
                var photoURL = user.photoURL; // || 'https://s3.amazonaws.com/sensortower-itunes/blog/0126-app-store-review-fraud.jpg';
                var uid = user.uid;
                var providerData = user.providerData;
                user.getToken().then((accessToken) => {
                    // console.log({
                    //     displayName: displayName,
                    //     email: email,
                    //     emailVerified: emailVerified,
                    //     photoURL: photoURL,
                    //     uid: uid,
                    //     accessToken: accessToken,
                    //     providerData: providerData
                    // });

                    let _user = {
                        displayName: displayName,
                        email: email,
                        emailVerified: emailVerified,
                        photoURL: photoURL,
                        uid: uid,
                        accessToken: accessToken,
                        providerData: providerData
                    }
                    this.set('user', _user || user);
                    localStorage.setItem("dlx-firebase-user", _user || user);
                });

            } else {
                this.set('user', null);
                // User is signed out.
                //console.log('Signed out');
                //return null;
            }

        }

        logout() {
            return this.signOut();
        }

        signOut() {
            return firebase.auth().signOut().then(() => {
                // Sign-out successful.
                this.set('user', null);
                this.fire('toast', {
                    message: 'Signed Out'
                }, {
                    bubbles: false
                });
            }, function(error) {
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


        signIn(email, password) {
            return firebase.auth().signInWithEmailAndPassword(email, password)
                .then((e) => {
                    console.log(e);
                    //user = e;
                    this.set('user', user);
                    this.fire('dlx-firebase-auth-signedin', {
                        user: user
                    }, {
                        bubbles: false
                    });
                })
                .catch((error) => {
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

        createUser(email, password, password2) {

            if (password !== password2) {
                this.fire('dlx-firebase-auth-error', {
                    errorCode: 400,
                    errorMessage: 'passwords do not match'
                }, {
                    bubbles: false
                });
                return;
            }

            return firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((e) => {
                    console.log(e);
                    this._computeUser(e);
                })
                .catch(function(error) {
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

        auth(_provider) {
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

            app.auth().signInWithPopup(provider).then((result) => {
                // var token = result.credential.accessToken;
                // The signed-in user info.
                this._computeUser(result.user);
            }).catch(function(error) {
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


    }

    // Register the element using Polymer's constructor.
    Polymer(dlxFirebase);

    // const load = window.chrome.loadTimes();
    // let fp = (load.firstPaintTime - load.startLoadTime) * 1000;
    // if (fp) {
    //     // ga('send', 'timing', 'load', 'firstPaint', fp);
    //     console.log('First Paint:', fp.toFixed(2), 'ms');
    // }

})();
