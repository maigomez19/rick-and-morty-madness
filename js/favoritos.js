const ulFavoritos = document.getElementById('listado-favoritos');
const modalesFavoritos = document.getElementById('modales-favoritos');
const divError = document.getElementById('error');

/** ==================================== */
// Mostrar personajes favoritos
/** ==================================== */
const queryFavoritos = (favoritos) => `query{
    charactersByIds(ids:[${favoritos}]) {
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
}`

mostrarFavoritos();

function mostrarFavoritos() {
    let favoritos = JSON.parse(localStorage.getItem('favoritos'));

    if(favoritos == null) {
        let personajeFav = '';

        personajeFav = `<div id="error" class="container ml-0 text-center p-4 mb-0 mt-3 mt-md-4 d-flex row justify-content-between align-items-center">
                            <p class="p-0 mb-3 mb-md-0 col-12 col-md-5 col-lg-6"><span class="material-icons md-18" style="vertical-align: -7px;">info</span> Aún no has agregado personajes a tu lista de favoritos.</p>

                            <img src="img/neutral-meeseeks.gif" alt="sin resultados" class="col-12 col-md-7 col-lg-6 p-0" />
                      </div>`;

        modalesFavoritos.innerHTML = '';
        ulFavoritos.innerHTML = '';

        divError.innerHTML = personajeFav;
        divError.style.background = '#AAD5E8';

    } else {
        loading();

        const options = {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: queryFavoritos(favoritos)
            })
        }

        fetch('https://rickandmortyapi.com/graphql', options)
        .then(function (response){

            return response.json();

        }).then(function(json){

            crearItem(json);

        }).finally(function(){

            loading();

        }).catch(function (error){
            console.log('Hubo un error', error);

            personajeFav = `<div id="error" class="container ml-0 text-center p-4 mb-0 mt-3 mt-md-4 d-flex row justify-content-between align-items-center">
                            <p class="p-0 mb-3 mb-md-0 col-12 col-md-5 col-lg-6"><span class="material-icons md-18" style="vertical-align: -7px;">info</span> Aún no has agregado personajes a tu lista de favoritos.</p>

                            <img src="img/neutral-meeseeks.gif" alt="sin resultados" class="col-12 col-md-7 col-lg-6 p-0" />
                      </div>`;

            divError.innerHTML = personajeFav;
            divError.style.background = '#AAD5E8';
        })
    }
};

function crearItem(data) {
    let personajeFav = '';
    let modalFav = '';

    let estado = '';
    let spanEstado = '';
    let genero = '';
    let spanGenero = '';
    let origen = '';
    let spanOrigen = '';
    let especie = '';
    let spanEspecie = '';

    for (let i = 0; i < (data.data.charactersByIds).length; i++) {

        personajeFav += `<li class="p-0 m-3" id="fav-n${data.data.charactersByIds[i].id}">
                            <div class="card col-12 col-md p-3">
                                <img class="card-img-top img-fluid rounded-circle" src="${data.data.charactersByIds[i].image}" alt="${data.data.charactersByIds[i].name}">

                                <div class="card-body p-0 mt-3 text-center">
                                    <h2 class="card-title mb-2">${data.data.charactersByIds[i].name}</h2>
                            
                                    <button type="button" class="btn" data-toggle="modal" data-target="#exampleModalCenter${data.data.charactersByIds[i].id}">Ver más</button>
                                </div>
                            </div>
                         </li>`;

        /** ==================================== */
        // Condicionales estado
        /** ==================================== */
        if(data.data.charactersByIds[i].status == 'alive' || data.data.charactersByIds[i].status == 'Alive') {

            estado = 'vivo';
            spanEstado = 'mood';
            
        } else if(data.data.charactersByIds[i].status == 'dead' || data.data.charactersByIds[i].status == 'Dead') {

            estado = 'muerto';
            spanEstado = 'mood_bad';
            
        } else {
            estado = 'desconocido';
            spanEstado = 'sentiment_neutral';
        }

        /** ==================================== */
        // Condicionales género
        /** ==================================== */
        if(data.data.charactersByIds[i].gender == 'male' || data.data.charactersByIds[i].gender == 'Male') {

            genero = 'masculino';
            spanGenero = 'male';
            
        } else if(data.data.charactersByIds[i].gender == 'female' || data.data.charactersByIds[i].gender == 'Female') {

            genero = 'femenino';
            spanGenero = 'female';
            
        } else {
            genero = 'indefinido';
            spanGenero = 'help';
        }

        /** ==================================== */
        // Condicionales origen
        /** ==================================== */
        if(data.data.charactersByIds[i].origin.name == 'unknown' || data.data.charactersByIds[i].origin.name == 'Unknown') {

            origen = 'desconocido';
            spanOrigen = 'help';
            
        } else {
            origen = data.data.charactersByIds[i].origin.name;
            spanOrigen = 'house';
        }

        /** ==================================== */
        // Condicionales especie
        /** ==================================== */
        if(data.data.charactersByIds[i].species == 'unknown' || data.data.charactersByIds[i].species == 'Unknown') {

            especie = 'desconocida';
            spanEspecie = 'help';
            
        } else if(data.data.charactersByIds[i].species == 'human' || data.data.charactersByIds[i].species == 'Human') {

            especie = 'humano';
            spanEspecie = 'boy';

        } else if(data.data.charactersByIds[i].species == 'robot' || data.data.charactersByIds[i].species == 'Robot') {

            especie = 'robot';
            spanEspecie = 'smart_toy';

        } else {
            especie = data.data.charactersByIds[i].species;
            spanEspecie = 'person_off';
        }

        modalFav += `<div class="modal fade" id="exampleModalCenter${data.data.charactersByIds[i].id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header d-flex flex-row align-items-center">
                                <div class="d-flex flex-row align-items-center">
                                    <h3 class="modal-title mr-2">${data.data.charactersByIds[i].name}</h3>

                                    <button type="button" data-dismiss="modal" aria-label="Close" class="favorito p-1 tooltip-test" title="Eliminar de favoritos" onclick="eliminarPersonaje(${data.data.charactersByIds[i].id})">
                                        <span class="material-icons md-18" style="vertical-align: -3px;">remove</span>
                                    </button>
                                </div>
                                
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div class="modal-body">
                                <div class="d-flex flex-column justify-content-md-around align-items-center mt-2">
                                    <img class="card-img-top img-fluid rounded-circle" src="${data.data.charactersByIds[i].image}" alt="${data.data.charactersByIds[i].name}">

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

                                <p class="locacion-personaje p-1 mb-0 mt-2 mt-md-3 p-2"><span class="material-icons md-18" style="vertical-align: -6px;">person_pin_circle</span>Visto por última vez en: <span class="locacion">${data.data.charactersByIds[i].location.name}</span>.</p>
                            </div>
                        </div>
                    </div>
                </div>`;
    }

    ulFavoritos.innerHTML = personajeFav;
    modalesFavoritos.innerHTML = modalFav;
}

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

    mostrarFavoritos();

    let mensajeDiv = document.getElementById('mensaje-usuario');

    mensajeDiv.innerHTML = `<div class="container">
                                <p class="m-0"><span class="material-icons md-18" style="vertical-align: -6px;">done</span> Personaje eliminado de favoritos con éxito.</p>
                           </div>`;

    mensajeDiv.classList.add('exito-fav');
};

/** ==================================== */
// Loading
/** ==================================== */
function loading() {
    const loading = document.getElementById('loading');
    loading.classList.toggle('d-none');
};