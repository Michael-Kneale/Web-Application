/*
 *
 * Module: Views
 * < short description here e.g. "This module implements view functions...">
 * This module implements the view functions. These use the Handlebars templating
 * engine in order to format the many ways in which the posts are to be displayed.
 * The below templates are defined in "index.html". These templates say what data
 * should be displayed and where.
 * 
 * Student Name: Michael Kneale
 * Student Number: 46502289
 *
 */

export {showRandomPosts,
        showRecentPosts,
        showPopularPosts,
        showOnePost,
        loginView,
        showAllPosts,
        showMyPosts,
        showUserPosts};

// applyTemplate - apply a template to a given set of data
// ("data" parameter) and insert it into a given element
// from the document ("targetid" parameter). Also, format
// it according to the "templateid" parameter, which refers
// to a given Handlebars template found in "index.html".
function applyTemplate(targetid, templateid, data) {
    let target = document.getElementById(targetid);
    let template = Handlebars.compile(
        document.getElementById(templateid).textContent
    );
    target.innerHTML = template(data);
}

// showRandomPosts - create a view of a given list of posts
// and insert it in a particular place in the document (given
// by the "targetid" parameter).
function showRandomPosts(targetid, post) {
    applyTemplate(targetid, "three-posts-template", {'post': post});
}

// showRecentPosts, showPopularPosts, showAllPosts, showMyPosts, and showUserPosts
// all have the same functionality as showRandomPosts, but are used
// for different arrays of posts, and use different templates
function showRecentPosts(targetid, post) {
    applyTemplate(targetid, "ten-recent-template", {'post': post});
}

function showPopularPosts(targetid, post) {
    applyTemplate(targetid, "ten-popular-template", {'post': post});
}

function showAllPosts(targetid, post) {
    applyTemplate(targetid, "all-posts-template", {'post': post});
}

function showMyPosts(targetid, post) {
    applyTemplate(targetid, "my-posts-template", {'post': post});
}

function showUserPosts(targetid, post) {
    applyTemplate(targetid, "user-posts-template", {'post': post});
}

// showOnePost - create a view of a single post and
// insert it in a particular place in the document (given
// by the "targetid" parameter).
function showOnePost(targetid, post) {
    applyTemplate(targetid, "single-post-template", post);
}

// loginView - create a view of the user's login status and
// insert it in a particular place in the document (given
// by the "targetid" parameter).
function loginView(targetid, user) {
    applyTemplate(targetid, "login-template", {'user': user});
}