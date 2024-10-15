import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Crud = () => {
    const [track, setTrack] = useState('');
    const [artista, setArtista] = useState('');
    const [genero, setGenero] = useState('');
    const [id, setId] = useState('');
    const [listaCanciones, setListaCanciones] = useState([]);
    const [modoEditar, setModoEditar] = useState(false);
    const [trakPorId, setTrakPorId] = useState(null);

    useEffect(() => {
        fetchTracks();
    }, []);

    const fetchTracks = () => {
        axios.get('http://localhost:8080/api-traks/get-mostrartodo')
            .then(response => {
                console.log(response.data);
                setListaCanciones(response.data);
            })
            .catch(error => {
                console.error('Hubo un error al obtener las canciones:', error);
            });
    };

    const limpiarForm = () => {
        setTrack('');
        setGenero('');
        setArtista('');
        setId('');
        setModoEditar(false);
    };

    const iniciarEditarTrack = (rola) => {
        setModoEditar(true);
        setTrack(rola.track);
        setArtista(rola.artista);
        setGenero(rola.genero);
        setId(rola.id);
    };

    const eliminarTrack = (rola) => {
        Swal.fire({
            title: '¿Estás seguro de borrar la canción?',
            text: 'Esta acción no es reversible',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, bórrala'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8080/api-traks/borrartrack/${rola.id}`)
                    .then(response => {
                        Swal.fire({
                            title: 'Borrado',
                            text: 'La canción ha sido eliminada',
                            icon: 'success'
                        });
                        fetchTracks();
                    })
                    .catch(error => {
                        Swal.fire('Error', 'Hubo un error al eliminar la canción', 'error');
                    });
            }
        });
    };

    const guardarTrack = (evt) => {
        evt.preventDefault();

        if (!track.trim() || !artista.trim() || !genero.trim()) {
            alert("Todos los campos son obligatorios");
            return;
        }

        const nuevaCancion = { track, artista, genero };

        if (modoEditar) {
            nuevaCancion.id = id;
            axios.post(`http://localhost:8080/api-traks/guardartrack`, nuevaCancion)
                .then(response => {
                    Swal.fire({
                        title: '¿Estás seguro de guardar los cambios?',
                        showDenyButton: true,
                        showCancelButton: true,
                        confirmButtonText: 'Guardar',
                        denyButtonText: `No guardar`
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire('Guardado', 'Los cambios han sido guardados', 'success');
                            fetchTracks();
                            limpiarForm();
                        } else if (result.isDenied) {
                            Swal.fire('No guardado', 'Los cambios no se han guardado', 'info');
                        }
                    });
                })
                .catch(error => {
                    Swal.fire('Error', 'Hubo un error al actualizar la canción', 'error');
                });
        } else {
            axios.post('http://localhost:8080/api-traks/guardartrack', nuevaCancion)
                .then(response => {
                    Swal.fire({
                        title: '¿Estás seguro de guardar la canción?',
                        showDenyButton: true,
                        showCancelButton: true,
                        confirmButtonText: 'Guardar',
                        denyButtonText: `No guardar`
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire('Guardado', 'La canción ha sido guardada', 'success');
                            fetchTracks();
                            limpiarForm();
                        } else if (result.isDenied) {
                            Swal.fire('No guardado', 'La canción no se ha guardado', 'info');
                        }
                    });
                })
                .catch(error => {
                    Swal.fire('Error', 'Hubo un error al agregar la canción', 'error');
                });
        }
    };

    const buscarTrackPorId = (evt) => {
        evt.preventDefault();
        if (!id) {
            alert("Ingrese un ID válido para buscar");
            return;
        }

        axios.get(`http://localhost:8080/api-traks/get-mostrartrack/${id}`)
            .then(response => {
                if (response.data) {
                    setTrakPorId(response.data);
                } else {
                    Swal.fire('No encontrado', 'No se encontró ninguna canción con ese ID', 'info');
                    setTrakPorId(null);
                }
            })
            .catch(error => {
                Swal.fire('Error', 'Hubo un error al buscar la canción por ID', 'error');
                setTrakPorId(null);
            });
    };

    return (
        <div className="container">
            <h1 className='text-center display-4 mb-4'>Registro de Canciones</h1>
            <div className='row'>
                <div className="col-md-6">
                    <div className='card'>
                        <h3 className='card-header bg-dark text-white text-center'>Formulario</h3>
                        <div className='card-body'>
                            <form onSubmit={guardarTrack}>
                                <div className="mb-3">
                                    <input
                                        id='nombre'
                                        name='Track'
                                        type="text"
                                        placeholder='Track'
                                        className='form-control'
                                        onChange={(evt) => setTrack(evt.target.value)}
                                        value={track}
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        placeholder='Artista'
                                        className='form-control'
                                        onChange={(evt) => setArtista(evt.target.value)}
                                        value={artista}
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        placeholder='Género'
                                        className='form-control'
                                        onChange={(evt) => setGenero(evt.target.value)}
                                        value={genero}
                                    />
                                </div>
                                {
                                    modoEditar ?
                                        (<button type='submit' className='btn btn-warning mb-3'>Editar Canción</button>)
                                        : (<button type='submit' className='btn btn-dark mb-3'>Agregar Canción</button>)
                                }
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className='card' style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <h3 className='card-header bg-dark text-white text-center'>Lista de Canciones</h3>
                        <ul className='list-group list-group-flush' style={{ maxHeight: '350px', overflowY: 'auto' }}>
                            {listaCanciones.length === 0 ? (
                                <li className='list-group-item text-center'>No hay canciones registradas</li>
                            ) : (
                                listaCanciones.map((rolas, index) => (
                                    <li key={index} className='list-group-item d-flex justify-content-between align-items-start'>
                                        <div>
                                            <p><strong>Track:</strong> {rolas.track}</p>
                                            <p><strong>Artista:</strong> {rolas.artista}</p>
                                            <p><strong>Género:</strong> {rolas.genero}</p>
                                        </div>
                                        <div className="mt-3">
                                            <button onClick={() => iniciarEditarTrack(rolas)} className='btn btn-warning mb-2'>Editar</button><br />
                                            <button onClick={() => eliminarTrack(rolas)} className='btn btn-danger'>Eliminar</button>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>

                    <div className='card mt-4'>
                        <h3 className='card-header bg-dark text-white text-center'>Buscar Canción por ID</h3>
                        <div className='card-body'>
                            <form onSubmit={buscarTrackPorId}>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        placeholder='ID de la Canción'
                                        className='form-control'
                                        onChange={(evt) => setId(evt.target.value)}
                                        value={id}
                                    />
                                </div>
                                <button type='submit' className='btn btn-primary'>Buscar por ID</button>
                            </form>
                            {trakPorId && (
                                <div className='mt-3'>
                                    <h5 className='mb-3'>Canción encontrada:</h5>
                                    <p><strong>Track:</strong> {trakPorId.track}</p>
                                    <p><strong>Artista:</strong> {trakPorId.artista}</p>
                                    <p><strong>Género:</strong> {trakPorId.genero}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Crud;
