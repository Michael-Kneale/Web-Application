/*
 *
 * Module: Model
 * This module implements the Model class, described below. In the
 * Model class are a number of functions that handle the array of
 * posts which is obtained from the database, allowing different
 * portions of the array to be displayed, and in different orders.
 *
 * Student Name: Michael Kneale
 * Student Number: 46502289
 *
 */

/* 
 * Model class to support the FlowTow application
 * this object provides an interface to the web API and a local
 * store of data that the application can refer to.
 * The API generates different events:
 *   "modelUpdated" event when new data has been retrieved from the API
 *   "postAdded" event when a request to add a new post returns
 *   "likeAdded" event when a request to add a new like returns
 *   "commentAdded" event when a request to add a new comment returns 
*/

export {Model};

import {splitHash} from './util.js';

const Model = {
    postsUrl: '/posts',
    uploadUrl: '/upload',  
    commentsUrl: '/comments',
    peopleUrl: '/people',

    //this will hold the post data stored in the model
    data: {
        posts: [],
        comments: []
    },

    // updatePosts - retrieve the latest list of posts from the server API
    // when the request is resolved, creates a "modelUpdated" event 
    updatePosts: function() {
        fetch(this.postsUrl)
        .then(
            function(response) {
                return response.json();
            }
        )
        .then((data) => {
            this.data.posts = data;
            let event = new CustomEvent("modelUpdated");
            window.dispatchEvent(event);
        })
    },

    // updateComments - retrieve the latest list of comments from the server API
    updateComments: function() {
        fetch(this.commentsUrl)
        .then(
            function(response) {
                return response.json();
            }
        )
        .then((data) => {
            this.data.comments = data;
        })
    },

    // getPosts - return an array of post objects
    getPosts: function() {
        return this.data.posts;
    },

    // getComments - return an array of comments
    getComments: function() {
        return this.data.comments;
    },

    // getPost - return a single post given its id. It also
    // reverses the order of the comments so that the most
    // recent one comes first
    getPost: function(postid) {
        for(let i = 0; i < this.data.posts.length; i++) {
            if(this.data.posts[i].id == postid) {
                this.data.posts[i].p_comment = [].concat(this.data.posts[i].p_comment.reverse())
                return this.data.posts[i];
            }
        }
    },
    
    // setPosts - set the model's posts array to
    // be equal to the array of posts passed in
    // the function
    setPosts: function(posts) {
        this.data.posts = posts;
    },

    // addPost - add a new post by submitting a POST request to the server API
    // postData is an object containing all fields in the post object (e.g., p_caption)
    // when the request is resolved, creates an "postAdded" event
    addPost: function(postData) {
        fetch(this.postsUrl, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(postData)
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data)
        })
    },

    // deletePost - delete a post by submitting a DELETE request to the server API
    // postID is the ID of the post to be deleted
    // Any comments linked to the aforementioned post are also deleted
    deletePost: function(postID) {
        for(let i = 0; i < this.getComments().length; i++) {
            if(this.getComments()[i].c_post != null) {
                if(this.getComments()[i].c_post.id == postID) {
                    fetch(this.commentsUrl + "/" + this.getComments()[i].id, {
                        method: 'DELETE'
                    })
                    .then((response) => {
                        return response.json();
                    })
                }
            }
        }
        fetch(this.postsUrl + "/" + postID, {
            method: 'DELETE'
        })
        .then((response) => {
            return response.json()
        })
    },

    // getUserPosts - return just the posts for one user as an array
    getUserPosts: function(username) {
        let postsArray = [];
        let j = 0;
        for(let i = 0; i < this.data.posts.length; i++) {
            if(this.data.posts[i].p_author.username == username) {
                postsArray[j] = this.data.posts[i];
                j++;
            }
        }
        postsArray.sort(function(a,b){
            return new Date(b.published_at) - new Date(a.published_at);
        });
        return postsArray;
    },

    // addComment - add a comment to a post 
    //      by submitting a POST request to the server API
    //      commentData is an object containing the content of the comment, the author and the postid
    // when the request is resolved, creates an "commentAdded" event
    addComment: function (commentData) {
        fetch(this.commentsUrl, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(commentData)
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log("the comment content is ", data);
        })
    },

    //getRandomPosts - return N random posts as an array
    getRandomPosts: function(N){
        let postsArray = [];
        for(let i = 0; i < this.data.posts.length; i++) {
            postsArray[i] = this.data.posts[i];
        }
        for(let i = postsArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = postsArray[i];
            postsArray[i] = postsArray[j];
            postsArray[j] = temp;
        }
        postsArray.length = N;
        return postsArray;
    },

    // getRecentPosts - return the N most recent as an array
    //  posts, ordered by timestamp, most recent first
    getRecentPosts: function(N) {
        let postsArray = [];
        for(let i = 0; i < this.data.posts.length; i++) {
            postsArray[i] = this.data.posts[i];
        }
        postsArray.sort(function(a,b){
            return new Date(b.published_at) - new Date(a.published_at);
        });
        postsArray.length = N;
        return postsArray;
    },

    // getPopularPosts - return the N most popular as an array
    // posts, ordered by the number of likes
    getPopularPosts: function(N) {
        let postsArray = [];
        for(let i = 0; i < this.data.posts.length; i++) {
            postsArray[i] = this.data.posts[i];
        }
        postsArray.sort(function(a,b){
            return b.p_likes - a.p_likes;
        });
        postsArray.length = N;
        return postsArray;
    },

    // getAllPosts - retrieve all the posts stored in
    // the database. Sort them by their date, sort their
    // comments from most to least recent, and add these
    // comments to each relevant post by changing their
    // HTML.
    getAllPosts: function() {
        let postsArray = [];
        for(let i = 0; i < this.data.posts.length; i++) {
            postsArray[i] = this.data.posts[i];
        }
        postsArray.sort(function(a,b){
            return new Date(b.published_at) - new Date(a.published_at);
        });
        for(let i = 0; i < postsArray.length; i++) {
            postsArray[i].p_comment = [].concat(postsArray[i].p_comment.reverse())
        }
        return postsArray;
    },

    // getCurrentPost - assuming that the Single Post View
    // is currently being displayed, retrieve the post
    // currently shown
    getCurrentPost: function() {
        let posts = Model.getPosts();
        let hash2 = splitHash(window.location.hash)
        for(let i = 0; i < posts.length; i++) {
            if(hash2.id == posts[i].id) {
                return posts[i];
            }
        }
    }

}