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
                //     "soundcloud": {
                //         "artwork_url": "https://i1.sndcdn.com/artworks-000171601684-t2q183-large.jpg",
                //         "created_at": "2016-07-15T16:15:29Z",
                //         "description": "21 Savage & Metro Boomin's collaborative album, #SAVAGEMODE available on iTunes: smarturl.it/SavageModeiTunes\n\nhttp://21savage.com\nhttp://twitter.com/21savage\nhttp://instagram.com/21savage\nhttp://facebook.com/21savage\nhttp://youtube.com/c/21savage",
                //         "duration": 1947655,
                //         "embeddable_by": "all",
                //         "genre": "Hip Hop",
                //         "id": 241605487,
                //         "kind": "playlist",
                //         "label_name": "Slaughter Gang",
                //         "last_modified": "2016-07-15T16:43:27Z",
                //         "license": "all-rights-reserved",
                //         "likes_count": 43332,
                //         "managed_by_feeds": false,
                //         "permalink": "savage-mode-21-savage-metro",
                //         "permalink_url": "https://soundcloud.com/21savage/sets/savage-mode-21-savage-metro",
                //         "public": true,
                //         "purchase_title": "Buy on iTunes",
                //         "purchase_url": "http://smarturl.it/SavageModeiTunes",
                //         "release_date": null,
                //         "reposts_count": 9350,
                //         "secret_token": null,
                //         "sharing": "public",
                //         "tag_list": "Rap Trap \"metro boomin\" \"21 savage\"",
                //         "title": "Savage Mode | 21 Savage & Metro Boomin",
                //         "uri": "https://api.soundcloud.com/playlists/241605487",
                //         "user_id": 71223630,
                //         "set_type": "",
                //         "is_album": false,
                //         "published_at": "2016-07-15T16:15:29Z",
                //         "user": {
                //             "avatar_url": "https://i1.sndcdn.com/avatars-000238817849-zp5b93-large.jpg",
                //             "city": "Atlanta/Decatur",
                //             "comments_count": 0,
                //             "country_code": null,
                //             "creator_subscriptions": [{
                //                 "product": {
                //                     "id": "creator-pro-unlimited",
                //                     "name": "Pro Unlimited"
                //                 },
                //                 "recurring": false,
                //                 "hug": false
                //             }],
                //             "creator_subscription": null,
                //             "description": "All Inquires Contact 21@21savage.com\n#SavageMode #SlaughterGang",
                //             "followers_count": 138408,
                //             "followings_count": 6,
                //             "first_name": "21 Savage",
                //             "full_name": "21 Savage",
                //             "groups_count": 0,
                //             "id": 71223630,
                //             "kind": "user",
                //             "last_modified": "2016-07-15T22:41:00Z",
                //             "last_name": "",
                //             "likes_count": 15,
                //             "permalink": "21savage",
                //             "permalink_url": "https://soundcloud.com/21savage",
                //             "playlist_count": 3,
                //             "reposts_count": 5,
                //             "track_count": 42,
                //             "uri": "https://api.soundcloud.com/users/71223630",
                //             "urn": "soundcloud:users:71223630",
                //             "username": "21 Savage",
                //             "verified": false,
                //             "visuals": {
                //                 "urn": "soundcloud:users:71223630",
                //                 "enabled": true,
                //                 "visuals": [{
                //                     "urn": "soundcloud:visuals:11302137",
                //                     "entry_time": 0,
                //                     "visual_url": "https://i1.sndcdn.com/visuals-000071223630-ar7CZA-original.jpg"
                //                 }]
                //             }
                //         },
                //         "tracks": [{
                //             "artwork_url": "https://i1.sndcdn.com/artworks-000171597980-7w241u-large.jpg",
                //             "commentable": true,
                //             "comment_count": 53,
                //             "created_at": "2016-07-15T16:00:35Z",
                //             "description": "21 Savage & Metro Boomin's collaborative album, #SAVAGEMODE available on iTunes: http://smarturl.it/SavageModeiTunes\n\nhttp://21savage.com\nhttp://twitter.com/21savage\nhttp://instagram.com/21savage\nhttp://facebook.com/21savage\nhttp://youtube.com/c/21savage",
                //             "downloadable": false,
                //             "download_count": 0,
                //             "download_url": null,
                //             "duration": 276558,
                //             "full_duration": 276558,
                //             "embeddable_by": "all",
                //             "genre": "Hip-hop & Rap",
                //             "has_downloads_left": true,
                //             "id": 273828813,
                //             "kind": "track",
                //             "label_name": null,
                //             "last_modified": "2016-07-25T14:40:15Z",
                //             "license": "all-rights-reserved",
                //             "likes_count": 20026,
                //             "permalink": "no-advance",
                //             "permalink_url": "https://soundcloud.com/21savage/no-advance",
                //             "playback_count": 643006,
                //             "public": true,
                //             "publisher_metadata": {
                //                 "urn": "soundcloud:tracks:273828813",
                //                 "artist": "21 Savage & Metro Boomin",
                //                 "contains_music": true,
                //                 "publisher": "Slaughter Gang LLC",
                //                 "isrc": "QZ45A1600039",
                //                 "writer_composer": "Metro Boomin",
                //                 "release_title": "Savage Mode"
                //             },
                //             "purchase_title": null,
                //             "purchase_url": null,
                //             "release_date": "2016-07-14T00:00:00Z",
                //             "reposts_count": 1846,
                //             "secret_token": null,
                //             "sharing": "public",
                //             "state": "finished",
                //             "streamable": true,
                //             "tag_list": "\"21 savage\" \"metro boomin\" sizzle atlanta \"savage mode\" future \"no heart\" ocean \"x bitch\"",
                //             "title": "No Advance",
                //             "uri": "https://api.soundcloud.com/tracks/273828813",
                //             "urn": "soundcloud:tracks:273828813",
                //             "user_id": 71223630,
                //             "visuals": null,
                //             "waveform_url": "https://wis.sndcdn.com/9W9x3fb6Zxcm_m.json",
                //             "monetization_model": "AD_SUPPORTED",
                //             "policy": "MONETIZE",
                //             "user": {
                //                 "avatar_url": "https://i1.sndcdn.com/avatars-000238817849-zp5b93-large.jpg",
                //                 "first_name": "21 Savage",
                //                 "full_name": "21 Savage",
                //                 "id": 71223630,
                //                 "kind": "user",
                //                 "last_modified": "2016-07-15T22:41:00Z",
                //                 "last_name": "",
                //                 "permalink": "21savage",
                //                 "permalink_url": "https://soundcloud.com/21savage",
                //                 "uri": "https://api.soundcloud.com/users/71223630",
                //                 "urn": "soundcloud:users:71223630",
                //                 "username": "21 Savage",
                //                 "verified": false,
                //                 "city": "Atlanta/Decatur",
                //                 "country_code": null
                //             }
                //         }, {
                //             "artwork_url": "https://i1.sndcdn.com/artworks-000171598151-4h3pp6-large.jpg",
                //             "commentable": true,
                //             "comment_count": 82,
                //             "created_at": "2016-07-15T16:00:34Z",
                //             "description": "21 Savage & Metro Boomin's collaborative album, #SAVAGEMODE available on iTunes: http://smarturl.it/SavageModeiTunes\n\nhttp://21savage.com\nhttp://twitter.com/21savage\nhttp://instagram.com/21savage\nhttp://facebook.com/21savage\nhttp://youtube.com/c/21savage",
                //             "downloadable": false,
                //             "download_count": 0,
                //             "download_url": null,
                //             "duration": 235122,
                //             "full_duration": 235122,
                //             "embeddable_by": "all",
                //             "genre": "Hip-hop & Rap",
                //             "has_downloads_left": true,
                //             "id": 273828812,
                //             "kind": "track",
                //             "label_name": null,
                //             "last_modified": "2016-07-25T14:40:27Z",
                //             "license": "all-rights-reserved",
                //             "likes_count": 29659,
                //             "permalink": "no-heart",
                //             "permalink_url": "https://soundcloud.com/21savage/no-heart",
                //             "playback_count": 1002990,
                //             "public": true,
                //             "publisher_metadata": {
                //                 "urn": "soundcloud:tracks:273828812",
                //                 "artist": "21 Savage & Metro Boomin",
                //                 "contains_music": true,
                //                 "publisher": "Slaughter Gang LLC",
                //                 "isrc": "QZ45A1600040",
                //                 "writer_composer": "Metro Boomin",
                //                 "release_title": "Savage Mode"
                //             },
                //             "purchase_title": null,
                //             "purchase_url": null,
                //             "release_date": "2016-07-13T00:00:00Z",
                //             "reposts_count": 3350,
                //             "secret_token": null,
                //             "sharing": "public",
                //             "state": "finished",
                //             "streamable": true,
                //             "tag_list": "\"21 savage\" \"metro boomin\" sizzle atlanta \"savage mode\" future \"no heart\" ocean \"x bitch\"",
                //             "title": "No Heart",
                //             "uri": "https://api.soundcloud.com/tracks/273828812",
                //             "urn": "soundcloud:tracks:273828812",
                //             "user_id": 71223630,
                //             "visuals": null,
                //             "waveform_url": "https://wis.sndcdn.com/mwPg9EvUbkea_m.json",
                //             "monetization_model": "AD_SUPPORTED",
                //             "policy": "MONETIZE",
                //             "user": {
                //                 "avatar_url": "https://i1.sndcdn.com/avatars-000238817849-zp5b93-large.jpg",
                //                 "first_name": "21 Savage",
                //                 "full_name": "21 Savage",
                //                 "id": 71223630,
                //                 "kind": "user",
                //                 "last_modified": "2016-07-15T22:41:00Z",
                //                 "last_name": "",
                //                 "permalink": "21savage",
                //                 "permalink_url": "https://soundcloud.com/21savage",
                //                 "uri": "https://api.soundcloud.com/users/71223630",
                //                 "urn": "soundcloud:users:71223630",
                //                 "username": "21 Savage",
                //                 "verified": false,
                //                 "city": "Atlanta/Decatur",
                //                 "country_code": null
                //             }
                //         }, {
                //             "artwork_url": "https://i1.sndcdn.com/artworks-000171597968-6ou25w-large.jpg",
                //             "commentable": true,
                //             "comment_count": 237,
                //             "created_at": "2016-07-15T16:00:34Z",
                //             "description": "21 Savage & Metro Boomin's collaborative album, #SAVAGEMODE available on iTunes: http://smarturl.it/SavageModeiTunes\n\nhttp://21savage.com\nhttp://twitter.com/21savage\nhttp://instagram.com/21savage\nhttp://facebook.com/21savage\nhttp://youtube.com/c/21savage",
                //             "downloadable": false,
                //             "download_count": 0,
                //             "download_url": null,
                //             "duration": 258976,
                //             "full_duration": 258976,
                //             "embeddable_by": "all",
                //             "genre": "Hip-hop & Rap",
                //             "has_downloads_left": true,
                //             "id": 273828810,
                //             "kind": "track",
                //             "label_name": null,
                //             "last_modified": "2016-07-27T22:12:13Z",
                //             "license": "all-rights-reserved",
                //             "likes_count": 66524,
                //             "permalink": "x-feat-future",
                //             "permalink_url": "https://soundcloud.com/21savage/x-feat-future",
                //             "playback_count": 1894325,
                //             "public": true,
                //             "publisher_metadata": {
                //                 "urn": "soundcloud:tracks:273828810",
                //                 "artist": "21 Savage & Metro Boomin",
                //                 "contains_music": true,
                //                 "publisher": "Slaughter Gang LLC",
                //                 "isrc": "QZ45A1600041",
                //                 "writer_composer": "Metro Boomin",
                //                 "release_title": "Savage Mode"
                //             },
                //             "purchase_title": null,
                //             "purchase_url": null,
                //             "release_date": "2016-07-14T00:00:00Z",
                //             "reposts_count": 8617,
                //             "secret_token": null,
                //             "sharing": "public",
                //             "state": "finished",
                //             "streamable": true,
                //             "tag_list": "\"21 savage\" \"metro boomin\" sizzle atlanta \"savage mode\" future \"no heart\" ocean \"x bitch\"",
                //             "title": "X (feat. Future)",
                //             "uri": "https://api.soundcloud.com/tracks/273828810",
                //             "urn": "soundcloud:tracks:273828810",
                //             "user_id": 71223630,
                //             "visuals": null,
                //             "waveform_url": "https://wis.sndcdn.com/yJKGtvbboNfM_m.json",
                //             "monetization_model": "AD_SUPPORTED",
                //             "policy": "MONETIZE",
                //             "user": {
                //                 "avatar_url": "https://i1.sndcdn.com/avatars-000238817849-zp5b93-large.jpg",
                //                 "first_name": "21 Savage",
                //                 "full_name": "21 Savage",
                //                 "id": 71223630,
                //                 "kind": "user",
                //                 "last_modified": "2016-07-15T22:41:00Z",
                //                 "last_name": "",
                //                 "permalink": "21savage",
                //                 "permalink_url": "https://soundcloud.com/21savage",
                //                 "uri": "https://api.soundcloud.com/users/71223630",
                //                 "urn": "soundcloud:users:71223630",
                //                 "username": "21 Savage",
                //                 "verified": false,
                //                 "city": "Atlanta/Decatur",
                //                 "country_code": null
                //             }
                //         }, {
                //             "artwork_url": "https://i1.sndcdn.com/artworks-000171597961-rjnchh-large.jpg",
                //             "commentable": true,
                //             "comment_count": 23,
                //             "created_at": "2016-07-15T16:00:34Z",
                //             "description": "21 Savage & Metro Boomin's collaborative album, #SAVAGEMODE available on iTunes: http://smarturl.it/SavageModeiTunes\n\nhttp://21savage.com\nhttp://twitter.com/21savage\nhttp://instagram.com/21savage\nhttp://facebook.com/21savage\nhttp://youtube.com/c/21savage",
                //             "downloadable": false,
                //             "download_count": 0,
                //             "download_url": null,
                //             "duration": 249675,
                //             "full_duration": 249675,
                //             "embeddable_by": "all",
                //             "genre": "Hip-hop & Rap",
                //             "has_downloads_left": true,
                //             "id": 273828809,
                //             "kind": "track",
                //             "label_name": null,
                //             "last_modified": "2016-07-25T14:40:12Z",
                //             "license": "all-rights-reserved",
                //             "likes_count": 16714,
                //             "permalink": "savage-mode",
                //             "permalink_url": "https://soundcloud.com/21savage/savage-mode",
                //             "playback_count": 604481,
                //             "public": true,
                //             "publisher_metadata": {
                //                 "urn": "soundcloud:tracks:273828809",
                //                 "artist": "21 Savage & Metro Boomin",
                //                 "contains_music": true,
                //                 "publisher": "Slaughter Gang LLC",
                //                 "isrc": "QZ45A1600042",
                //                 "writer_composer": "Metro Boomin",
                //                 "release_title": "Savage Mode"
                //             },
                //             "purchase_title": null,
                //             "purchase_url": null,
                //             "release_date": "2016-07-14T00:00:00Z",
                //             "reposts_count": 1440,
                //             "secret_token": null,
                //             "sharing": "public",
                //             "state": "finished",
                //             "streamable": true,
                //             "tag_list": "\"21 savage\" \"metro boomin\" sizzle atlanta \"savage mode\" future \"no heart\" ocean \"x bitch\"",
                //             "title": "Savage Mode",
                //             "uri": "https://api.soundcloud.com/tracks/273828809",
                //             "urn": "soundcloud:tracks:273828809",
                //             "user_id": 71223630,
                //             "visuals": null,
                //             "waveform_url": "https://wis.sndcdn.com/dVYuQlnpRT2c_m.json",
                //             "monetization_model": "AD_SUPPORTED",
                //             "policy": "MONETIZE",
                //             "user": {
                //                 "avatar_url": "https://i1.sndcdn.com/avatars-000238817849-zp5b93-large.jpg",
                //                 "first_name": "21 Savage",
                //                 "full_name": "21 Savage",
                //                 "id": 71223630,
                //                 "kind": "user",
                //                 "last_modified": "2016-07-15T22:41:00Z",
                //                 "last_name": "",
                //                 "permalink": "21savage",
                //                 "permalink_url": "https://soundcloud.com/21savage",
                //                 "uri": "https://api.soundcloud.com/users/71223630",
                //                 "urn": "soundcloud:users:71223630",
                //                 "username": "21 Savage",
                //                 "verified": false,
                //                 "city": "Atlanta/Decatur",
                //                 "country_code": null
                //             }
                //         }, {
                //             "artwork_url": "https://i1.sndcdn.com/artworks-000171597959-96guv5-large.jpg",
                //             "commentable": true,
                //             "comment_count": 14,
                //             "created_at": "2016-07-15T16:00:33Z",
                //             "description": "21 Savage & Metro Boomin's collaborative album, #SAVAGEMODE available on iTunes: http://smarturl.it/SavageModeiTunes\n\nhttp://21savage.com\nhttp://twitter.com/21savage\nhttp://instagram.com/21savage\nhttp://facebook.com/21savage\nhttp://youtube.com/c/21savage",
                //             "downloadable": false,
                //             "download_count": 0,
                //             "download_url": null,
                //             "duration": 169576,
                //             "full_duration": 169576,
                //             "embeddable_by": "all",
                //             "genre": "Hip-hop & Rap",
                //             "has_downloads_left": true,
                //             "id": 273828807,
                //             "kind": "track",
                //             "label_name": null,
                //             "last_modified": "2016-07-19T09:14:31Z",
                //             "license": "all-rights-reserved",
                //             "likes_count": 8681,
                //             "permalink": "bad-guy",
                //             "permalink_url": "https://soundcloud.com/21savage/bad-guy",
                //             "playback_count": 360237,
                //             "public": true,
                //             "publisher_metadata": {
                //                 "urn": "soundcloud:tracks:273828807",
                //                 "artist": "21 Savage & Metro Boomin",
                //                 "contains_music": true,
                //                 "publisher": "Slaughter Gang LLC",
                //                 "isrc": "QZ45A1600043",
                //                 "writer_composer": "Metro Boomin",
                //                 "release_title": "Savage Mode"
                //             },
                //             "purchase_title": null,
                //             "purchase_url": null,
                //             "release_date": "2016-07-14T00:00:00Z",
                //             "reposts_count": 644,
                //             "secret_token": null,
                //             "sharing": "public",
                //             "state": "finished",
                //             "streamable": true,
                //             "tag_list": "\"21 savage\" \"metro boomin\" sizzle atlanta \"savage mode\" future \"no heart\" ocean \"x bitch\"",
                //             "title": "Bad Guy",
                //             "uri": "https://api.soundcloud.com/tracks/273828807",
                //             "urn": "soundcloud:tracks:273828807",
                //             "user_id": 71223630,
                //             "visuals": null,
                //             "waveform_url": "https://wis.sndcdn.com/6xIemk6LOpFD_m.json",
                //             "monetization_model": "AD_SUPPORTED",
                //             "policy": "MONETIZE",
                //             "user": {
                //                 "avatar_url": "https://i1.sndcdn.com/avatars-000238817849-zp5b93-large.jpg",
                //                 "first_name": "21 Savage",
                //                 "full_name": "21 Savage",
                //                 "id": 71223630,
                //                 "kind": "user",
                //                 "last_modified": "2016-07-15T22:41:00Z",
                //                 "last_name": "",
                //                 "permalink": "21savage",
                //                 "permalink_url": "https://soundcloud.com/21savage",
                //                 "uri": "https://api.soundcloud.com/users/71223630",
                //                 "urn": "soundcloud:users:71223630",
                //                 "username": "21 Savage",
                //                 "verified": false,
                //                 "city": "Atlanta/Decatur",
                //                 "country_code": null
                //             }
                //         }, {
                //             "id": 273828805,
                //             "kind": "track"
                //         }, {
                //             "id": 273828803,
                //             "kind": "track"
                //         }, {
                //             "id": 273828777,
                //             "kind": "track"
                //         }, {
                //             "id": 273828776,
                //             "kind": "track"
                //         }],
                //         "track_count": 9
                //     }
                // });

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