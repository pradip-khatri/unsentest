// import Mydatabase from "./js/database.js";
// const mydatabase = new Mydatabase();


const mycaches = 'mycaches';
/**
 * On Install Event
 * Triggered when the service worker is installed
 */
self.addEventListener('install', function (event) {

  self.skipWaiting();
  event.waitUntil(
    caches.open('mycaches')
    .then(function(cache){
      cache.addAll([
        '/unsentest/',
        '/unsentest/service-worker.js',
        '/unsentest/manifest.json',
        '/unsentest/index.html',
        '/unsentest/icon.png',
        '/unsentest/pages/add/index.html',
        '/unsentest/pages/add/scripts.js',
        '/unsentest/pages/add/styles.css',
        '/unsentest/pages/list/index.html',
        '/unsentest/pages/list/scripts.js',
        '/unsentest/pages/list/styles.css',
        '/unsentest/js/database.js',
        '/unsentest/js/scripts.js',
        '/unsentest/images/icon.png',
   //     '/icons',
        '/unsentest/css/styles.css'
        
      //   .then(function(cache) {
      //     cache.add('/unsentest');
      //     cache.add('/unsentest/service-worker.js'); //adding the necessary files to the cache so that app can run while offline
      //     cache.add('/unsentest/manifest.json');
      //     cache.add('/unsentest/index.html');
      //     cache.add('/unsentest/icon.png');
      //     cache.add('/unsentest/pages/add/index.html');
      //     cache.add('/unsentest/pages/add/scripts.js');
      //     cache.add('/unsentest/pages/add/styles.css');
      //     cache.add('/unsentest/pages/list/index.html');
      //     cache.add('/unsentest/pages/list/scripts.js');
      //     cache.add('/unsentest/pages/list/styles.css');
      //     cache.add('/unsentest/js/database.js');
      //     cache.add('/unsentest/js/scripts.js');
      //     cache.add('/unsentest/images/icon.png');
      //     cache.add('/unsentest/icons');
      //     cache.add('/unsentest/css/styles.css');


      // })



      ]);
    })
  );


});


/**
 * On Activate Event
 * Triggered when the service worker is activated
 */
self.addEventListener('activate', function (event) {
  event.waitUntil(clients.claim());
  clients.matchAll().then((matchedClients)=>{
    console.log('matchedClients', matchedClients);
    matchedClients.forEach((client)=>{
      console.log('client',client);
      client.postMessage('My client');
    })
  });
});


/**
 * On Fetch Event
 * Triggered when the service worker retrieves an asset
 */


self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.open(mycaches)
    .then(function (cache){
      return cache.match(event.request)
      .then(function (cachedResponse){
        const fetchedResponse = fetch(event.request)
        .then(function (networkResponse){
          if(event.request.method === 'GET'){
            cache.put(
              event.request,
              networkResponse.clone()
            );
          }
         
          return networkResponse;
        });
        return cachedResponse || fetchedResponse;
      })
    })
  )
})





// self.addEventListener('sync',(event)=>{
//   console.log('SW background sync: ', event);
// switch(event.tag){
//   case 'add-user':
//     Mydatabase.Mydatabase_IndexedDB.getAll().then((Users)=>{
    
//       console.log('Users',Users);
//       Users.forEach((User)=>{
//         Mydatabase.Mydatabase_Firebase.add(User.userName,User.userAge,User.userProvice,User.userGender,User.userAgreement)
//         .then(()=>{
//           Mydatabase.Mydatabase_IndexedDB.delete(User);
//         })
//         .catch(()=>{
  
//         })
//       })
  
//     })
//         break;
// }
// })



self.addEventListener('notificationclick', (event)=>{
  console.log('notification received',event);
  event.waitUntil(
    clients.openWindow('/unsentest/pages/add/')
  )
})

self.addEventListener('push',(event)=>{
  console.log('push event', event,event.data);
  const data= event.data.text();
  console.log('push data: ',data);

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.description,
      icon:data.image
    })
  );

 });
// self.addEventListener('pushsubscriptionchange', function(event) {
//   event.waitUntil(
//     fetch('https://pushpad.xyz/pushsubscriptionchange', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         old_endpoint: event.oldSubscription ? event.oldSubscription.endpoint : null,
//         new_endpoint: event.newSubscription ? event.newSubscription.endpoint : null,
//         new_p256dh: event.newSubscription ? event.newSubscription.toJSON().keys.p256dh : null,
//         new_auth: event.newSubscription ? event.newSubscription.toJSON().keys.auth : null
//       })
//     })
//   );
// });