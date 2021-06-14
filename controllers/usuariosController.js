const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en Uptask'
    });
}

exports.formIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesión en Uptask',
        error
    });
}

exports.crearCuenta = async (req, res) => {
    //Leer datos
    const { email, password } = req.body;

    try {
        //Crear usuario
        await Usuarios.create({ email, password });
        
        //Crear url de confirmacion
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        const usuario = {
            email
        }

        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTask Reset',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });

        req.flash( 'correcto', 'Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');

    } catch (error) {
        req.flash('error', error.errors.map(error => error.message ));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en Uptask',
            email,
            password
        });
    }
    
}

exports.formRestablecerPassword = (req, res) => {
    res.render('reestablecer', 
    {
        nombrePagina: 'Reestablecer tu Contraseña'
    })
}


//Cambia el estado de la cuenta
exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    if(!usuario){
        req.flash('error', 'No válido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');

}