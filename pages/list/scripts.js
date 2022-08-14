
import Mydatabase from "../../js/database.js";
var mydatabase = new Mydatabase();
const output = document.getElementById('output');



document.getElementById('list-button').addEventListener('click', listDetails);
function listDetails(){
  const userProvince = document.getElementById('user-province').value;
  output.innerText = '';

  if(userProvince==''){
    mydatabase.getAll()
      .then((results)=>{
        console.log('Results: ', results);
        results.forEach((result)=>{
          appendUser(result);
        })
      })
      .catch((errorMessage)=>{
        console.log('Catch: ',errorMessage);
      });
  }else{
    mydatabase.get(userProvince)
      .then((results)=>{
        console.log("results from single item", results);
        results.forEach((result)=>{
          appendUser(result);
        })
      })
      .catch((errorMessage)=>{
        console.log('Sinle item catch error', errorMessage);
      })
    ;
  }

}
// const containerList = document.createElement('div');
// containerList.setAttribute('id', 'containerlist');
// const namelabel = document.createElement('label');
// const enternamebox = document.createElement('input');
// const agelabel = document.createElement('label');
// const enteragebox = document.createElement('input');
// const provincelabel = document.createElement('label');
// const enterprovincebox = document.createElement('input');
// const genderlabel = document.createElement('label');
// const entergenderbox = document.createElement('input');

// agelabel.textContent = "Age:"
// provincelabel.textContent = "Province"
// genderlabel.textContent ="Gender"
// namelabel.textContent = 'Name:'

// enternamebox.setAttribute('id','myname');
// enteragebox.setAttribute('id','myage');
// enterprovincebox.setAttribute('id','myprovince');
// entergenderbox.setAttribute('id','mygender');

// containerList.appendChild(namelabel);
// containerList.appendChild(enternamebox);
// containerList.appendChild(agelabel);
// containerList.appendChild(enteragebox);
// containerList.appendChild(provincelabel);
// containerList.appendChild(enterprovincebox);
// containerList.appendChild(genderlabel);
// containerList.appendChild(entergenderbox);



function appendUser(User) {
  console.log(User);

//const userAgreement = User.userAgreement ? 'True' : 'False';
  const userEle = document.createElement('div');
  userEle.className = "user-item";
  output.append(userEle);
  userEle.innerHTML = `
      <h3>Name: ${User.userName}</h3>
      <h3>Age: ${User.userAge}</h3>
      <h3>Province: ${User.userProvince}</h3>
      <h3>Gender: ${User.userGender}</h3>
      <h3>User Consent: ${User.userAgreement}</h3>
  
  `;

const userUpdateBtn = document.createElement('button');
  userUpdateBtn.setAttribute('id','updateBtnId');
  userUpdateBtn.innerText = 'Change user agreement';
  userEle.append(userUpdateBtn);

userUpdateBtn.addEventListener('click', ()=>{
  mydatabase.update(User, !User.userAgreement)
  .then((results)=>{
    console.log('update success: ', results);
    const userAgreement = User.userAgreement ? 'True' : 'False';
    userEle.innerHTML = `
    <h3>Name: ${User.userName}</h3>
    <h3>Age: ${User.userAge}</h3>
    <h3>Province: ${User.userProvince}</h3>
    <h3>Gender: ${User.userGender}</h3>
    <h3>User Consent: ${User.userAgreement}</h3>
    `;
  })
    .catch((errorMessage)=>{
    console.log('update error: ',errorMessage);
  })
});
 

  
const removeUser = document.createElement('button');
  userEle.append(removeUser);
  removeUser.innerText = 'Remove user from list';
   removeUser.addEventListener('click', () => {
  //   console.log(User);
       mydatabase.delete(User)
          .then(() => {
              userEle.remove();
          })
          .catch((errorMessage) => {
              console.log('Delete error', errorMessage);
          });
  
   });


 
     

}
