/*
 *
 * Module: Utility
 * This module implements the "splitHash" utility function. This is used
 * to split a link into its path and the id for the particular post. This
 * assists the Single Post View, making it easier to retrieve the id from
 * the link.
 *
 * Student Name: Michael Kneale
 * Student Number: 46502289
 *
 */

export {splitHash};

// splitHash - given a hash path like "#!//2" 
//   return an object with properties `path` ("posts") and `id` (2)
function splitHash(hash) {

    const regex = "#!/([^/]*)/?(.*)?";
    const match = hash.match(regex);
    if (match) {
        return {
            path: match[1],
            id: match[2]
        }
    } else {
        return { path: "" }
    }
}
