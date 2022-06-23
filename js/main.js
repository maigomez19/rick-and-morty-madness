const logoNav = document.getElementById('logo-sm');
const logoFooter = document.getElementById('logo-sm2');
const mensajeDiv = document.getElementById('mensaje-usuario');

/** ==================================== */
// Eventos offline-online
/** ==================================== */
window.addEventListener('offline', event => {
    logoNav.classList.add('blanco-negro');
    logoFooter.classList.add('blanco-negro');

    mensajeDiv.innerHTML = `<div class="container">
                                <p class="m-0"><span class="material-icons md-18" style="vertical-align: -6px;">warning</span> Esta app se encuentra sin conexión.</p>
                           </div>`;

    mensajeDiv.classList.add('sin-conexion');

    console.log('Error. No hay conexión.');
});

window.addEventListener('online', event => {
    logoNav.classList.remove('blanco-negro');
    logoFooter.classList.remove('blanco-negro');
    
    mensajeDiv.classList.remove('sin-conexion');
    
    mensajeDiv.innerHTML = '';
});

if (!navigator.onLine){
    logoNav.classList.add('blanco-negro');
    logoFooter.classList.add('blanco-negro');

    mensajeDiv.innerHTML = `<div class="container">
                                <p class="m-0"><span class="material-icons md-18" style="vertical-align: -6px;">warning</span> Esta app se encuentra sin conexión.</p>
                           </div>`;
                           
    mensajeDiv.classList.add('sin-conexion');

    console.log('Error. No hay conexión.');
}