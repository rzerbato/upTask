const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Referencio el Modelo donde se autentica
const Usuarios = require('../models/Usuarios');

// Local Strategy - Login con credenciales locales
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {            
            try {
                const usuario = await Usuarios.findOne( 
                    { 
                        where: 
                        { 
                            email,
                            activo: 1
                        } 
                    }
                );
                //Verifico el password
                if(!usuario.verificarPassword(password) ){
                    //Password incorrecto
                    return done(null, false, {
                        message: 'Password Incorrecto'
                    })
                }
                //el mail existe y el password es correcto
                return done( null, usuario );
            } catch (error) {
                //El usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
);


//Serializar el usuario
passport.serializeUser(( usuario, callback ) => {
    callback( null, usuario );
});

//Deserializar el usuario
passport.deserializeUser(( usuario, callback ) => {
    callback( null, usuario );
});

module.exports = passport;