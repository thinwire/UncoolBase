/// <reference path="../base.ts" />

declare var WaudSound : any;

namespace base {

    class QueueItem {
        public resource: HTMLImageElement | any;
        public type: string;
        public id: string;
        public url: string;
    }

    /**
     * Simple asset loader for images and sounds.
     */
    export class Loader {

        public onComplete: () => void = () => {};
        public onProgress: (message: string) => void = () => {};
        public onError: (message: string) => void = () => {};

        private _failed: boolean = false;

        private _images = {};
        private _sounds = {};
        private _musics = {};
        private _fonts  = {};
        private _queue: QueueItem[] = [];
        private _queueSizeTotal: number = 0; // Size of all queued items
        private _loadedItems: number = 0; // Number of loaded items

        public hasFailed(): boolean {
            return this._failed;
        }

        public getImage(id: string): base.Image {
            var img = this._images[id];
            if(!img) {
                window.alert("Error: Loader does not contain image named \"" + id + "\"");
                return null;
            }
            return img;
        }

        public getSound(id: string): base.Sound {
            var snd = this._sounds[id];
            if(!snd) {
                window.alert("Error: Loader does not contain sound named \"" + id + "\"");
                return null;
            }
            return new Sound(snd.url);
        }

        public getMusic(id: string): base.Music {
            var mus = this._musics[id];
            if(!mus) {
                window.alert("Error: Loader does not contain music named \"" + id + "\"");
                return null;
            }
            return mus;
        }

        public getFont(id: string): base.Font {
            var fnt = this._fonts[id];
            if(!fnt) {
                window.alert("Error: Loader does not contain font named \"" + id + "\"");
                return null;
            }
            return fnt;
        }

        private queueImage(id: string, url: string) {
            var item = new QueueItem();
            var img = document.createElement('img');
            img.onload = () => {
                this.itemComplete(item);
            };
            img.onerror = () => {
                this.itemFailed(item);
            };
            item.resource = img;
            item.type = 'image';
            item.id = id;
            item.url = url;
            this.queueItem(item);

            // Start loading of image
            img.src = url;
        }

        private queueSound(id: string, url: string) {
            var item = new QueueItem();
            var snd = new WaudSound(url, {
                onload: (instance) => {
                    this.itemComplete(item);
                },
                onerror: (instance) => {
                    this.itemFailed(item);
                },
                preload: false,
                volume: 1.0,
                loop: false,
                autoplay: false
            });
            item.resource = snd;
            item.type = 'sound';
            item.id = id;
            item.url = url;
            this.queueItem(item);

            // Start loading of sound
            snd.load();
        }

        private queueMusic(id: string, url: string) {
            var item = new QueueItem();
            var mus = new WaudSound(url, {
                onload: (instance) => {
                    this.itemComplete(item);
                },
                onerror: (instance) => {
                    this.itemFailed(item);
                },
                preload: false,
                volume: 1.0,
                loop: true,
                autoplay: false
            });
            item.resource = mus;
            item.type = 'music';
            item.id = id;
            item.url = url;
            this.queueItem(item);

            // Start loading of music
            mus.load();
        }

        private queueFont(id: string, dataurl: string, imageurl: string) {
            var item = new QueueItem();
            var res = {
                data: null,
                image: document.createElement('img'),
                imageloaded: false
            };
            item.resource = res;
            item.type = 'font';
            item.url = dataurl;
            item.id = id;
            this.queueItem(item);

            var imageComplete = () => {
                res.imageloaded = true;
                if(res.data != null) {
                    this.itemComplete(item);
                }
            };

            var dataComplete = (xml: Document) => {
                res.data = xml;
                if(res.imageloaded) {
                    this.itemComplete(item);
                }
            };

            // Start load
            res.image.onload = imageComplete;
            res.image.src = imageurl;

            var req = new XMLHttpRequest();
            req.onerror = () => this.itemFailed(item);
            req.onload = (e) => {
                dataComplete(req.responseXML);
            };
            req.open('GET',dataurl,true);
            req.send();
        }

        private queueItem(item: QueueItem): void {
            this._queue.push(item);
            this._queueSizeTotal++;
        }

        private dequeueItem(item: QueueItem): void {
            var idx = this._queue.indexOf(item);
            if(idx >= 0) {
                this._queue.splice(idx,1);
            } else {
                console.error("Did not find item " + item + " in queue!");
            }
            this._loadedItems++;
        }

        private itemComplete(item: QueueItem): void {
            this.dequeueItem(item);
            var msg = "[" + this._loadedItems + "/" + this._queueSizeTotal + "] ";

            switch(item.type) {
                case 'image':
                    this._images[item.id] = new base.Image(item.resource);
                    item.resource.onload = undefined;
                    item.resource.onerror = undefined;
                    msg += "Image " + item.url + " loaded with id \"" + item.id + "\"";
                    break;
                case 'sound':
                    this._sounds[item.id] = { snd: item.resource, url: item.url };
                    msg += "Sound " + item.url + " loaded with id \"" + item.id + "\"";
                    break;
                case 'music':
                    this._musics[item.id] = new base.Music(item.resource);
                    msg += "Music " + item.url + " loaded with id \"" + item.id + "\"";
                    break;
                case 'font':
                    var f = this._fonts[item.id] = new base.Font(new Image(item.resource.image));
                    f.initFromXML(<XMLDocument>(item.resource.data)); 
                    msg += "Font " + item.url + " loaded with id \"" + item.id + "\"";
                    break;
                default:
                    msg += "ERROR: failed to determine type of item " + item;
                    break;
            }

            this.onProgress(msg);

            if(this._queue.length == 0) {
                this.loadComplete();
            }
        }

        private itemFailed(item: QueueItem): void {
            this._failed = true;
            this.dequeueItem(item);
            var msg = "[" + this._loadedItems + "/" + this._queueSizeTotal + "] ";

            switch(item.type) {
                case 'image':
                    item.resource.onload = undefined;
                    item.resource.onerror = undefined;
                    msg += "Image " + item.url + " load FAILED";
                    break;
                case 'sound':
                    msg += "Sound " + item.url + " load FAILED";
                    break;
                case 'music':
                    msg += "Music " + item.url + " load FAILED";
                    break;
                case 'font':
                    msg += "Font " + item.url + " load FAILED";
                    break;
                default:
                    msg += "ERROR: failed to determine type of item " + item;
                    break;
            }

            this.onError(msg);
        }

        private loadComplete(): void {
            console.log("Load complete");
            this.onComplete();
        }

        public load(assets: AssetList): void {

            if(assets.size() === 0) {
                console.log("Load complete");
                this.onComplete();
                return;
            }

            this._failed = false;
            var images = assets.getImages();
            var sounds = assets.getSounds();
            var musics = assets.getMusics();
            var fonts = assets.getFonts();

            for(var i = 0, l = images.length; i < l; ++i) {
                var item = images[i];
                this.queueImage(item.id,item.url);
            }

            for(var i = 0, l = sounds.length; i < l; ++i) {
                var item = sounds[i];
                this.queueSound(item.id,item.url);
            }

            for(var i = 0, l = musics.length; i < l; ++i) {
                var item = musics[i];
                this.queueMusic(item.id,item.url);
            }

            for(var i = 0, l = fonts.length; i < l; ++i) {
                var f = fonts[i];
                this.queueFont(f.id,f.dataurl,f.imageurl);
            }

            // Loading should start automagically

        }

    }

}
