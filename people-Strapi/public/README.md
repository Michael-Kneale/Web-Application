# COMP2110/6110 - FlowTow Web Application

Student Name: Michael Kneale
Student Number: 46502289

Functionality achieved is describes below, under the level listed in the assignment specifications.


Level 1:
Navigation: Home (#) and About (#whatis) are at the top of the website.
Welcome to FlowTow: "Welcome to FlowTow!" is shown at the top of the website under Navigation.
Three Posts: three posts are displayed under "Welcome to FlowTow", with the appropriate information included (i.e. the image, the caption, the post date, the user who posted it, and the number of likes) for each post.
Ten Most Recent Posts: the ten most recent posts are displayed under Three Posts, with the appropriate information included for each post.
Ten Most Popular Posts: the ten most popular posts are displayed under Three Posts, with the appropriate information included for each post.
Like Buttons: there are image icons next to each post in the Most Recent and Most Popular lists representing the like button.
Link to About Section: there is a link at the top of the screen that goes to the about section, which briefly describes the FlowTow website.
CSS Stylesheet: there is a CSS stylesheet, "style.css", which makes the website look presentable.

Level 2:
Three Posts: as mentioned in level 1, there are three posts with the appropriate information for each post. These are randomly selected from the database.
Ten Most Recent Posts & Ten Most Popular Posts: as described in Level 1, they show the ten most recent and ten most popular posts respectively, and have the appropriate information of each post, as well as a Like button.
A Single Post View: when the image of any post across the website is clicked, the page is reloaded such that only that one post is shown. It has all the appropriate information, a like button, and the image shown is large.

Level 3:
Navigation: in addition to what is described in the previous levels, there are two links, "All Posts" (#!/all-posts) and "My Posts" (#!/my-posts), which link to their respective lists of posts (which are described further below).
Login Form: there is a form with entry fields for "username" and "password". If the user enters correct login details and presses the "Login" button, then their information is posted /auth/local and they are logged in.
Logging In: when the user logs in successfully, the login form is replaced with "Logged in as (name)", and they are redirected to the main page.
Failed Login: should the user enter incorrect credentials, the page will display the message "Login Failed, please try again" and the login fields will be cleared.
Name Visibility: every view has the users name at the top left when they are logged in.
All Posts View: when "All Posts" is clicked, a list is shown with all the posts, each including the appropriate information (including comments).
My Posts View: when "My Posts" is clicked, a list is shown with all of the posts made by the user who is logged in, each including the appropriate information. If they are not logged in, they are presented with the message "You have to login first".

Level 4:
Post Form in My Posts View: the My Posts section has a form for uploading images (using "p_url" for the image and "p_caption" for its name).
Create a Post in My Posts View: the aforementioned form uploads the entered information to the Posts table in the database, and the page is redrawn so that it is immediately shown. This is done by pressing the "Create a Post" button.
Show All Comments in Single Post View: all of a post's comments are shown from most to least recent, when viewed in the Single Post view.
Comment Form in Single Post View: the Single Post view has a form for posting comments (using "c_content" for the message).
Add a Comment in Single Post View: the aforementioned comment form uploads a comment with "c_content". "c_author" is collected from the "getUser()" function so that it is known who wrote the comment, and "c_post" is collected with the "getCurrentPost()" function so that it is known under which post the comment goes.

Level 5:
Delete a Post: when the user is logged in, there is a delete button next to each of their posts in the My Posts view, which they can press to delete the respective post (and any comments it had).
Logging Out: when the user is logged in, there is a logout button they can press, which removes the user data so they are no longer logged in. It shows the login form instead of their username.
View Author's Posts: when the author of a post is clicked on, the user is shown all of that author's posts (User Posts View). The author's name is included in the subheading "(Author)'s Posts".

Cypress tests passed:
pages-levels-12.spec-v4     10/10 

model-levels-12.spec-v3     4/6 

levels-34-part1-ver4.       6/6 

levels-34-part2-ver4        4/4 