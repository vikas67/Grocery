const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../models/user.model');



passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {


            let userPrototype =  Object.getPrototypeOf( {
                usernameField: 'email',
                passwordField: 'password',
            });
            

            try {
                const user = await Admin.findOne({email});
                // Username/email does NOT exist
                if (!user) {
                    return done(null, false, {
                        message: 'Username/email not registered',
                    });
                }
                // Email exist and now we need to verify the password
                const isMatch = await user.isValidPassword(password);
                return isMatch
                    ? done(null, user)
                    : done(null, false, {message: 'Incorrect password'});
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    Admin.findById(id, function (err, user) {
        done(err, user);
    });
});










