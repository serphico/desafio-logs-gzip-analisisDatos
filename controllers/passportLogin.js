const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {mongoDB} = require('../config.js')
const bCrypt = require('bcrypt')
const Users = require('./schema.js');

function isValidPassword(user, password) {
    return bCrypt.compareSync(password, user.password);
   }

   function createHash(password) {
    return bCrypt.hashSync(
              password,
              bCrypt.genSaltSync(10),
              null);
  }
  

  passport.use('registro', new LocalStrategy({
    passReqToCallback: true
   },
    (req, username, password, done) => {

        Users.findOne({ 'email': req.body.email }, function (err, user) {
   
        if (err) {
          console.log('Error in SignUp: ' + err);
          return done(err);
        }
   
        if (user) {
          console.log('El usuario ya existe');
          return done(null, false)
        }
   
        const newUser = {
          email: req.body.email,
          username: username,
          password: createHash(password),
        }
        const userSaveModel = new Users(newUser)
        userSaveModel.save( (err, userWithId) => {
            if (err) {
              console.log('Error in Saving user: ' + err);
              return done(err);
            }
            console.log('User Registration succesful');
            return done(null, userWithId);
          });
        });
      })
     )

     passport.use('login', new LocalStrategy((username, password, done) => {

        console.log(username)

        Users.findOne({ 'email':username }, (err, user) => {

            if (err)
              return done(err);
       
            if (!user) {
              console.log('No se encontro el usuario ' + username);
              return done(null, false);
            }
       
            if (!isValidPassword(user, password)) {
              console.log('Contraseña Invalida');
              return done(null, false);
            }
       
            return done(null, user);
          });
        })
       );
       
     
passport.serializeUser((user, done) => {
    done(null, user._id);
});
      
passport.deserializeUser((id, done) => {
    Users.findById(id, done);
});
      