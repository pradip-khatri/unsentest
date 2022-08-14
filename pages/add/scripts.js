
import Mydatabase from '../../js/database.js';
const mydatabase = new Mydatabase();
console.log('mydatabases', mydatabase);



document.getElementById('add-button').addEventListener('click', addUser);
function addUser(){
    const userName = document.getElementById('user-name').value;
    const userAge = document.getElementById('user-age').value;
    const userProvince = document.getElementById('user-province').value;
    const userGender = document.getElementById('user-gender').value;
    const userAgreement = document.getElementById('agreetosend').checked;

    if('serviceWorker' in navigator){
        navigator.serviceWorker.ready
        .then((registration)=>{
            const controller = registration.active;
            controller.postMessage('from add page');
            if (registration.sync){
                registration.sync.register('mytag')
                .then(()=>{
                    console.log('tag registered');
                });
                registration.sync.getTags().then((tags)=>{
                    console.log('Tags', tags);
                });
            }
        });
    }
console.log(userAge,userAgreement,userName,userGender,userProvince);
mydatabase.add(userName,userAge,userProvince,userGender,userAgreement)
.then((event)=>{
    document.getElementById('user-add-success').style.display = 'block';
    console.log('success adding',event);
})
.catch((errorMessage)=>{
    document.getElementById('user-add-failed').style.display = 'block';

    console.log('Failed to add',errorMessage);
})
;

}


navigator.serviceWorker.addEventListener('message', (message)=>{
    console.log('in add page', message);
})