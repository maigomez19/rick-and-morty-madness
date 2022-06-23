const btn = document.getElementById('btn-buscar');
const buscador = document.getElementById('buscador');
const divResultado = document.getElementById('resultado');
const divModales = document.getElementById('modales-detalle');
const divError = document.getElementById('error');

/** ========================================== */
// Muestro personajes sin filtro de búsqueda
/** ========================================== */
const queryTodos = (nombre) => `query{
    characters {
      results{
        id
        name
        status
        species
        gender
        origin{
          name
        }
        location{
          name
        }
        image
      }
    }
}`

loading();

const options = {
    method: "post",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        query: queryTodos()
    })
}

fetch('https://rickandmortyapi.com/graphql', options)
.then(function (response){

    return response.json();

}).then(function(json){

    mostrarPersonaje(json);

    let personajesFavoritos = JSON.parse(localStorage.getItem('favoritos'));

    if(personajesFavoritos !== null) {
        let idsFavoritos = [];
        let idPersonaje = '';
        let item = '';

        for (let i = 0; i < (json.data.characters.results).length; i++) {

            idPersonaje = Number(json.data.characters.results[i].id);
            item = personajesFavoritos.indexOf(idPersonaje);

            if(item !== -1) {
                idsFavoritos.push(idPersonaje);
            }
        }
        
        estilosItemsFavoritos(idsFavoritos);
    }

}).finally(function(){

    loading();

}).catch(function (error){
    console.log('Hubo un error', error);

    let personaje = '';

    personaje = `<div id="error" class="container ml-0 text-center p-4 mb-0 mt-3 mt-md-4 d-flex row justify-content-between align-items-center">
                        <p class="p-0 mb-3 mb-md-0 col-12 col-md-5 col-lg-6"><span class="material-icons md-18" style="vertical-align: -7px;">warning</span> No se han encontrado resultados. Por favor intente nuevamente.</p>

                        <img src="img/error-meeseeks.gif" alt="sin resultados" class="col-12 col-md-7 col-lg-6 p-0" />
                    </div>`;

    divModales.innerHTML = '';
    divResultado.innerHTML = '';

    divError.innerHTML = personaje;
    divError.style.background = '#AAD5E8';
})

/** ==================================== */
// Buscador de personajes
/** ==================================== */
const queryPersonaje = (nombre) => `query{
    characters(filter:{ name: "${nombre}" }) {
      results{
        id
        name
        status
        species
        gender
        origin{
          name
        }
        location{
          name
        }
        image
      }
    }
}`

btn.addEventListener('click', ()=>{
    const personaje = buscador.value;

    loading();

    const options = {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: queryPersonaje(personaje)
        })
    }

    fetch('https://rickandmortyapi.com/graphql', options)
    .then(function (response){

        return response.json();

    }).then(function(json){

        mostrarPersonaje(json);

        let personajesFavoritos = JSON.parse(localStorage.getItem('favoritos'));

        if(personajesFavoritos !== null) {
            let idsFavoritos = [];
            let idPersonaje = '';
            let item = '';

            for (let i = 0; i < (json.data.characters.results).length; i++) {

                idPersonaje = Number(json.data.characters.results[i].id);
                item = personajesFavoritos.indexOf(idPersonaje);

                if(item !== -1) {
                    idsFavoritos.push(idPersonaje);
                }
            }
            
            estilosItemsFavoritos(idsFavoritos);
        }

    }).finally(function(){

        loading();

    }).catch(function (error){
        console.log('Hubo un error', error);

        let personaje = '';

        personaje = `<div id="error" class="container ml-0 text-center p-4 mb-0 mt-3 mt-md-4 d-flex row justify-content-between align-items-center">
                            <p class="p-0 mb-3 mb-md-0 col-12 col-md-5 col-lg-6"><span class="material-icons md-18" style="vertical-align: -7px;">warning</span> No se han encontrado resultados. Por favor intente nuevamente.</p>

                            <img src="img/error-meeseeks.gif" alt="sin resultados" class="col-12 col-md-7 col-lg-6 p-0" />
                      </div>`;

        divModales.innerHTML = '';
        divResultado.innerHTML = '';

        divError.innerHTML = personaje;
        divError.style.background = '#AAD5E8';
    })
});

