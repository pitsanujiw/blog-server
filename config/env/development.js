module.exports = {
    mongoURI: "mongodb://localhost/tweet",
    sessionSecret: "dev_secret_key",
    debug: true,
    facebook: {
        clientID: "1741494099231252",
        clientSecret: "2199f40a76e749ccc54d6bdb67326c2f",
        callbackURL: "http://localhost:3000/oauth/facebook/callback"
    }
}