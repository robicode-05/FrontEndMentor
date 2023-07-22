export class User {
    /**
     * @param {string} username
     * @param {UserImage} image
     */

    constructor(userJson) {
        this.username = userJson.username;
        this.image = new UserImage(userJson.image);
    }
}

export class UserImage {
     /**
     * @param {string} png
     * @param {string} webp
     */

     constructor(imageJson) {
        this.png = imageJson.png;
        this.webp = imageJson.webp;
    }
}