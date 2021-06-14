import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if( btnEliminar ){

    btnEliminar.addEventListener('click', e => {
        Swal.fire({
            title: '¿Deseas Eliminar este Proyecto?',
            text: "Un proyecto eliminado no se puede recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borrarlo',
            cancelButtonText: 'No, Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                
                //envío petición con axios
                const urlProyecto = e.target.dataset.proyectoUrl;
                const url = `${ location.origin }/proyectos/${ urlProyecto }`;
                
                axios.delete( url, { params: { urlProyecto } })
                    .then( respuesta => {
                        console.log(respuesta);
                        
                        Swal.fire(
                            'Proyecto Eliminado',
                            respuesta.data,
                            'success'
                        );
                        
                        //Redirecciono al inicio despues de 3 segundos
                        setTimeout( () =>{
                            window.location.href = '/'
                        }, 3000 )
                    })
                    .catch(err => {
                        Swal.fire(
                            'Hubo un error',
                            'No se pudo eliminar el proyecto',
                            'error'
                        );
                    });
                    return;

            }
        })
    })
}

export default btnEliminar;