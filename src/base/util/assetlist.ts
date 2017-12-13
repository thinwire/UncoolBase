/// <reference path="../base.ts" />
/// <reference path="loader.ts" />

namespace base {

    /**
     * List used by Loader
     */
    export class AssetList {
        private _images: {id: string, url: string}[] = [];
        private _sounds: {id: string, url: string}[] = [];
        private _musics: {id: string, url: string}[] = [];
        private _fonts:  {id: string, dataurl: string, imageurl: string}[] = [];

        private _imageBaseUrl: string = "";
        private _musicBaseUrl: string = "";
        private _soundBaseUrl: string = "";
        private _fontBaseUrl: string = "";

        public size(): number {
            return this._images.length + 
                this._sounds.length + 
                this._musics.length +
                this._fonts.length;
        }

        public setImageBaseURL(url: string): AssetList {
            this._imageBaseUrl = url == null ? "" : url;
            return this;
        }

        public setSoundBaseURL(url: string): AssetList  {
            this._soundBaseUrl = url == null ? "" : url;
            return this;
        }

        public setMusicBaseURL(url: string): AssetList {
            this._musicBaseUrl = url == null ? "" : url;
            return this;
        }

        public setFontBaseUrl(url: string): AssetList {
            this._fontBaseUrl = url == null ? "" : url;
            return this;
        }

        public addImage(id: string, url: string): AssetList {
            this._images.push({id: id, url: this._imageBaseUrl + url});
            return this;
        }

        public addSound(id: string, url: string): AssetList {
            this._sounds.push({id: id, url: this._soundBaseUrl + url});
            return this;
        }

        public addMusic(id: string, url: string): AssetList {
            this._musics.push({id: id, url: this._musicBaseUrl + url});
            return this;
        }

        public addFont(id: string, dataurl: string, imageurl: string): AssetList {
            dataurl = this._fontBaseUrl + dataurl;
            imageurl = this._fontBaseUrl + imageurl;
            this._fonts.push({id: id, dataurl: dataurl, imageurl: imageurl});
            return this;
        }

        public getImages() {
            return this._images;
        }

        public getSounds() {
            return this._sounds;
        }

        public getMusics() {
            return this._musics;
        }

        public getFonts() {
            return this._fonts;
        }
    }
}
