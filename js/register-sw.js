if('serviceWorker' in navigator){
    navigator.serviceWorker.register("sw.js").then((message)=>{
        console.log('Éxito. El service worker funciona correctamente.');
    });
} else {
    console.log('Error. El service worker no fue soportado.');
}