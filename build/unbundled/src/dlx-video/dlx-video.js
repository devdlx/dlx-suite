(function() {
    'use strict';

    // #CleanTitle


    let YEAR_REGEX = /(19|20)\d{2}/g;
    let CD_NUMBER_REGEX = /cd(\s?)[1-9]/gi;
    let SEASON_REGEX = /s(\d{1,2})/i;
    let EPISODE_REGEX = /e(\d{1,2})/i;

    let cleanupTitle = (title) => {
        // Cleanup Movie Title
        var cleanTitle = title;
        cleanTitle = stripIllegalCharacters(cleanTitle, ' ');
        cleanTitle = cleanTitle.replace(/\bx264|\baac|\bbluray|\bdvd|\bhdtv|\b720p|\b1080p|\b1080i|\b480p|\bWEB-DL|\bmp4|\bmp3|\bogg|\bWEB|DL|UNCENSORED|m3u8|mkv/gi, '');
        cleanTitle = removeYearFromTitle(cleanTitle);
        cleanTitle = removeReleaseGroupNamesFromTitle(cleanTitle);
        cleanTitle = removeMovieTypeFromTitle(cleanTitle);
        cleanTitle = removeAudioTypesFromTitle(cleanTitle);
        cleanTitle = removeCountryNamesFromTitle(cleanTitle);
        cleanTitle = removeCdNumberFromTitle(cleanTitle).trim();
        // Extract CD-Number from Title
        var hasCdinTitle = title.match(CD_NUMBER_REGEX);
        var cd_number = hasCdinTitle ? hasCdinTitle.toString() : '';
        // Extract Year from Title
        var year = title.match(YEAR_REGEX);
        year = year ? year.toString() : '';
        // Extract Season from Title
        let season = cleanTitle.match(SEASON_REGEX);
        cleanTitle = cleanTitle.replace(SEASON_REGEX, '');
        // Extract Season from Title
        let episode = cleanTitle.match(EPISODE_REGEX);
        cleanTitle = cleanTitle.replace(EPISODE_REGEX, '');
        let media = {};
        media.title = cleanTitle;
        media.year = year;
        media.season = season | '';
        media.episode = episode | '';
        media.type = season ? 'tv' : 'movie'
        return media;
    }
    let stripIllegalCharacters = (movieTitle, replacementString) => {
        return movieTitle.replace(/\.|_|\/|\+|\-/g, replacementString);
    }
    let removeYearFromTitle = (movieTitle) => {
        return movieTitle.replace(YEAR_REGEX, "").replace(/\(|\)/g, '');
    }
    let removeReleaseGroupNamesFromTitle = (movieTitle) => {
        return movieTitle.replace(/FxM|aAF|arc|AAC|MLR|AFO|TBFA|WB|JYK|ARAXIAL|UNiVERSAL|ETRG|ToZoon|PFa|SiRiUS|Rets|BestDivX|DIMENSION|CTU|ORENJI|LOL|juggs|NeDiVx|ESPiSE|MiLLENiUM|iMMORTALS|QiM|QuidaM|COCAiN|DOMiNO|JBW|LRC|WPi|NTi|SiNK|HLS|HNR|iKA|LPD|DMT|DvF|IMBT|LMG|DiAMOND|DoNE|D0PE|NEPTUNE|TC|SAPHiRE|PUKKA|FiCO|PAL|aXXo|VoMiT|ViTE|ALLiANCE|mVs|XanaX|FLAiTE|PREVAiL|CAMERA|VH-PROD|BrG|replica|FZERO|YIFY|MarGe|T4P3|MIRCrew|BOKUTOX|NAHOM|BLUWORLD|C0P|TRL|Ozlem|ShAaNiG|800MB|CRiMSON/ig, "");
    }
    let removeMovieTypeFromTitle = (movieTitle) => {
        return movieTitle.replace(/dvdrip|multi9|xxx|x264|x265|AC3|web|hdtv|vhs|HC|embeded|embedded|ac3|dd5 1|m sub|x264|dvd5|dvd9|multi sub|non|h264|x264| sub|subs|ntsc|ingebakken|torrent|torrentz|bluray|brrip|sample|xvid|cam|camrip|wp|workprint|telecine|ppv|ppvrip|scr|screener|dvdscr|bdscr|ddc|R5|telesync|pdvd|1080p|BDRIP|hq|sd|720p|hdrip/gi, "");
    }
    let removeAudioTypesFromTitle = (movieTitle) => {
        return movieTitle.replace(/320kbps|192kbps|128kbps|mp3|320|192|128/gi, "");
    }
    let removeCountryNamesFromTitle = (movieTitle) => {
        return movieTitle.replace(/\b(NL|SWE|SWESUB|ENG|JAP|BRAZIL|TURKIC|slavic|SLK|ITA|HEBREW|HEB|ESP|RUS|DE|german|french|FR|ESPA|dansk|HUN|iTALiAN|JPN|[Ii]ta|[Ee]ng)\b/g, "");
    }
    let removeCdNumberFromTitle = (movieTitle) => {
        return movieTitle.replace(CD_NUMBER_REGEX, "");
    }


    // #CORS

    let responseListener = (details) => {
        var flag = false,
            rule = {
                "name": "Access-Control-Allow-Origin",
                "value": "*"
            };

        for (var i = 0; i < details.responseHeaders.length; ++i) {
            if (details.responseHeaders[i].name.toLowerCase() === rule.name.toLowerCase()) {
                flag = true;
                details.responseHeaders[i].value = rule.value;
                break;
            }
        }
        if (!flag) details.responseHeaders.push(rule);

        if (accessControlRequestHeaders) {

            details.responseHeaders.push({
                "name": "Access-Control-Allow-Headers",
                "value": accessControlRequestHeaders
            });

        }

        if (exposedHeaders) {
            details.responseHeaders.push({
                "name": "Access-Control-Expose-Headers",
                "value": exposedHeaders
            });
        }

        details.responseHeaders.push({
            "name": "Access-Control-Allow-Methods",
            "value": "GET, PUT, POST, DELETE, HEAD, OPTIONS"
        });

        return {
            responseHeaders: details.responseHeaders
        };

    }


    let requestListener = (details) => {
        var flag = false,
            rule = {
                name: "Origin",
                value: "http://evil.com/"
            };
        var i;

        for (i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name.toLowerCase() === rule.name.toLowerCase()) {
                flag = true;
                details.requestHeaders[i].value = rule.value;
                break;
            }
        }
        if (!flag) details.requestHeaders.push(rule);

        for (i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name.toLowerCase() === "access-control-request-headers") {
                accessControlRequestHeaders = details.requestHeaders[i].value
            }
        }

        return {
            requestHeaders: details.requestHeaders
        };
    }




    // #scripts

    // let scripts = [
    //     '//cdn.jsdelivr.net/webtorrent/latest/webtorrent.min.js',
    //     '//www.gstatic.com/cast/sdk/libs/mediaplayer/1.0.0/media_player.js',
    //     '//cdn.jsdelivr.net/hls.js/latest/hls.min.js'
    // ];
    // for (var i = 0; i < scripts.length; i++) {
    //     var _s = document.createElement('script');
    //     _s.src = scripts[i];
    //     document.body.appendChild(_s);
    // }



    // #dlxvideo
    let MyBehavior = {};
    let client = null;


    class dlxVideo {

        // Define behaviors with a getter.
        // get behaviors() {
        //     return [MyBehavior];
        // }

        // Element setup goes in beforeRegister instead of createdCallback.
        beforeRegister() {
            this.is = 'dlx-video';
            // Define the properties object in beforeRegister.
            this.properties = {
                loading: {
                    type: Boolean,
                    value: true
                },

                durationTick: {
                    type: String,
                    notify: true,
                    value: '00:00'
                },
                currentTick: {
                    type: String,
                    notify: true,
                    value: '00:00'
                },
                duration: {
                    type: Number,
                    notify: true,
                    value: 0
                },
                currentTime: {
                    type: Number,
                    notify: true,
                    value: 0
                },



                item: {
                    type: Object,
                    notify: true,
                    value: {}
                },


                controls: {
                    type: Boolean,
                    value: true
                },





                autoplay: {
                    type: Boolean,
                    value: false
                },
                loop: {
                    type: Boolean,
                    value: false
                },
                preload: {
                    type: Boolean,
                    value: false
                },
                muted: {
                    type: Boolean,
                    value: false
                },
                playPauseIcon: {
                    value: 'av:play-arrow'
                },
                videoVolume: {
                    value: 100
                },
                volumeIcon: {
                    type: String,
                    value: 'av:volume-up'
                },
                videoTimeline: {
                    type: Number
                },


                link: {
                    type: String,
                    notify: true,
                    //value: 'magnet:?xt=urn:btih:5fb2eb4a22389fcf87346dff1d88c8fe813b26ad&dn=South.Park.S18E09.REHASH.UNCENSORED.720p.WEB-DL.x264.AAC.mp4&tr=udp%3A%2F%2Fexodus.desync.com%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io'
                    //value: 'magnet:?xt=urn:btih:202effd79e2ec2b40b872c1b401d9dd47cbef5f0&dn=007+James+Bond+Quantum+of+Solace+2008+720p+BluRay+x264+AAC+-+Ozlem.mp4&tr=udp%3A%2F%2Fexodus.desync.com%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io'
                    //value: 'https://www.youtube.com/watch?v=pwKKDgiLVkw'
                    //value: 'https://youtu.be/1IkTFHCUYLA?t=120'
                },

                entered: {
                    type: Boolean,
                    value: false,
                    observer: '_enteredChange'
                }

            };

            this.listeners = {
                'canplay': '_canplay',
                'timeupdate': '_timeupdate'
            };

            this.observers = [
                '_link(link)',
                '_youtubeTimeupdate(currentTime, youtubeId)'
            ];
        }

        // #ready
        ready() {
            // console.log('player ready');

        }

        attached() {}
        detached() {}
        attributeChanged() {}

        /* Public Methods */
        /**
         * Cleans up the specified title
         * @param title            The title to clean
         * @returns {{title: string, year: string, cd: string}}
         */
        _canplay(event) {
            //console.log(event);
            let video = this.$.videoPlayer;
            this.set('currentTick', this.readableDuration(video.currentTime));
            this.set('durationTick', this.readableDuration(video.duration));
        }
        _youtubeTimeupdate(currentTime) {
            //this.set('currentTime', this.$.yt.currentTime);
            this.set('duration', this.$.yt.duration);
            this.set('videoTimeline', (currentTime / this.duration) * 100);
            //console.log(this.videoTimeline);
        }
        _timeupdate(event) {
            //console.log(event.timeStamp );
            let video = this.$.videoPlayer;
            if (video.paused || video.ended)
                this.set('playPauseIcon', 'av:play-arrow');
            else
                this.set('playPauseIcon', 'av:pause');

            this.set('currentTick', this.readableDuration(video.currentTime));
            this.set('durationTick', this.readableDuration(video.duration));
            // Setting the video parameters to the component
            this.set('duration', video.duration);
            this.set('currentTime', video.currentTime);
            //console.log((video.currentTime / video.duration)*100);
            this.set('videoTimeline', (video.currentTime / video.duration) * 100);
        }
        setTimelineFrame(event) {
            //console.log('setTimelineFrame');
            if (this.youtubeId) {
                console.log(event.target.value);
                this.$.yt.seekTo(event.target.value);
            } else {
                let video = this.$.videoPlayer;
                //console.log(video);
                video.currentTime = Math.floor(video.duration * event.target.getAttribute('value') / 100);
            }
        }
        _changeVolume(event) {
            if (this.youtubeId && typeof event === 'number') {
                this.set('videoVolume', event);
            } else {}
            //         if (this.videoVolume / 100) {
            //             this.set('volumeIcon', 'av:volume-up');
            //         } else {
            //             this.set('volumeIcon', 'av:volume-off');
            //         }
        }
        readableDuration(value) {
            // sec = Math.floor(seconds);
            // min = Math.floor(sec / 60);
            // min = min >= 10 ? min : '0' + min;
            // sec = Math.floor(sec % 60);
            // sec = sec >= 10 ? sec : '0' + sec;
            // hh =  Math.floor(min / 60);
            // return hh ? hh + ':' + min : min + ':' + sec;

            var isNegative = false;
            if (isNaN(value)) {
                return value;
            } else if (value < 0) {
                isNegative = true;
                value = Math.abs(value);
            }
            var days = Math.floor(value / 86400);
            value %= 86400;
            var hours = Math.floor(value / 3600);
            value %= 3600;
            var minutes = Math.floor(value / 60);
            var seconds = (value % 60).toFixed(0);
            if (seconds < 10) {
                seconds = '0' + seconds;
            }

            var res = hours ? (hours + ':' + ('0' + minutes).slice(-2) + ':' + seconds) : (minutes + ':' + seconds);
            if (days) {
                res = days + '.' + res;
            }
            return (isNegative ? ('-' + res) : res);

        }
        play() {
            return this.$.videoPlayer.play();
        }
        pause() {
            return this.$.videoPlayer.pause();
        }
        togglePlayPause() {
            //         console.log(this.$.yt.state);
            if (this.youtubeId) {
                //             console.log(this.$.yt.state);
                switch (this.$.yt.state) {
                    case -1:
                        this.$.yt.play();
                        break;
                    case 0:
                        //                 console.log('ended');
                        this.$.yt.play();
                        //switch icon to replay
                        break;
                    case 1:
                        //                 console.log('playing');
                        this.$.yt.pause();
                        break;
                    case 2:
                        //                 console.log('paused');
                        this.$.yt.play();
                        break;
                    case 3:
                        //                 console.log('buffering');
                        this.set('playPauseIcon', '');
                        //disable while buffering
                        break;
                    case 5:
                        //                 console.log('video cued');
                        //video is ready
                        break;
                    default:
                        console.log('no youtube state');
                }
            } else {
                let video = this.$.videoPlayer;

                if (video.paused || video.ended) {
                    this.play();
                } else {
                    this.pause();
                }
            }
        }
        toggleMute(event) {
            if (this.youtubeId) {
                //console.log('toggleMute');
                //this.set('volumeIcon', 'av:volume-up');
                if (!this.muted) {
                    this.$.yt.mute();
                    this.set('volumeIcon', 'av:volume-off');
                } else if (this.muted) {
                    this.$.yt.unMute();
                    this.set('volumeIcon', 'av:volume-up');
                }
            }
            this.set('muted', !this.muted);
        }
        toggleFullScreen(elem) {
            elem = this.$.container;
            //elem = elem || document.documentElement;
            if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        }
        _link(link) {
            // console.log(link);
            //console.log(link.match(/((http|https)\:\/\/)?[a-zA-Z0-9\.\/\?\:@\-_=#]+\.([a-zA-Z0-9\&\.\/\?\:@\-_=#])*/));
            if (link.match(/magnet:\?xt/i)) {
                //console.log(link);
                this.reset();
                this._magnetUrl(link);
                return;
            }
            if (link.match(/^[a-f0-9]{40}$/ig)) {
                //console.log(link);
                this.reset();
                this._magnetUrl(link);
                return;
            }
            if (link.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/)) {
                this.reset();
                this._youtubeUrl(link);
                return;
            }
            // other routes are coming through ex. detail/ladies-outerwear
            //this._rawLink(link);
        }
        _rawLink(link) {
            if (!link.length)
                return;
            let media = {};
            media.title = this._cleanText(link);
            console.log(link);
            this._fetchInfo(media);
            this.set('src', link);
        }
        _youtubeState(event) {
            //console.log(event.detail.data);
            let state = event.detail.data;
            switch (state) {
                case -1:
                    //             console.log('unstarted');
                    this.set('playPauseIcon', 'av:play-arrow');
                    break;
                case 0:
                    //             console.log('ended');
                    this.set('playPauseIcon', 'av:play-arrow');
                    //switch icon to replay
                    break;
                case 1:
                    //             console.log('playing');
                    this.set('playPauseIcon', 'av:pause');
                    break;
                case 2:
                    //             console.log('paused');
                    this.set('playPauseIcon', 'av:play-arrow');
                    break;
                case 3:
                    //             console.log('buffering');
                    this.set('playPauseIcon', '');
                    //disable while buffering
                    break;
                case 5:
                    //             console.log('video cued');
                    //video is ready
                    break;
                default:
                    console.log('no youtube state');
            }
        }
        ytVidId(url) {
            let p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
            console.log(p);
            return (url.match(p)) ? RegExp.$1 : false;
        }
        _youtubeUrl(link) {
            let _youtubeId = this.ytId(link);
            let url = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails,liveStreamingDetails,snippet&key=AIzaSyAMDWKG7qyQ9msJaaKb7vmvK-rNu3X_7-Q&id=' + _youtubeId;
            var request = new XMLHttpRequest();
            request.open('GET', url);
            request.setRequestHeader('Accept', 'application/json');
            that = this;
            request.onreadystatechange = function() {
                    if (request.readyState === 4) {
                        //console.log('Status:', this.status);
                        //console.log('Headers:', this.getAllResponseHeaders());
                        //console.log('Body:', JSON.parse(this.responseText));
                        let item = JSON.parse(request.responseText);
                        if (item.error) {
                            //console.log(item);
                            //this.set('error', item.error);
                            this.set('failure', true);
                            //this.set('youtubeId', _youtubeId);
                            return;
                        }
                        //console.log(item.items[0]);
                        if (item.pageInfo.totalResults === 1) {
                            this.set('failure', false);
                            this.set('youtubeId', _youtubeId);
                            this.set('raw', false);
                            let media = item.items[0].snippet;
                            media.liveStreamingDetails = item.items[0].liveStreamingDetails || {};
                            media.contentDetails = item.items[0].contentDetails || {};
                            this.set('item', media);
                        }
                    }
                }
                .bind(this);
            request.send();
        }
        _magnetUrl(magnetURI) {
            // console.log('raw link: ', magnetURI);

            // console.log('conposed link', 'magnet:?xt=urn:btih:' + magnetURI + this.trackers());
            // if (!window.WebTorrent) {
            //     let scripts = [
            //         '//cdn.jsdelivr.net/webtorrent/latest/webtorrent.min.js'
            //     ];
            //     for (var i = 0; i < scripts.length; i++) {
            //         var _s = document.createElement('script');
            //         _s.src = scripts[i];
            //         _s.onload = (e) => {
            //             // console.log('webtorrent');
            //             this._magnetUrl(magnetURI);
            //         };
            //         document.body.appendChild(_s);
            //     }
            //     return;
            // }

            // if (!client) {
            //     client = new WebTorrent();
            // } else {
            //     client.destroy((err) => {
            //         console.error('ERROR: ' + err);
            //     });
            //
            // }

            client = new WebTorrent();


            client.on('error', function(err) {
                console.error('ERROR: ' + err.message);
            });

            client.add('magnet:?xt=urn:btih:' + magnetURI + this.trackers(), function(torrent) {
                // Got torrent metadata!
                // console.log('Client is downloading:', torrent.infoHash);
                // console.log('files: ', torrent.files);
                var file = torrent.files[0];

                this._fetchInfo({
                    title: file.name
                });

                if (file.name.match(/\.m3u8/i)) {
                    console.log(file.name);
                    file.getBlobURL(function(err, url) {
                        if (err)
                            throw err;
                        this._loadM3U8(url);
                    }.bind(this));
                    return;
                }


                if (file.name.match(/\.m4v|\.mp4|\.ogv/i)) {
                    // console.log(file);
                    //this._loadMP4();
                    // console.log(file.name);

                    var itemStorage = localStorage.getItem(torrent.infoHash);
                    if (itemStorage) {
                        this.set("src", itemStorage);
                    } else {
                        // Create XHR and FileReader objects
                        var xhr = new XMLHttpRequest(),
                            fileReader = new FileReader();

                        // file.getBlob((err, blob) => {
                        //     console.log(blob);
                        // });


                        // xhr.open("GET", "rhino.png", true);
                        // // Set the responseType to blob
                        // xhr.responseType = "blob";
                        //
                        // xhr.addEventListener("load", function() {
                        //     if (xhr.status === 200) {
                        //         // onload needed since Google Chrome doesn't support addEventListener for FileReader
                        //         fileReader.onload = function(evt) {
                        //             // Read out file contents as a Data URL
                        //             var result = evt.target.result;
                        //             // Set image src to Data URL
                        //             rhino.setAttribute("src", result);
                        //             // Store Data URL in localStorage
                        //             try {
                        //                 localStorage.setItem("rhino", result);
                        //             } catch (e) {
                        //                 console.log("Storage failed: " + e);
                        //             }
                        //         };
                        //         // Load blob as Data URL
                        //
                        //     }
                        // }, false);
                        // // Send XHR
                        // xhr.send();
                    }



                    file.getBlobURL(function(err, url) {
                        if (err)
                            throw err;
                        console.log(url);
                        //this.set('src', url);
                        //this._fetchInfo({
                        //    'title': file.name,
                        //    'mediaUrl': url,
                        //    'size': this._bytesText(file.length)
                        //});
                    }.bind(this));

                    file.renderTo(this.$.videoPlayer);
                }


                if (file.name.match(/\.mp3|\.ogg|\.aac/i)) {
                    // console.log(file.name);
                    //this._loadMP4();
                    // console.log(file.name);



                    var itemStorage = localStorage.getItem(torrent.infoHash);
                    if (itemStorage) {
                        this.set("src", itemStorage);
                    } else {
                        // Create XHR and FileReader objects
                        let fileReader = new FileReader();
                        file.getBlob((err, blob) => {
                            console.log(blob);
                            //localStorage.setItem(torrent.infoHash, blob);
                        });
                    }

                    file.getBlobURL(function(err, url) {
                        if (err)
                            throw err;
                        // console.log(url);
                        this.set('src', url);
                        //this._fetchInfo({
                        //    'title': file.name,
                        //    'mediaUrl': url,
                        //    'size': this._bytesText(file.length)
                        //});
                    }.bind(this));

                    //file.renderTo(this.$.audioPlayer);
                }


                torrent.on('download', function(bytes) {
                    //console.log('progress: ' + torrent.progress);
                    this.set('progress', torrent.progress * 100);
                }.bind(this));

                torrent.on('done', function(e) {}.bind(this));

                torrent.on('wire', function(wire, addr) {
                    console.log('connected to peer with address ' + addr);
                });

            }.bind(this));
        }




        _loadM3U8(url) {
            //url = encodeURI(url);
            console.log(url);
            // url = 'http://video-edge-83437c.ord02.hls.ttvnw.net/hls-8269f0/kinggothalion_22086966128_477208286/high/index-live.m3u8?token=id=4717244374468376402,bid=22086966128,exp=1467307314,node=video-edge-83437c-1.ord02.hls.justin.tv,nname=video-edge-83437c.ord02,fmt=high&sig=3d2e7ed0c3d490db92607d83041e51daff7a9a3f'


            // ++ Fetch m3u8 with ajax
            // ++
            // var request = new XMLHttpRequest();
            // request.open('GET', url);
            //request.setRequestHeader('Accept', 'application/json');
            //request.setRequestHeader('trakt-api-key', '2a3022a90d1e592cabe6590cb30c0cc53003ac35de76dd740365e717a134968b');
            //request.setRequestHeader('trakt-api-version', 2);
            // let that = this;
            // request.onreadystatechange = function() {
            //     if (this.readyState === 4) {
            //         //console.log('Status:', this.status);
            //         //console.log('Headers:', this.getAllResponseHeaders());
            //         //console.log('Body:', JSON.parse(this.responseText));
            //         let item = this.responseText;
            //         if (!item.length) {
            //             that.set('item', _media);
            //             that.set('loading', false);
            //             return;
            //         }
            //
            //         //console.log(item);
            //         that.set('loading', false);
            //     }
            // }
            // request.send();



            // ++ Google Cast Media Player Library
            // ++
            // var mediaElement = this.$.videoPlayer;
            // var host = new cast.player.api.Host({
            //     'mediaElement': mediaElement,
            //     'url': url
            // });
            // host.updateSegmentRequestInfo = function(requestInfo) {
            //     // example of setting CORS withCredentials
            //     requestInfo.withCredentials = true;
            //     // example of setting headers
            //     requestInfo.headers = {};
            //     requestInfo.headers['content-type'] = 'text/xml;charset=utf-8';
            // };
            //
            // host.onError = function(errorCode) {
            //     console.log("Fatal Error - " + errorCode);
            //     if (window.player) {
            //         window.player.unload();
            //         window.player = null;
            //     }
            // };
            //
            //
            // // Create a Player
            // window.player = new cast.player.api.Player(host);
            //
            // let protocol = cast.player.api.CreateHlsStreamingProtocol(host);
            //
            // let ext = url.substring(url.lastIndexOf('.'), url.length);
            // let initStart = 0;
            // let autoplay = true;
            //
            // mediaElement.autoplay = autoplay;
            //
            // window.player.load(protocol, initStart);


            //window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
            //castReceiverManager.start();


            if (Hls.isSupported()) {

                /*Add Request Listeners*/
                // if (XMLHttpRequest) {
                //     (function(send) {
                //         XMLHttpRequest.prototype.send = function(data) {
                //             //this.withCredentials = true;
                //             console.log(this);
                //             this.setRequestHeader('Access-Control-Allow-Origin', '*');
                //             this.setRequestHeader('Access-Control-Expose-Headers', '');
                //             this.setRequestHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, HEAD, OPTIONS')
                //             this.setRequestHeader('Access-Control-Max-Age', '3600')
                //             send.call(this, data);
                //         };
                //     })(XMLHttpRequest.prototype.send);
                // }


                var video = this.$.videoPlayer;
                var hls = new Hls({
                    debug: true,
                    enableWorker: true
                });
                hls.loadSource(url);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, function() {
                    video.play();
                });
            }



        }



        _fetchInfo(media) {
            //let apikey = "33dce8e62b60a6fc148ed731ff825268";
            //let type = media.type || 'movie';
            //media.title = 'South.Park.season18.episode09.REHASH.UNCENSORED.720p.WEB-DL.x264.mp4';
            //media.title = this._cleanText(media.title);

            // console.log('dirty title: ', media.title);
            // console.log('cleaned title: ', cleanupTitle(media.title));
            let _media = cleanupTitle(media.title);
            //console.log(_media);
            //let url = 'https://api.themoviedb.org/3/search/' + type + '?api_key=' + apikey + '&query=' + 'south park';
            let url = 'https://api-v2launch.trakt.tv/search?query=' + _media.title;

            url = encodeURI(url);
            // console.log(url);
            var request = new XMLHttpRequest();
            request.open('GET', url);
            request.setRequestHeader('Accept', 'application/json');
            request.setRequestHeader('trakt-api-key', '2a3022a90d1e592cabe6590cb30c0cc53003ac35de76dd740365e717a134968b');
            request.setRequestHeader('trakt-api-version', 2);
            let that = this;
            request.onreadystatechange = function() {
                if (this.readyState === 4) {
                    // console.log('Fetch Info Status:', this.status);
                    //console.log('Headers:', this.getAllResponseHeaders());
                    // console.log('Fetch Info Response:', JSON.parse(this.responseText));
                    //item = JSON.parse(this.responseText).results[0];
                    let item = JSON.parse(this.responseText);
                    if (!item.length) {
                        //media.backdrop_path = 'http://www.much.com/wp-content/uploads/2015/05/featured-south-park1.jpg';
                        // console.log('nothing returned from title search, so... yea!');
                        that.set('item', _media);
                        that.set('loading', false);
                        return;
                    }
                    //item.description = item.overview;
                    //item.poster_path = 'http://image.tmdb.org/t/p/w500' + item.poster_path;
                    //item.backdrop_path = 'http://image.tmdb.org/t/p/w500' + item.backdrop_path;
                    //console.log(item[0]);
                    //'http://api.themoviedb.org/3/movie/{imdbid}/images?api_key='
                    let info = {
                        meta: {}
                    };


                    if (item[0].movie) {
                        info.description = item[0].movie.overview;
                        info.title = item[0].movie.title;
                        //info.meta.header = item[0].movie.title;
                        info.meta.text = item[0].movie.year;
                        info.poster_path = item[0].movie.images.fanart.full;
                        info.backdrop_path = item[0].movie.images.poster.full;
                    }

                    if (item[0].episode) {
                        info.description = item[0].episode.overview;
                        info.title = item[0].episode.title;
                        info.meta.header = item[0].show.title;
                        info.meta.text = 'Season: ' + item[0].episode.season + ' Episode: ' + item[0].episode.number;
                        info.poster_path = item[0].episode.images.screenshot.full;
                        info.backdrop_path = item[0].show.images.poster.full;
                    }

                    if (item.length > 1) {
                        for (var i = 0; i < item.length; i++) {
                            if (true) {
                                //console.log(item[i].type === _media.type);
                                if (item[i].type === _media.type) {
                                    // console.log('Closes match is #', i);
                                    // console.log('Closes match info', item[i]);

                                    if (_media.type === 'movie') {
                                        info.description = item[i].movie.overview;
                                        info.title = item[i].movie.title;
                                        //info.meta.header = item[0].movie.title;
                                        info.meta.text = item[i].movie.year;
                                        info.poster_path = item[i].movie.images.fanart.full;
                                        info.backdrop_path = item[i].movie.images.poster.full;
                                    }

                                    if (_media.type === 'episode') {
                                        info.description = item[i].episode.overview;
                                        info.title = item[i].episode.title;
                                        info.meta.header = item[i].show.title;
                                        info.meta.text = 'Season: ' + item[0].episode.season + ' Episode: ' + item[0].episode.number;
                                        info.poster_path = item[i].episode.images.screenshot.full;
                                        info.backdrop_path = item[i].show.images.poster.full;
                                    }

                                    break;

                                }
                            }
                        }

                    }


                    that.set('item', info);
                    that.set('loading', false);
                }
            }
            request.send();
        }
        _cleanText(text) {
            let parts = text.split("/");
            let rawName = parts[parts.length - 1].split('?')[0];
            return rawName.replace(/[^a-zA-Z0-9]/g, ' ');
        }
        _bytesText(bytes) {
            if (bytes < 1024)
                return bytes + " Bytes";
            else if (bytes < 1048576)
                return (bytes / 1024).toFixed(2) + " KB";
            else if (bytes < 1073741824)
                return (bytes / 1048576).toFixed(2) + " MB";
            else
                return (bytes / 1073741824).toFixed(2) + " GB";
        }


        trackers() {
            let trackers = [
                'tr=wss%3A%2F%2Ftracker.webtorrent.io',
                'tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce',
                'tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce',
                'tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce',
                'tr=wss%3A%2F%2Ftracker.btorrent.xyz',
                //'tr=wss%3A%2F%2Ftracker.fastcast.nz',
                'tr=wss%3A%2F%2Ftracker.openwebtorrent.com'
            ]

            return '&' + trackers.join('&');
        }


        onMouseEntered(e) {
            this.entered = true;
        }

        onMouseLeave(e) {
            this.entered = false;
        }


        _enteredChange() {
            //console.log(this.entered);
            if (!this.entered) {
                //this.async(this.hideControls, null, 1000);
            } else {



            }



        }

        OnVideoPlay() {
            // let videoPlayer = this.$.videoPlayer;
            // let canvas = this.$.videoPlayerCanvas;
            // let cw = Math.floor(canvas.clientWidth / 100);
            // let ch = Math.floor(canvas.clientHeight / 100);
            // let context = canvas.getContext('2d');
            // // videoPlayer.hidden = true;
            // this.canvasDraw(videoPlayer, context, cw, ch);
        }

        canvasDraw(videoPlayer, context, w, h) {
            if (videoPlayer.paused || videoPlayer.ended) return false;
            context.drawImage(videoPlayer, 0, 0, w, h);
            requestAnimationFrame(this.canvasDraw(context, w, h));
        }


        reset(){
          this.set('item', {});
          this.set('currentTick', this.readableDuration(0));
          this.set('durationTick', this.readableDuration(0));
          this.set('duration', 0);
          this.set('videoTimeline', 0);
          this.set('src', '');
          this.set('loading', true);
        }

    }

    // Register the element using Polymer's constructor.
    Polymer(dlxVideo);
})();
