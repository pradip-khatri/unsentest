import Mydatabase from "./database.js";
const mydatabase = new Mydatabase();
// Service Worker registration
if ('serviceWorker' in navigator) {
  console.log("hello service worker");
  navigator.serviceWorker
    .register('/service-worker.js', {scope:'/unsentest', type:'module'})
    .catch(function (error) {
      console.log('Service Worker failed to register:', error);
    });
}
else {
  console.log('Service Worker is not supported by this browser.');
}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready
  .then((register)=>{
    console.log('ready', register);
  })
 
  
}


const notificationButton = document.getElementById('notification');
if ('Notification' in window && 'serviceWorker' in navigator) {
    notificationButton.addEventListener('click', () => {
        const permission = Notification.permission;
        console.log('Permission: ', permission);
        switch (permission) {
            case 'granted':
              showMyNotification();
              configurePushSubscription();
                break;
            case 'denied':
                notificationButton.disabled = true;
                break;
            case 'default':
                //showMyNotification();

                requestUserPermission();
                break;

        }


    });


} else {
    notificationButton.disabled = true;
}

function showMyNotification(){
  console.log('Showing notificcation');
  const options ={
    body:"thank you for subscribing.",
    icon: '/unsentest/images/icon.png',
    image: '/unsentest/images/welcome.jpeg',
    actions: [
      {
        action: 'confirm',
        title: 'okay',
        icon:'/unsentest/images/okay.jpeg'
      },
      {
        action:'cancel',
        title: 'cancel',
        icon: '/unsentest/images/cancel.jpg'
      }
    ]
  };
  navigator.serviceWorker.ready.then((registration)=>{
    registration.showNotification('succesfully subscribed', options);
  });
}
function requestUserPermission(){
  Notification.requestPermission()
  .then((permission)=>{
    console.log('User choice',permission);
    if(permission === 'granted'){
      showMyNotification();
    }
  })
  .catch((error)=>{
    console.log('error',error);
  })

}
function configurePushSubscription(){
  navigator.serviceWorker.ready.then((registration)=>{
    const pushManager = registration.pushManager;
    pushManager.getSubscription()
    .then((subscription)=>{
      if(subscription === null){
        console.log('current subscription', subscription);
        const options = {
          userVisibleOnly: true,
          applicationServerKey: 'BPRcMxrIfFDaGV7i_hGRBv5cKT9lz2HKwVZ-KZHA9vXyHgZQ5zCbkuiAhwnRq0N3dgSqcNvGv_efH9l03dsb4ZA'
        };
        pushManager.subscribe(options)
        .then((subscription)=>{
          console.log('new subscritption:', subscription);
          console.log(JSON.stringify(subscription));
          mydatabase.saveSubscription(subscription)
          .then((result)=>{
            console.group('success', result);
          })
          .catch((error)=>{
            console.log('error: ',error);
          });
        })
        .catch((error)=>{
          console.log('error: ',error);
        });
      }
      else{

      }
    })
    .catch((error)=>{
      console.log('error',error);
    });
  })
}



/*IndexDB Section8 */






if (navigator?.storage?.estimate){
  navigator.storage.estimate()
  .then((result) => {
    console.log(result);
  });
}

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// DON'T use "var indexedDB = …" if you're not in a function.
// Moreover, you may need references to some window.IDB* objects:
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)
if (!window.indexedDB) {
  console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}




  // Create an objectStore for this database

  