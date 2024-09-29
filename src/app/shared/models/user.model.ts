export class User{
    constructor(
        public email: string,
        public id: string,
        private _token: string,
        private _tokenExpirationDate: Date,
        public firstName: string,
        public lastName: string,
        public favoriteCuisine: string = "",
        public dietaryPreference: string = "",
        public favoriteRecipes: string[] = [],
        public firebaseId?: string
    ){}

    get token(){
        if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) return null;
        return this._token
    }


    get tokenExpirationDate(){
        return this._tokenExpirationDate
    }
}