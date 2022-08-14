import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";
import { _registerComponent, registerVersion, _getProvider, getApp, _removeServiceInstance, SDK_VERSION } from 'https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js';

import { getFirestore, collection, addDoc, deleteDoc, getDocs, query, where, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-firestore.js";


export  class Mydatabase_Firebase {
    constructor() {
        // TODO: Add SDKs for Firebase products that you want to use
        // https://firebase.google.com/docs/web/setup#available-libraries

        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyDfRHVynUFkXkvg6ZntkT9Rldy9nX2Hig0",
            authDomain: "finalproject-fd64a.firebaseapp.com",
            projectId: "finalproject-fd64a",
            storageBucket: "finalproject-fd64a.appspot.com",
            messagingSenderId: "212468577008",
            appId: "1:212468577008:web:c20dc16c7ca77429324835"
          };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        console.log('App:', app);
        this.db = getFirestore(app);
        console.log('mydb', this.db)

    }
    add(userName,userAge,userProvince,userGender,userAgreement) {

        const dbCollection = collection(this.db, "Users");
        console.log("collection", dbCollection)
        return addDoc(dbCollection, {
            userName:userName,
            userAge:userAge,
            userProvince:userProvince,
            userGender:userGender,
            userAgreement:userAgreement
        })

        ;
    }
    saveSubscription(subscription){
        const dbCollection = collection(this.db,"subscription");
        return addDoc(dbCollection,{
            subscription:JSON.stringify(subscription)
        });
    }
    get(userProvince) {
        return new Promise((resolve, reject) => {
            const dbCollection = collection(this.db, "User");
            const dbQuery = query(dbCollection, where("userProvince", "==", userProvince));
            getDocs(dbQuery)
                .then((querySnapshot) => {
                    const results = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        results.push({
                            
                            userName: data.userName,
                            userAge: data.userAge,
                            userProvince: data.userProvince,  
                            userGender: data.userGender,
                            userAgreement: data.userAgreement
                        });
                    });
                    resolve(results);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    getAll() {
        return new Promise((resolve, reject) => {
            getDocs(collection(this.db, "User"))
                .then((querySnapshot) => {
                    const results = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        console.log(doc.id, data);
                        results.push({
                            
                            userName: data.userName,
                            userAge: data.userAge,
                            userProvince: data.userProvince,  
                            userGender: data.userGender,
                            userAgreement: data.userAgreement
                        });

                    });
                    resolve(results);
                })
                .catch((error) => {
                    reject(error);
                });
        });

    }
    update(User, userAgreement) {
        console.log('update: ', User);
        return new Promise((resolve, reject) => {
            const dbDoc = doc(this.db, "User", User.id);
            updateDoc(dbDoc, {
                    userAgreement: userAgreement
                })
                .then(() => {
                    User.userAgreement = userAgreement;
                    resolve(User);
                })
                .catch((error) => {
                    reject(error);

                });
        });
    }
    delete(User) {
        const dbDoc = doc(this.db, "User", User.id);
        return deleteDoc(dbDoc);
    }

}




export  class Mydatabase_IndexedDB{
    constructor(){
        console.log('my db');
        const request = indexedDB.open('myDatabase', 1);
        request.onsuccess = (event)=>{
            console.log('open success:',event)
            this.db = event.target.result;
        };
        request.onerror= (event)=>{
            console.log('open error: ', event.target.error.message);
        }
        request.onupgradeneeded = event=>{
            const db = event.target.result;
            console.log(db);

            const objectStore = db.createObjectStore('Users', {keyPath:'id'});
            console.log(objectStore);
            objectStore.createIndex('userProvince','userProvince',{unique:false});
        };
    }
    
    add(userName,userAge,userProvince,userGender,userAgreement){
        //console.log(userAge,userAgreement,userName,userGender,userProvince);
        
        return new Promise((resolve,reject)=>{
            
            const transaction = this.db.transaction(['Users'],'readwrite');
            const objectStore = transaction.objectStore("Users");
           const request= objectStore.add({
            id:Date.now(),
            userName:userName,
            userAge:userAge,
            userProvince:userProvince,
            userGender:userGender,
            userAgreement:userAgreement
           });
            request.onsuccess = (event)=>{
                resolve(event);
            };
            request.onerror= (event)=>{
                console.log('Add error: ', event.target.error.message);
                reject(event.target.error.message);
            }

        })
     
    }
    getAll(){
        return new Promise((resolve, reject)=>{
            const request = this.db
            .transaction(['Users'])
            .objectStore('Users')
            .getAll();

        //console.log('my request',request);

        request.onsuccess = (event)=>{
                console.log('Get all success:',event.target.result);
                resolve(event.target.result);
            };
        request.onerror= (event)=>{
                console.log('Get All error: ', event.target.error.message);
                reject(event.target.error.message);
            }

        });

     
    }
    get(userProvince){
        console.log('get from single, ',userProvince);
        return new Promise((resolve, reject)=>{
            const request = this.db
            .transaction(['Users'],'readwrite')
            .objectStore("Users")
            .index('userProvince')
            .getAll(userProvince);
     

        request.onsuccess = (event)=>{
                console.log('Get single item success:',event.target.result);
                resolve(event.target.result);
            };
        request.onerror= (event)=>{
                console.log('Get single item error: ', event.target.error.message);
                reject(event.target.error.message);
            }

        });


    }
    update(User,userAgreement){
        console.log('my agreement',userAgreement);
        return new Promise((resolve,reject)=>{
            User.userAgreement = userAgreement;
            const request = this.db
        .transaction(['Users'],"readwrite")
        .objectStore('Users')
        .put(User);


        request.onsuccess = (event)=>{
            console.log('update success:',event.target.result);
            resolve(User);
        };
         request.onerror= (event)=>{
            console.log('update error: ', event.target.error.message);
            reject(event.target.error.message);
        }

       });

     
    
    

    }
    delete(User){
        console.log('delete exec',User)
        return new Promise((resolve, reject)=>{
            const request = this.db
                .transaction(['Users'], 'readwrite')
                .objectStore('Users')
                .delete(User.id);

                request.onsuccess = (event)=>{
                    resolve();
                };
                 request.onerror= (event)=>{
                    reject(event.target.error.message);
                }
        
               });

        

    }
}

export default class Mydatabase {
    constructor(){
        this.dbOnline = new Mydatabase_Firebase();
        this.dbOffline = new Mydatabase_IndexedDB();

        this.hasSync = false;
        this.swController = null;
        this.swRegistration = null;
        
        
        if('serviceWorker' in navigator){
            navigator.serviceWorker.ready
            .then((registration) =>{
                if(registration.active && registration.sync){
                    this.hasSync = true;
                    this.swController = registration.active;
                    this.swRegistration = registration;
                    //

                }
            });
        }
    }

    add(userName,userAge,userProvince,userGender,userAgreement){
        console.log(navigator.online)
        if(navigator.online){
            return this.dbOnline.add(userName,userAge,userProvince,userGender,userAgreement);
        }
        
            console.log('offline')
           // this.swRegistration.sync.register('add-user');

            return this.dbOffline.add(userName,userAge,userProvince,userGender,userAgreement);
    }
    saveSubscription(subscription){
        return this.dbOnline.saveSubscription(subscription);
    }
    
    getAll(){
        if(navigator.online){
            return this.dbOnline.getAll()
        }
     
            return this.dbOffline.getAll()
        
    }
    get(userProvince) {
        if(navigator.online){
            return this.dbOnline.get(userProvince)
        }
        
            return this.dbOffline.get(userProvince)
        
    }
    update(User,userAgreement){
        if(navigator.online){
            return this.dbOnline.update(User,userAgreement)
        }
        
            return this.dbOffline.update(User,userAgreement)
        
    }
    delete(User){
        if(navigator.online){
            return this.dbOnline.delete(User)
        }
  
          
            return this.dbOffline.delete(User)
        
    }
}