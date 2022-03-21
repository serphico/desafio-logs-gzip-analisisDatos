function isAuth(req,res,next) {
    console.log(req.session.email)
    if (req.isAuthenticated() && req.session.email) {
        next()
    } else {
        
        res.redirect('/login')
    }
}

module.exports = isAuth;