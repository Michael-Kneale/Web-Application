/*
 *
 * Module: Service
 * This module implements user authentication. It handles the posting
 * of user login information, by pushing it to the local server. It
 * also allows the user and their web token to be retrieved.
 *
 * Student Name: Michael Kneale
 * Student Number: 46502289
 *
 */ 

export {Auth}

const Auth = {
    userData: null,

    // login - handle user login  
    //      by submitting a POST request to the server API
    //      username - is the input username
    //      password - is the input password
    // when the request is resolved, creates a "userLogin" event
    login: function(username, password) {
        let identifier = username;
        fetch('/auth/local', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({identifier, password})
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            this.userData = data
            localStorage.setItem('key', JSON.stringify(this.userData));
            let event = new CustomEvent('userLogin')
            window.dispatchEvent(event)
        })
    }, 

    // getUser - return the user object from userData.
    // Stops an uncaught TypeError from happening when
    // main.js tries to call the login view before
    // the user is logged in.
    getUser: function() {
        if (localStorage.getItem('key')) {
            try {
                return this.userData.user;
            }
            catch(error) {
                return null;
            }
        } else {
            return null;
        }
    },

    // getJWT - get the JWT from userData
    getJWT: function() {
        if (this.userData) {
            return this.userData.jwt;
        } else {
            return null;
        } 
    }
    
}