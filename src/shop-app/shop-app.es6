(function() {

    // #shop-app
    let MyBehavior = {};

    class shopApp {

        // Define behaviors with a getter.
        // get behaviors() {
        //     return [MyBehavior];
        // }

        // Element setup goes in beforeRegister instead of createdCallback.
        beforeRegister() {
            this.is = 'shop-app';
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
                    // value: [{
                    //     'name': 'favorites',
                    //     'link': 'favorites',
                    //     'title': 'Favorites',
                    //     'page': 'list',
                    //     'icon': 'menu',
                    //     'items': [{
                    //         'name': 'video/e04c85c1fdffddbc07e2fdab717a089227c6a6b0',
                    //         'page': 'video',
                    //         'link': 'e04c85c1fdffddbc07e2fdab717a089227c6a6b0',
                    //         'title': 'Escobar',
                    //         // 'icon': 'menu'
                    //     }]
                    // }]
                    value: []
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

            this.observers = [
                '_routePageChanged(routeData.page)',
                '_appChanged(subroute)',
                '_computeMenu(app,path)'
            ];
        }

        // #ready
        ready() {

            // listen for online/offline
            Polymer.RenderStatus.afterNextRender(this, function() {
                this.listen(window, 'online', '_notifyNetworkStatus');
                this.listen(window, 'offline', '_notifyNetworkStatus');
            });

        }

        attached() {}
        detached() {}
        attributeChanged() {}

        _computeHeader(menuItem) {
            // console.log('_computeHeader', menuItem.name === 'home' ? true : false);
            // return menuItem.name === 'home' ? true : false;
        }

        created() {
            window.performance && performance.mark && performance.mark('shop-app.created');
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


        _computeMenu(app, path) {

            console.log(app, path);

            app.database().ref(path + '/sidebar/items').on('child_added', function(snap) {
                let item = snap.val();
                let key = snap.key;
                let menuItems = [];

                console.log(item);

                app.database().ref(path + '/sidebar/items/' + key + '/items').on('child_added', function(snap2) {
                    let menuItem = snap2.val();
                    let menuItemkey = snap2.key;
                    //set all to list view
                    //firebase.database().ref(path + '/sidebar/items/' + key + '/items/'+menuItemkey+'/type').set('list');
                    menuItems.push(menuItem);
                    item.items = menuItems;
                    //console.log(menuItem);
                }.bind(this));
                this.push('menu', item);
            }.bind(this));



            // each cat, each item in items, set data
            app.database().ref(path + '/categories/byId').on('child_added', function(snap) {
                let item = snap.val();
                let key = snap.key;
                item.items = null;
                console.log(item);
                // menuItems.push(item);
                this.push('menu', item);
            }.bind(this));


        }

        _routePageChanged(page) {
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

        _pageChanged(pageName, oldPage) {

            if (pageName != null) {
                // home route is eagerly loaded
                if (pageName == 'home') {
                    this._pageLoaded(Boolean(oldPage));
                    // other routes are lazy loaded
                } else {

                    let pageList = this.$.pages.items;

                    for (var i = 0; i < pageList.length; i++) {
                        // console.log(pageList[i].tagName.toLowerCase() === 'page-' + pageName);
                        if (pageList[i].tagName.toLowerCase() !== 'page-' + pageName) {
                            console.log(pageList[i].tagName.toLowerCase() === 'page-' + pageName);
                            this.importHref(
                                this.resolveUrl('page-' + pageName + '.html'),
                                function() {
                                    this._pageLoaded(Boolean(oldPage));
                                }, null, true);
                        }
                    }




                }
            }
        }

        _appChanged(app, oldApp) {
            if (app) {
                // console.log(app);
            }

        }

        _pageLoaded(shouldResetLayout) {
            this._ensureLazyLoaded();
            if (shouldResetLayout) {
                // The size of the header depends on the page (e.g. on some pages the tabs
                // do not appear), so reset the header's layout only when switching pages.
                this.async(function() {
                    this.$.header.resetLayout();
                }, 1);
            }
        }

        _ensureLazyLoaded() {
            // load lazy resources after render and set `loadComplete` when done.
            if (!this.loadComplete) {
                this.loadComplete = true;
                return;

                Polymer.RenderStatus.afterNextRender(this, function() {
                    this.importHref(this.resolveUrl('lazy-resources.html'), function() {
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

        _notifyNetworkStatus() {
            var oldOffline = this.offline;
            this.offline = !navigator.onLine;
            // Show the snackbar if the user is offline when starting a new session
            // or if the network status changed.
            if (this.offline || (!this.offline && oldOffline === true)) {
                if (!this._networkSnackbar) {
                    this._networkSnackbar = document.createElement('dlx-snackbar');
                    Polymer.dom(this.root).appendChild(this._networkSnackbar);
                }
                Polymer.dom(this._networkSnackbar).innerHTML = this.offline ?
                    'You are offline' : 'You are online';
                this._networkSnackbar.open();
            }
        }

        _toggleDrawer() {
            // console.log(this.drawerOpened ,this.drawerOpened);
            this.drawerOpened = !this.drawerOpened;
        }

        // Elements in the app can notify section changes.
        // Response by a11y announcing the section and syncronizing the category.
        _onChangeSection(event) {

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

        _onAddCartItem(event) {
            if (!this._cartModal) {
                this._cartModal = document.createElement('page-cart-modal');
                Polymer.dom(this.root).appendChild(this._cartModal);
            }
            this.$.cart.addItem(event.detail);
            this._cartModal.open();
            this._announce('Item added to the cart');
        }

        _onSetCartItem(event) {
            var detail = event.detail;
            this.$.cart.setItem(detail);
            if (detail.quantity === 0) {
                this._announce('Item deleted');
            } else {
                this._announce('Quantity changed to ' + detail.quantity);
            }
        }

        _onClearCart() {
            this.$.cart.clearCart();
            this._announce('Cart cleared');
        }

        // Elements in the app can notify a change to be a11y announced.
        _onAnnounce(e) {
            this._announce(e.detail);
        }

        // A11y announce the given message.
        _announce(message) {
            this._a11yLabel = '';
            this.debounce('_a11yAnnouncer', function() {
                this._a11yLabel = message;
            }, 100);
        }

        // This is for performance logging only.
        _domChange(e) {
            if (window.performance && performance.mark && !this.__loggedDomChange) {
                var target = Polymer.dom(e).rootTarget;
                if (target.domHost.is.match(this.page)) {
                    this.__loggedDomChange = true;
                    performance.mark(target.domHost.is + '.domChange');
                }
            }
        }

        _computeShouldShowTabs(page, smallScreen) {
            // console.log((page === 'home' || page === 'list' || page === 'detail') && !smallScreen);
            return (page === 'home' || page === 'list' || page === 'detail') && !smallScreen;
        }

        _computeShouldRenderTabs(_shouldShowTabs, loadComplete) {

            return _shouldShowTabs && loadComplete;
        }

        _computeShouldRenderDrawer(smallScreen, loadComplete) {
            return smallScreen && loadComplete;
        }

        _shouldRenderSidebar(smallScreen, loadComplete) {
            console.log(!smallScreen && loadComplete);
            return !smallScreen && loadComplete;
        }

        _computePluralizedQuantity(quantity) {
            return quantity + ' ' + (quantity === 1 ? 'item' : 'items');
        }

        _computeSelectedRoute(subroute) {
            // console.log(subroute.prefix, subroute.path);
            return subroute.prefix + subroute.path;
        }


        handleResponse(_, e){
          console.dir(e.response);

        }

    }

    // Register the element using Polymer's constructor.
    Polymer(shopApp);
})();
