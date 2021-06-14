import Swal from 'sweetalert2';

export const actualizarAvance = () => {
    
    //Selecciono las tareas
    const tareas = document.querySelectorAll('li.tarea');

    if( tareas.length ){
        //Selecciono las tareas completadas
        const tareasCompletas = document.querySelectorAll('i.completo');
    
        //Calculo el avance
        const avance = Math.round((tareasCompletas.length / tareas.length) * 100);
        
        //Muestro el avance
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance + '%';

        if(avance === 100){
            Swal.fire(
                'Completaste el Proyecto',
                'Felicidades!, has terminado tus tareas',
                'success'
            );
        }
    }
}