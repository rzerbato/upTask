const Tareas = require('../models/Tareas');
const Proyectos = require('../models/Proyectos');

exports.agregarTarea = async (req, res, next) => {

    //Obtengo el proyecto actual
    const proyecto = await Proyectos.findOne( { where: { url: req.params.url } } );

    //Leo el input
    const { tarea } = req.body;

    const estado = 0;
    const proyectoId = proyecto.id;

    //Inserto y redirecciono
    const resultado = await Tareas.create( { tarea, estado, proyectoId } );
    if( !resultado ){
        return next();
    }

    res.redirect( `/proyectos/${ req.params.url }`);
}

exports.cambiarEstadoTarea = async (req, res, next) => {
    const { id } = req.params;
    const tarea = await Tareas.findOne( {where: { id } } );
    
    //Cambiar el estado
    let estado = 0;
    if( tarea.estado === estado ){
        estado = 1;
    }

    tarea.estado = estado;

    const resultado = await tarea.save();

    if( !resultado ) return next();

    res.status(200).send('Actualizado');
}

exports.eliminarTarea = async (req, res, next) => {
    const { id } = req.params;

    const resultado = await Tareas.destroy( { where: { id } } );

    if(!resultado) return next();

    res.status(200).send("Tarea Eliminada Correctamente");
}