/** ================================================ */
// Muestro la información recibida de la búsqueda
/** ================================================ */
function mostrarPersonaje(data){
    let personaje = '';
    let modal = '';

    if((data.data.characters.results).length === 0) {

        personaje = `<div id="error" class="container ml-0 text-center p-4 mb-0 mt-3 mt-md-4 d-flex row justify-content-between align-items-center">
                            <p class="p-0 mb-3 mb-md-0 col-12 col-md-5 col-lg-6"><span class="material-icons md-18" style="vertical-align: -7px;">warning</span> No se han encontrado resultados. Por favor intente nuevamente.</p>

                            <img src="img/error-meeseeks.gif" alt="sin resultados" class="col-12 col-md-7 col-lg-6 p-0" />
                       </div>`;

        divModales.innerHTML = '';
        divResultado.innerHTML = '';

        divError.innerHTML = personaje;
        divError.style.background = '#AAD5E8';


    } else {

        console.log('Resultados', data);

        let estado = '';
        let spanEstado = '';
        let genero = '';
        let spanGenero = '';
        let origen = '';
        let spanOrigen = '';
        let especie = '';
        let spanEspecie = '';

        for (let i = 0; i < (data.data.characters.results).length; i++) {
            
            personaje += `<li class="p-0 m-3">
                            <div class="card col-12 col-md p-3">
                                <img class="card-img-top img-fluid rounded-circle" src="${data.data.characters.results[i].image}" alt="${data.data.characters.results[i].name}">

                                <div class="card-body p-0 mt-3 text-center">
                                    <h2 class="card-title mb-2"><span id="marca-favorito-${data.data.characters.results[i].id}" class="material-icons md-18 marca-favorito d-none" style="vertical-align: -3px;">favorite</span> ${data.data.characters.results[i].name}</h2>
                            
                                    <button type="button" class="btn" data-toggle="modal" data-target="#exampleModalCenter${data.data.characters.results[i].id}">Ver más</button>
                                </div>
                            </div>
                         </li>`;


            /** ==================================== */
            // Condicionales estado
            /** ==================================== */
            if(data.data.characters.results[i].status == 'alive' || data.data.characters.results[i].status == 'Alive') {

                estado = 'vivo';
                spanEstado = 'mood';
                
            } else if(data.data.characters.results[i].status == 'dead' || data.data.characters.results[i].status == 'Dead') {

                estado = 'muerto';
                spanEstado = 'mood_bad';
                
            } else {
                estado = 'desconocido';
                spanEstado = 'sentiment_neutral';
            }

            /** ==================================== */
            // Condicionales género
            /** ==================================== */
            if(data.data.characters.results[i].gender == 'male' || data.data.characters.results[i].gender == 'Male') {

                genero = 'masculino';
                spanGenero = 'male';
                
            } else if(data.data.characters.results[i].gender == 'female' || data.data.characters.results[i].gender == 'Female') {

                genero = 'femenino';
                spanGenero = 'female';
                
            } else {
                genero = 'indefinido';
                spanGenero = 'help';
            }

            /** ==================================== */
            // Condicionales origen
            /** ==================================== */
            if(data.data.characters.results[i].origin.name == 'unknown' || data.data.characters.results[i].origin.name == 'Unknown') {

                origen = 'desconocido';
                spanOrigen = 'help';
                
            } else {
                origen = data.data.characters.results[i].origin.name;
                spanOrigen = 'house';
            }

            /** ==================================== */
            // Condicionales especie
            /** ==================================== */
            if(data.data.characters.results[i].species == 'unknown' || data.data.characters.results[i].species == 'Unknown') {

                especie = 'desconocida';
                spanEspecie = 'help';
                
            } else if(data.data.characters.results[i].species == 'human' || data.data.characters.results[i].species == 'Human') {

                especie = 'humano';
                spanEspecie = 'boy';

            } else if(data.data.characters.results[i].species == 'robot' || data.data.characters.results[i].species == 'Robot') {

                especie = 'robot';
                spanEspecie = 'smart_toy';

            } else {
                especie = data.data.characters.results[i].species;
                spanEspecie = 'person_off';
            }

            modal += `<div class="modal fade" id="exampleModalCenter${data.data.characters.results[i].id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-header d-flex flex-row align-items-center">
                                    <div class="d-flex flex-row align-items-center">
                                        <h3 class="modal-title mr-2">${data.data.characters.results[i].name}</h3>

                                        <button id="favorito-${data.data.characters.results[i].id}" type="button" class="favorito p-1 tooltip-test" title="Agregar a favoritos" onclick="guardarPersonaje(${data.data.characters.results[i].id})">
                                            <span class="material-icons md-18" style="vertical-align: -3px;">favorite</span>
                                        </button>

                                        <button id="eliminar-favorito-${data.data.characters.results[i].id}" type="button" class="favorito p-1 tooltip-test d-none" title="Eliminar de favoritos" onclick="eliminarPersonaje(${data.data.characters.results[i].id})">
                                            <span class="material-icons md-18" style="vertical-align: -3px;">remove</span>
                                        </button>
                                    </div>
                                    
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>

                                <div id="exito-${data.data.characters.results[i].id}"></div>

                                <div class="modal-body">
                                    <div class="d-flex flex-column justify-content-md-around align-items-center mt-2">
                                        <img class="card-img-top img-fluid rounded-circle" src="${data.data.characters.results[i].image}" alt="${data.data.characters.results[i].name}">

                                        <ul class="p-0 mb-0 mt-2 mt-md-3 col-12">
                                            <li class="mb-2 p-1 d-flex row align-items-center ml-0">
                                                <span class="col-4 col-md-3 categoria"><span class="material-icons md-18" style="vertical-align: -6px;">${spanEstado}</span> Estado: </span><span class="locacion col-8 col-md-9">${estado}</span>
                                            </li>

                                            <li class="mb-2 p-1 d-flex row align-items-center ml-0">
                                                <span class="col-4 col-md-3 categoria"><span class="material-icons md-18" style="vertical-align: -6px;">${spanEspecie}</span> Especie: </span><span class="locacion col-8 col-md-9">${especie}</span>
                                            </li>

                                            <li class="mb-2 p-1 d-flex row align-items-center ml-0">
                                                <span class="col-4 col-md-3 categoria"><span class="material-icons md-18" style="vertical-align: -6px;">${spanGenero}</span> Género: </span><span class="locacion col-8 col-md-9">${genero}</span>
                                            </li>

                                            <li class="mb-2 p-1 d-flex row align-items-center ml-0">
                                                <span class="col-4 col-md-3 categoria"><span class="material-icons md-18" style="vertical-align: -6px;">${spanOrigen}</span> Origen: </span><span class="locacion col-8 col-md-9">${origen}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <p class="locacion-personaje p-1 mb-0 mt-2 mt-md-3 p-2"><span class="material-icons md-18" style="vertical-align: -6px;">person_pin_circle</span>Visto por última vez en: <span class="locacion">${data.data.characters.results[i].location.name}</span>.</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
            }

            divError.innerHTML = '';

            divResultado.innerHTML = personaje;
            divModales.innerHTML = modal;
    }
};


/** ==================================== */
// Guardo el personaje en favoritos
/** ==================================== */
function guardarPersonaje(id){

    let personajesFavoritos = JSON.parse(localStorage.getItem('favoritos'));

    if(personajesFavoritos == null) {
        let personajesFavoritos = [];

        personajesFavoritos.push(id);
        localStorage.setItem('favoritos', JSON.stringify(personajesFavoritos));

    } else {

        personajesFavoritos.push(id);
        localStorage.setItem('favoritos', JSON.stringify(personajesFavoritos));

        if(personajesFavoritos.length === 0) {
            localStorage.removeItem('favoritos');
        }
    }

    /** ==================================== */
    // Estilos al item del personaje guardado
    /** ==================================== */
    let idExito = 'exito-'+id;
    let divExito = document.getElementById(idExito);

    divExito.innerHTML = `<p class="exito mb-0 pl-3 pt-2 pb-2">Personaje añadido a favoritos con éxito.</p>`;

    let idBtnFavorito = 'favorito-'+id;
    let btnFavorito = document.getElementById(idBtnFavorito);

    btnFavorito.classList.add('d-none');

    let idEliminarFavorito = 'eliminar-favorito-'+id;
    let btnEliminarFavorito = document.getElementById(idEliminarFavorito);

    btnEliminarFavorito.classList.remove('d-none');

    let idMarcaFavorito = 'marca-favorito-'+id;
    let marcaFavorito = document.getElementById(idMarcaFavorito);

    marcaFavorito.classList.remove('d-none');
};

/** ==================================== */
// Eliminar personaje de favoritos
/** ==================================== */
function eliminarPersonaje(id) {

    let favoritos = JSON.parse(localStorage.getItem('favoritos'));

    let item = favoritos.indexOf(id);

    if(item !== -1) {
        favoritos.splice(item, 1);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));

        if(favoritos.length === 0) {
            localStorage.removeItem('favoritos');
        }
    }

    /** ==================================== */
    // Estilos al item del personaje eliminado
    /** ==================================== */
    let idExito = 'exito-'+id;
    let divExito = document.getElementById(idExito);

    divExito.innerHTML = `<p class="exito mb-0 pl-3 pt-2 pb-2">Personaje eliminado de favoritos con éxito.</p>`;

    let idBtnFavorito = 'favorito-'+id;
    let btnFavorito = document.getElementById(idBtnFavorito);

    btnFavorito.classList.remove('d-none');

    let idEliminarFavorito = 'eliminar-favorito-'+id;
    let btnEliminarFavorito = document.getElementById(idEliminarFavorito);

    btnEliminarFavorito.classList.add('d-none');

    let idMarcaFavorito = 'marca-favorito-'+id;
    let marcaFavorito = document.getElementById(idMarcaFavorito);

    marcaFavorito.classList.add('d-none');
};

/** ==================================== */
// Loading
/** ==================================== */
function loading() {
    const loading = document.getElementById('loading');
    loading.classList.toggle('d-none');
};

/** ========================================================== */
// Mantengo los estilos de los items favoritos cuando recargo
/** ========================================================== */
function estilosItemsFavoritos(array) {
    for (let i = 0; i < array.length; i++) {
        let idBtnFavorito = 'favorito-'+array[i];
        let btnFavorito = document.getElementById(idBtnFavorito);
    
        btnFavorito.classList.add('d-none');
    
        let idEliminarFavorito = 'eliminar-favorito-'+array[i];
        let btnEliminarFavorito = document.getElementById(idEliminarFavorito);
    
        btnEliminarFavorito.classList.remove('d-none');
    
        let idMarcaFavorito = 'marca-favorito-'+array[i];
        let marcaFavorito = document.getElementById(idMarcaFavorito);
    
        marcaFavorito.classList.remove('d-none');
    }
}