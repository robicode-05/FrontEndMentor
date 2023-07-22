export class Comment {
    /**
     * @param {number} id
     * @param {string} content
     * @param {string} createdAt
     * @param {number} score
     * @param {User} user
     * @param {Comment[]} replies
     */

    constructor(commentJson) {
        this.id = commentJson.id;
        this.content = commentJson.content;
        this.createdAt = commentJson.createdAt;
        this.score = commentJson.score;
        this.user = commentJson.user;
        this.replies = commentJson.replies;
    }
}