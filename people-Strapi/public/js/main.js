/*
 *
 * Module: Controller
 * This module implements main entry point into the website,
 * accepting input from the user and responding accordingly.
 * It ensures the correct information is shown on-screen at
 * any given point in time, and transfers inputs to the Model
 * and Service modules as is necessary.
 *
 * Student Name: Michael Kneale
 * Student Number: 46502289
 *
 */


import {splitHash} from './util.js';
import {Model} from './model.js';
import {Auth} from './service.js';
import * as views from './views.js';

// Handles different views being requested
// Hides/shows different views/forms as is necessary
// Triggered when posts is updated
// Uses the webpage link to know what should be shown
// In the case of getAllPosts, it also adds comments
// to their respective posts.
let loginMessageExists = false;
window.addEventListener("modelUpdated", function() {
    bindings();
    document.getElementById('postform').style.setProperty('display', 'none');
    document.getElementById('commentform').style.setProperty('display', 'none');
    views.loginView("loginform", Auth.getUser())
    let hash = splitHash(window.location.hash);
    document.getElementById("randomDiv").innerHTML = "";
    document.getElementById("recentDiv").innerHTML = "";
    document.getElementById("popularDiv").innerHTML = "";
    document.getElementById("singlePostDiv").innerHTML = "";
    document.getElementById("allDiv").innerHTML = "";
    document.getElementById("myDiv").innerHTML = "";
    document.getElementById("userDiv").innerHTML = "";
    loginMessageExists = false;
    if(hash.path === ("posts")) {
        views.showOnePost("singlePostDiv", Model.getPost(hash.id));
        if(Auth.getUser()) {
            document.getElementById('commentform').style.removeProperty('display');
        }
    }
    else if(window.location.href.indexOf("all-posts") > -1) {
        views.showAllPosts("allDiv", Model.getAllPosts());
        setTimeout(function() {
            for(let i = 0; i < Model.getAllPosts().length; i++) {
                if(Model.getAllPosts()[i].p_comment != null) {
                    for(let j = 0; j < Model.getAllPosts()[i].p_comment.length; j++) {
                        document.querySelector('[data-id="' + Model.getAllPosts()[i].id + '"]').innerHTML += "<li>" + Model.getAllPosts()[i].p_comment[j].c_content + "</li>";
                    }
                }
            }
        }, 250)
    }
    else if(window.location.href.indexOf("my-posts") > -1) {
        if(Auth.getUser()) {
            views.showMyPosts("myDiv", Model.getUserPosts(Auth.getUser().username));
            document.getElementById('postform').style.removeProperty('display');
        }
        else if(loginMessageExists === false){
            document.getElementById("myDiv").innerHTML += "<tr><td>You have to login first</td></tr>";
            loginMessageExists = true;
        }
    }
    else if(window.location.href.split("#")[1] != "" && document.URL.indexOf("#") > -1) {
        for(let i = 0; i < Model.getPosts().length; i++) {
            if(Model.getPosts()[i].p_author.username == hash.path) {
                views.showUserPosts("userDiv", Model.getUserPosts(hash.path))
                document.getElementById("userViewHeading").innerHTML += "<h2>" + hash.path + "'s Posts</h2>";
            }
        }
    }
    else {
        views.showRandomPosts("randomDiv", Model.getRandomPosts(3));
        views.showRecentPosts("recentDiv", Model.getRecentPosts(10));
        views.showPopularPosts("popularDiv", Model.getPopularPosts(10));
    }
    try {
        document.getElementById('logoutbutton').style.removeProperty('display');
    }
    catch(error) {
    }
})

// Clicking "About FlowTow" (which causes a 
// hash change) doesn't reload the page.
window.addEventListener('hashchange', function() {
    if(document.URL.indexOf("#whatis") < 0) {
        redraw();
    }
})

