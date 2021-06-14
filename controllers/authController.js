const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos son Obligatorios'
});

// Reviso si el usuario esta logueado
exports.usuarioAutenticado = (req, res, next) => {

    // El usuario esta autenticado continuo
    if(req.isAuthenticated()){
        return next();
    }

    // El usuario no esta autenticado, redirijo
    return res.redirect('/iniciar-sesion');
}

//Cierro session y redirijo al login
exports.cerrarSesion = (req, res) => {
    req.session.destroy( () => {
        res.redirect('/iniciar-sesion');
    });
}

//Genera un token si el usuario es valido
exports.enviarToken = async (req, res) => {
    //verifico que el usuario exista}
    const { email } = req.body;
    const usuario = await Usuarios.findOne( { where: { email } });
    if( !usuario ){
        //El usuario no existe
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }

    //El usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;
    
    //Actualizo el usuario
    await usuario.save();

    // url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    
    //Envio el mail con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecerPassword'
    });
    
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({ where: { token: req.params.token } });
    //Usuario invalido
    if( !usuario ){
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    // usuario valido
    res.render( 'resetPassword', { 
        nombrePagina: 'Reestablecer Contraseña'
    })
}

exports.actualizarPassword = async (req, res) => {

    //Verifico que el token sea valido y que no este vencido
    const usuario = await Usuarios.findOne(
    { 
        where: 
        { 
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        } 
    });

    //Verifico si el usuario existe
    if( !usuario ){
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    //Hasheo el nuevo password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;   

    //Actualizo el usuario
    await usuario.save();
    req.flash('correcto', 'Tu Password se ha Modificado Correctamente');
    res.redirect('/iniciar-sesion');
}