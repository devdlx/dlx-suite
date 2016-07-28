'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

    // #web-shell
    var MyBehavior = {};

    var webShell = function () {
        function webShell() {
            _classCallCheck(this, webShell);
        }

        _createClass(webShell, [{
            key: 'beforeRegister',


            // Define behaviors with a getter.
            // get behaviors() {
            //     return [MyBehavior];
            // }

            // Element setup goes in beforeRegister instead of createdCallback.
            value: function beforeRegister() {
                this.is = 'web-shell';
                // Define the properties object in beforeRegister.
                this.properties = {

                    signedIn: Boolean,
                    user: Object,
                    title: String,
                    routeData: Object,
                    subroute: String,
                    smallScreen: String,
                    cart: Object,
                    total: Number,
                    categoryName: String,
                    categories: Array,
                    offline: Boolean,

                    menu: {
                        type: Array,
                        notify: true,
                        value: [{
                            'name': 'favorites',
                            'link': 'favorites',
                            'title': 'Favorites',
                            'page': 'list',
                            'icon': 'menu',
                            'items': [{
                                'name': 'video/e04c85c1fdffddbc07e2fdab717a089227c6a6b0',
                                'page': 'video',
                                'link': 'e04c85c1fdffddbc07e2fdab717a089227c6a6b0',
                                'title': 'Escobar'
                            }]
                        }]
                    },

                    page: {
                        type: String,
                        reflectToAttribute: true,
                        observer: '_pageChanged'
                    },

                    numItems: {
                        type: Number,
                        value: 0
                    },

                    _shouldShowTabs: {
                        computed: '_computeShouldShowTabs(page, smallScreen)'
                    },

                    _shouldRenderTabs: {
                        computed: '_computeShouldRenderTabs(_shouldShowTabs, loadComplete)'
                    },

                    _shouldRenderDrawer: {
                        computed: '_computeShouldRenderDrawer(smallScreen, loadComplete)'
                    }

                };

                this.listeners = {
                    'add-cart-item': '_onAddCartItem',
                    'set-cart-item': '_onSetCartItem',
                    'clear-cart': '_onClearCart',
                    'change-section': '_onChangeSection',
                    'announce': '_onAnnounce',
                    'dom-change': '_domChange'
                };

                this.observers = ['_routePageChanged(routeData.page)', '_appChanged(subroute)'];
            }

            // #ready

        }, {
            key: 'ready',
            value: function ready() {
                // console.log('player ready');

            }
        }, {
            key: 'attached',
            value: function attached() {}
        }, {
            key: 'detached',
            value: function detached() {}
        }, {
            key: 'attributeChanged',
            value: function attributeChanged() {}
        }, {
            key: '_computeHeader',
            value: function _computeHeader(menuItem) {
                // console.log('_computeHeader', menuItem.name === 'home' ? true : false);
                // return menuItem.name === 'home' ? true : false;
            }
        }, {
            key: 'created',
            value: function created() {
                window.performance && performance.mark && performance.mark('dlx-suite-app.created');
                // Custom elements polyfill safe way to indicate an element has been upgraded.
                // this.removeAttribute('unresolved');
                // this.toggleClass('fadeInUp')
                // let splash = document.querySelector('splash');
                // this.async(()=>{
                // splash.classList.remove('fadeInUp');
                // splash.classList.add('fadeOutUp');
                // console.log('splash', splash);
                // }, 2000)
            }
        }, {
            key: '_computeMenu',
            value: function _computeMenu() {
                //#menu
                firebase.database().ref('/sidebar/items').on('child_added', function (snap) {
                    var item = snap.val();
                    var key = snap.key;
                    var menuItems = [];

                    firebase.database().ref('/sidebar/items/' + key + '/items').on('child_added', function (snap2) {
                        var menuItem = snap2.val();
                        var menuItemkey = snap2.key;
                        //set all to list view
                        //firebase.database().ref(path + '/sidebar/items/' + key + '/items/'+menuItemkey+'/type').set('list');
                        menuItems.push(menuItem);
                        item.items = menuItems;
                        //console.log(menuItem);
                    }.bind(this));
                    this.push('menu', item);
                }.bind(this));

                // each cat, each item in items, set data
                firebase.database().ref('shop/localhost/categories/byId').on('child_added', function (snap) {
                    var item = snap.val();
                    var key = snap.key;

                    firebase.database().ref('shop/localhost/categories/byId/' + key + '/items').on('child_added', function (snap2) {
                        var item2 = snap2.val();
                        var key2 = snap2.key;

                        var name = item2.title.replace(/[^\w-]/g, '_').toLowerCase();
                        var title = item2.title;
                        //console.log(item2);
                        //firebase.database().ref('shop/localhost/categories/byId/'+key+'/items/'+key2).set({'key':key2, 'name':name, 'title': title,'type':'detail'});
                        //firebase.database().ref('/shop/localhost/products/byName/'+name).set({'key':key, 'name':name, 'title': title});
                    }.bind(this));
                }.bind(this));

                this.set('ref', firebase.database());
            }
        }, {
            key: 'ready',
            value: function ready() {

                // listen for online/offline
                Polymer.RenderStatus.afterNextRender(this, function () {
                    this.listen(window, 'online', '_notifyNetworkStatus');
                    this.listen(window, 'offline', '_notifyNetworkStatus');
                });
            }
        }, {
            key: '_routePageChanged',
            value: function _routePageChanged(page) {
                this.page = page || 'home';
                // Scroll to the top of the page on every *route* change. Use `Polymer.AppLayout.scroll`
                // with `behavior: 'silent'` to disable header scroll effects during the scroll.
                Polymer.AppLayout.scroll({
                    top: 0,
                    behavior: 'silent'
                });
                // Close the drawer - in case the *route* change came from a link in the drawer.
                //console.log(this._shouldRenderDrawer);
                if (this._shouldRenderDrawer) {
                    this.drawerOpened = false;
                }
            }
        }, {
            key: '_pageChanged',
            value: function _pageChanged(pageName, oldPage) {

                if (pageName != null) {
                    // home route is eagerly loaded
                    if (pageName == 'home') {
                        this._pageLoaded(Boolean(oldPage));
                        // other routes are lazy loaded
                    } else {

                        var pageList = this.$.pages.items;

                        for (var i = 0; i < pageList.length; i++) {
                            // console.log(pageList[i].tagName.toLowerCase() === 'page-' + pageName);
                            if (pageList[i].tagName.toLowerCase() !== 'page-' + pageName) {
                                // console.log(pageList[i].tagName.toLowerCase() === 'page-' + pageName);
                                this.importHref(this.resolveUrl('page-' + pageName + '.html'), function () {
                                    this._pageLoaded(Boolean(oldPage));
                                }, null, true);
                            }
                        }
                    }
                }
            }
        }, {
            key: '_appChanged',
            value: function _appChanged(app, oldApp) {
                if (app) {
                    // console.log(app);
                }
            }
        }, {
            key: '_pageLoaded',
            value: function _pageLoaded(shouldResetLayout) {
                this._ensureLazyLoaded();
                if (shouldResetLayout) {
                    // The size of the header depends on the page (e.g. on some pages the tabs
                    // do not appear), so reset the header's layout only when switching pages.
                    this.async(function () {
                        this.$.header.resetLayout();
                    }, 1);
                }
            }
        }, {
            key: '_ensureLazyLoaded',
            value: function _ensureLazyLoaded() {
                // load lazy resources after render and set `loadComplete` when done.
                if (!this.loadComplete) {
                    this.loadComplete = true;
                    return;

                    Polymer.RenderStatus.afterNextRender(this, function () {
                        this.importHref(this.resolveUrl('lazy-resources.html'), function () {
                            // Register service worker if supported.
                            if ('serviceWorker' in navigator) {
                                navigator.serviceWorker.register('/service-worker.js');
                            }
                            this._notifyNetworkStatus();
                            this.loadComplete = true;
                        });
                    });
                }
            }
        }, {
            key: '_notifyNetworkStatus',
            value: function _notifyNetworkStatus() {
                var oldOffline = this.offline;
                this.offline = !navigator.onLine;
                // Show the snackbar if the user is offline when starting a new session
                // or if the network status changed.
                if (this.offline || !this.offline && oldOffline === true) {
                    if (!this._networkSnackbar) {
                        this._networkSnackbar = document.createElement('dlx-snackbar');
                        Polymer.dom(this.root).appendChild(this._networkSnackbar);
                    }
                    Polymer.dom(this._networkSnackbar).innerHTML = this.offline ? 'You are offline' : 'You are online';
                    this._networkSnackbar.open();
                }
            }
        }, {
            key: '_toggleDrawer',
            value: function _toggleDrawer() {
                // console.log(this.drawerOpened ,this.drawerOpened);
                this.drawerOpened = !this.drawerOpened;
            }

            // Elements in the app can notify section changes.
            // Response by a11y announcing the section and syncronizing the category.

        }, {
            key: '_onChangeSection',
            value: function _onChangeSection(event) {

                var detail = event.detail;

                // Announce the page's title
                if (detail.title) {
                    if (detail.title === "Home") {
                        this.set('title', 'dlxSuite');
                    } else {
                        this.set('title', detail.title || 'dlxSuite - 404');
                    }
                    this._announce(detail.title);
                }
            }
        }, {
            key: '_onAddCartItem',
            value: function _onAddCartItem(event) {
                if (!this._cartModal) {
                    this._cartModal = document.createElement('page-cart-modal');
                    Polymer.dom(this.root).appendChild(this._cartModal);
                }
                this.$.cart.addItem(event.detail);
                this._cartModal.open();
                this._announce('Item added to the cart');
            }
        }, {
            key: '_onSetCartItem',
            value: function _onSetCartItem(event) {
                var detail = event.detail;
                this.$.cart.setItem(detail);
                if (detail.quantity === 0) {
                    this._announce('Item deleted');
                } else {
                    this._announce('Quantity changed to ' + detail.quantity);
                }
            }
        }, {
            key: '_onClearCart',
            value: function _onClearCart() {
                this.$.cart.clearCart();
                this._announce('Cart cleared');
            }

            // Elements in the app can notify a change to be a11y announced.

        }, {
            key: '_onAnnounce',
            value: function _onAnnounce(e) {
                this._announce(e.detail);
            }

            // A11y announce the given message.

        }, {
            key: '_announce',
            value: function _announce(message) {
                this._a11yLabel = '';
                this.debounce('_a11yAnnouncer', function () {
                    this._a11yLabel = message;
                }, 100);
            }

            // This is for performance logging only.

        }, {
            key: '_domChange',
            value: function _domChange(e) {
                if (window.performance && performance.mark && !this.__loggedDomChange) {
                    var target = Polymer.dom(e).rootTarget;
                    if (target.domHost.is.match(this.page)) {
                        this.__loggedDomChange = true;
                        performance.mark(target.domHost.is + '.domChange');
                    }
                }
            }
        }, {
            key: '_computeShouldShowTabs',
            value: function _computeShouldShowTabs(page, smallScreen) {
                // console.log((page === 'home' || page === 'list' || page === 'detail') && !smallScreen);
                return (page === 'home' || page === 'list' || page === 'detail') && !smallScreen;
            }
        }, {
            key: '_computeShouldRenderTabs',
            value: function _computeShouldRenderTabs(_shouldShowTabs, loadComplete) {

                return _shouldShowTabs && loadComplete;
            }
        }, {
            key: '_computeShouldRenderDrawer',
            value: function _computeShouldRenderDrawer(smallScreen, loadComplete) {
                return smallScreen && loadComplete;
            }
        }, {
            key: '_shouldRenderSidebar',
            value: function _shouldRenderSidebar(smallScreen, loadComplete) {
                console.log(!smallScreen && loadComplete);
                return !smallScreen && loadComplete;
            }
        }, {
            key: '_computePluralizedQuantity',
            value: function _computePluralizedQuantity(quantity) {
                return quantity + ' ' + (quantity === 1 ? 'item' : 'items');
            }
        }, {
            key: '_computeSelectedRoute',
            value: function _computeSelectedRoute(subroute) {
                // console.log(subroute.prefix, subroute.path);
                return subroute.prefix + subroute.path;
            }
        }]);

        return webShell;
    }();

    // Register the element using Polymer's constructor.


    Polymer(webShell);
})();
//# sourceMappingURL=web-shell.js.map