// When the user logs in, the loginView is refreshed,
// in order to show the user as being logged in, if they
// successfully logged in. If they were not successful,
// it adds the "login failed" message, unless this was
// already showing. If the user logs in successfully, they
// are redirected to the main page.
let alreadyFailed = false;
window.addEventListener("userLogin", function() {
    views.loginView("loginform", Auth.getUser())
    if(!Auth.getUser() && alreadyFailed === false) {
        document.getElementById("failMessage").innerHTML += "Login Failed, please try again";
        alreadyFailed = true;
    }
    if(Auth.getUser() && alreadyFailed === true) {
        document.getElementById("failMessage").innerHTML = "";
    }
    else {
        window.location.hash="";
        redraw();
    }
})

// Handles the login form after the user has
// submitted it. It passes the username and
// password entered to the login function
// found in the Service module
function loginFormHandler(event) {
    event.preventDefault()
    const username = this.elements['username'].value
    const password = this.elements['password'].value

    const authInfo = {
        'identifier': username,
        'password': password
    }

    Auth.login(authInfo.identifier, authInfo.password);
}

// Passes the image URL and
// caption entered, as well as the current user,
// to the addPost function found in the Model
// module. It also empties the HTML of the
// "myDiv" element, in which the My Posts
// array is found, and redraws the page.
function postFormHandler(event) {
    event.preventDefault();

    const p_url = this.elements['p_url'].value;
    const p_caption = this.elements['p_caption'].value;

    const postData = {
        "p_url": p_url,
        "p_caption": p_caption,
        "p_author": Auth.getUser()
    }

    Model.addPost(postData);
    document.getElementById("myDiv").innerHTML = "";
    document.getElementById("postform").reset();
    redraw();
}

// Passes the comment content, 
// as well as the current user and the post
// currently shown on-screen. It resets the
// "commentform" element so that the comment text
// is cleared out. It then redraws the page so that
// the new comment is immediately shown alongside
// the old comments.
function commentFormHandler(event) {
    event.preventDefault();

    const c_content = this.elements['c_content'].value;
    const c_author = Auth.getUser();
    const c_post = Model.getCurrentPost();

    const commentData = {
        "c_content": c_content,
        "c_author": c_author,
        "c_post": c_post
    }
    Model.addComment(commentData);
    document.getElementById("commentform").reset();
    redraw();
}

// Handles the logout button after the user
// has clicked it. It removes the key (which
// represents the user's data) from local
// storage.
function logoutButtonHandler(event) {
    event.preventDefault();

    localStorage.removeItem('key');
    redraw();
}

// Handles the delete button after the user
// has clicked it. It calls the deletePost
// function and passes postID so it is
// known which post (and associated comments)
// should be deleted.
function deleteButtonHandler(postID) {
    Model.deletePost(postID);
    setTimeout(function() {
        redraw();
    }, 300);
}

// Defines what happens when any of the forms (login,
// post, or comment) is submitted. The forms are
// retrieved from the html, and upon submission, they
// call their respective handler functions.
// The same goes for the login button when it is
// clicked.
// The delete button function waits for the buttons to load
// before assigning each a parameter to pass to the handler.
function bindings() {
    let loginForm = document.getElementById('loginform');
    loginForm.onsubmit = loginFormHandler;

    let postForm = document.getElementById('postform');
    postForm.onsubmit = postFormHandler;

    let commentForm = document.getElementById('commentform');
    commentForm.onsubmit = commentFormHandler;

    if(Auth.getUser()) {
        setTimeout(function() {
            let logoutButton = document.getElementById('logoutbutton');
            logoutButton.onclick = logoutButtonHandler; 
        }, 300);
    }

    setTimeout(function() {
        let deleteButtons = document.getElementsByClassName('deletebuttons');
        for(let i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener('click', function() {
                deleteButtonHandler(deleteButtons[i].getAttribute('data-id'));
            })
        }
    }, 300)
}

// Redraw function is called when the page is loaded
window.onload = function() {
    redraw()
}

// When the page is redrawn, update the posts and
// comments arrays
function redraw() {
    Model.updatePosts();
    Model.updateComments();
}

// Used in the index.html Handlebars templates to make
// the dates appear in the "yyyy-mm-dd" format
Handlebars.registerHelper('trimString', function(passedString) {
    let newString = passedString.split('T')[0];
    return newString;
});