//importing needed functions from respective software dev kit (SDK)
//import { service getter functions } from "CDN URL";
import { initializeApp, getApps} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signOut, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

//firebase config from firebase console
const config = {
    apiKey: "AIzaSyDRh9xsD28lcqbKySQGMUg8r4-7ohdyUDI",
    authDomain: "pomoclocko.firebaseapp.com",
    databaseURL: "https://pomoclocko-default-rtdb.firebaseio.com",
    projectId: "pomoclocko",
    storageBucket: "pomoclocko.appspot.com",
    messagingSenderId: "972146150409",
    appId: "1:972146150409:web:c49966cc26e50a18397cd8",
    measurementId: "G-QE9HYP56J8"
};

//initializing firebase
const firebaseApp = initializeApp(config);

//initialize and get reference for services using imported service getter functions
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

//get auth status of user
onAuthStateChanged(auth, (user) => {
    if(user != null) {
        console.log('user logged in as ' + user.email);
        document.getElementById('auth-status').innerHTML = `logged in as `;

        document.getElementById('email-status').innerHTML = user.email;

        //hide sign in/ login button, show sign out button
        document.getElementById('register').style.display = 'none';
        document.getElementById('sign-out').style.display = 'inline-flex';

        const uid = user.uid;
        console.log('userid: ' + uid);
        addOrUpdateUser(uid);
    } else { 
        console.log('not logged in');
        document.getElementById('auth-status').innerHTML = `(not logged in)`
    }
});

//make user document in firstore db if it doesn't exist

let todoDocRef;
let userid;

//make sure there is a user in firestore db

async function addOrUpdateUser(uid) {
    try {
        userid = uid; 

        //reference document named uid
        const userDocRef = doc(db, 'users', uid);

        //ensure existence of or create user document
        await setDoc(userDocRef, {userid: uid});

        //reference to todos subcollection within the userID document
        const todoColRef = collection(userDocRef, 'todosSubCollection');

        todoDocRef = doc(todoColRef, 'todosDocument');
        //ensure existence of or create todos subcollection
        await setDoc(todoDocRef, todoTaskList);
       
    } catch (error) {
        console.log('error adding or updating user: ', error);
    }
}

//hierarchy: db > users collection > userid document > todos subcollection


//google auth
let provider = new GoogleAuthProvider();
document.getElementById('google-login').addEventListener('click', () => {
    signInWithPopup(auth, provider)
    .then((result) => {
        document.getElementById('auth-container').style.display = 'none';
        const credential = GoogleAuthProvider.credentialFromResult(result);

        if (credential) {
            const user = result.user;
            const token = credential.accessToken;
        } else {
            console.log("No credential available in the result.");
        }
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
    });
});

//email sign up form event listener
document.getElementById('sign-up-form').addEventListener('submit', (event) => {
    event.preventDefault('signup');

    validateForm('signup');

    //get email, password
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
   
    //make new user with the email and password
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            //singed in
            let user = userCredential.user;
            console.log('user created: ' + user.email);
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode, errorMessage);
            console.log(user);

            alertAuthErrorMessage(errorMessage);
        });
});

//email login form event listener
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    validateForm('login');

    let email = document.getElementById('login-email').value;
    let password = document.getElementById('login-password').value;
 
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            console.log(user);
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode, errorMessage);

            alertAuthErrorMessage(errorMessage);
        });
 });

 function alertAuthErrorMessage(message) {

    let parts = message.split('auth/');
    message = parts[1].replace(')', '');
    message = message.replace('.', '');
    message = message.replace('-', ' ');

    alert(message);
 }

document.getElementById('login').addEventListener('click', () => {
    document.getElementById('login-form').style.display = 'flex';
    document.getElementById('sign-up-form').style.display = 'none';
    document.getElementById('sign-up').style.background = 'none';
    document.getElementById('login').style.background = 'rgb(116, 116, 116)';    
});

document.getElementById('sign-up').addEventListener('click', () => {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('sign-up-form').style.display = 'flex';
    document.getElementById('login').style.background = 'none';
    document.getElementById('sign-up').style.background = 'rgb(116, 116, 116)';
});

document.getElementById('sign-out').addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log('signed out user');
        document.getElementById('register').style.display = 'inline-flex';
        document.getElementById('sign-out').style.display = 'none';

    }).catch((error) => {
        console.log('couldnt sign out user', error)
    });
});

//check email and password format and add to valid/invalid classlists
function validateForm(formType) {
    
    if (formType === 'login') {
        let password = document.getElementById('login-password');
        resetClassList(password);
        let email = document.getElementById('login-email');
        resetClassList(email);

        if(!validateEmail(email.value)) {
            email.classList.add('invalid');
        } else {
            email.classList.add('valid');
        }

        if(password.value.length < 6) {
            password.classList.add('invalid')
        } else {
            password.classList.add('valid');
        }
    } else if (formType === 'signup') {
        let password = document.getElementById('password'); 
        resetClassList(password);

        let passwordCheck = document.getElementById('password-check');
        resetClassList(passwordCheck);

        let email = document.getElementById('email');
        resetClassList(email);
        
        if(!validateEmail(email.value)) {
            email.classList.add('invalid');
        } else {
            email.classList.add('valid');
        }
        if(password.value !== passwordCheck.value || password.value < 6) {
            password.classList.add('invalid');
            passwordCheck.classList.add('invalid');
            return;
        } else if (password.value.length < 6) {
            alert('password must be at least 6 characters');
            return;
        } else {
            password.classList.add('valid');
            passwordCheck.classList.add('valid');
        }
    }
}

function resetClassList(element) {
    element.classList.remove('invalid');
    element.classList.remove('valid');
}

//check email format
function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

//password toggle
document.querySelectorAll('.toggle-eye').forEach((toggleEye) => {
    toggleEye.addEventListener('mousedown', (event) => {
        console.log('wawa');
        // Get the input element preceding the clicked element
        const inputElement = toggleEye.previousElementSibling;

        // Check if the input element exists and if its type is 'password'
        if (inputElement && inputElement.type === 'password') {
            inputElement.type = 'text';
            toggleEye.innerHTML = '<i class="fa-regular fa-eye"></i>';
        } else if (inputElement && inputElement.type === 'text') {
            inputElement.type = 'password';
            toggleEye.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
        }
    });
});


//background color picker 
let colorPicker = document.getElementById('color-picker');
colorPicker.addEventListener('input', function () {
    document.body.style.backgroundColor = colorPicker.value;
});

//todo list
const form = document.getElementById("new-task-form");
const input = document.getElementById("new-task-input");
const listElement = document.getElementById("tasks");

//event listener for task form submit
form.addEventListener("submit", (e) => {
    e.preventDefault();

    //get task
    const task = input.value;
    console.log('task entered: ' + task);

    //add task to todo list
    addTodoTask(task);

    // addToLocalStorage(key, task);
});

let todoTaskList = {};
let taskNum =  0;

async function addTodoTask(task) {

    if (task === "" || task === null) {
        console.log('not adding empty task');
        return;
    }

    //add task to todoTaskList object with key task#
    const taskKey = 'task' + taskNum;
    todoTaskList[taskKey] = task;
    taskNum++;

    //update the todo list document with the new task
    await setDoc(todoDocRef, todoTaskList);

    console.log(todoTaskList);

    //create task div
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");

    //create content div
    const taskContentElement = document.createElement("div");
    taskContentElement.classList.add("content");

    //set content div as child of task div
    taskElement.appendChild(taskContentElement);

    //create input element with inputted text as an input element for future editing
    const taskInputElement = document.createElement("input");
    taskInputElement.classList.add("text");
    //attributes
    taskInputElement.type = "text";
    taskInputElement.value = task;
    taskInputElement.setAttribute("readonly", "readonly");

    //set input as child of content div
    taskContentElement.appendChild(taskInputElement);

    //create actions div for edit and delete
    const taskActionsElement = document.createElement("div");
    taskActionsElement.classList.add("actions");
    
    //edit button
    const taskEditElement = document.createElement("button");
    taskEditElement.classList.add("edit");
    taskEditElement.innerText = "Edit";

    //delete button
    const taskDeleteElement = document.createElement("button");
    taskDeleteElement.classList.add("delete");
    //checkmark icon for deleting task
    const icon = document.createElement("i");
    icon.className = "fa fa-check";
    taskDeleteElement.appendChild(icon);

    //set edit and delete buttons as children of actions div
    taskActionsElement.appendChild(taskEditElement);
    taskActionsElement.appendChild(taskDeleteElement);

    //set actinos div as child of task div
    taskElement.appendChild(taskActionsElement);

    //set task div as child of list div
    listElement.appendChild(taskElement);

    //reset input value
    input.value = "";

    taskEditElement.addEventListener("click", (e) => {
        if (taskEditElement.innerText.toLowerCase() == "edit") {
            taskEditElement.innerText = "Save";
            taskInputElement.removeAttribute("readonly");
            taskInputElement.focus();

        } else {
            taskEditElement.innerText = "Edit";
            taskInputElement.setAttribute("readonly", "readonly");
        }
    });

    taskDeleteElement.addEventListener("click", (e) => {
        listElement.removeChild(taskElement);
        // localStorage.removeItem(key);
        // console.log(key + 'removed from local storage');
        console.log('removing task: ' + task);
    });
}

//set color picker value to background color. saves on page refresh
document.addEventListener('DOMContentLoaded', () => {
    let colorPicker = document.getElementById('color-picker');
    //set default color picker value
    if(colorPicker.value === '#000000') { colorPicker.value = '#194d33'; }
    document.body.style.backgroundColor = colorPicker.value;
})

//begin with zero values in clock
document.getElementById('hours').value = '00';
document.getElementById('minutes').value = '00';
document.getElementById('seconds').value = '00';

//global variables
let countdown, minutes;
let breaking, studying, pause = false;
let breakMinutes = document.getElementById("breakMin");
let studyMinutes = document.getElementById("studyMin");

//get total seconds from clock input boxes
function getSeconds() {
    //get values from clock input boxes or zero if values are invalid
    let hours = parseInt(document.getElementById('hours').value, 10) || 0;
    let minutes = parseInt(document.getElementById('minutes').value, 10) || 0;
    let seconds = parseInt(document.getElementById('seconds').value, 10) || 0;

    //convert to seconds
    return hours * 3600 + minutes * 60 + seconds;
}

//for play/pause
let functionRunning = false;

//start a countdown when the top button is clicked
function startCountdown() { 
    functionRunning = true;

    //clear previous running countdown
    if (countdown) {
        clearInterval(countdown);
    }

    //get current total seconds
    let totalSeconds = getSeconds();
    console.log(totalSeconds);

    //????
    let first = true;
    
    if (totalSeconds != 0) {
        //decrement and display time each second using setInterval()
        countdown = setInterval(function() {

            //play alarm for 4 seconds if time is up
            if (first && totalSeconds == 0) {
                playAlarm();
                setTimeout(function() {
                    alert("time's up");
                    alarm.pause();
                    pause = true;
                }, 4000); 
                first = false;
            }
            
            //cancel countdown with clearInterval()
            if (pause) { 
                console.log("pause"); 
                clearInterval(countdown); 
            }
            
            //convert seconds to hours, minutes, seconds for displaying
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
        
            //display in text boxes
            document.getElementById('hours').value = pad(hours);
            document.getElementById('minutes').value = pad(minutes);
            document.getElementById('seconds').value = pad(seconds);

            //decrement seconds
            if (totalSeconds != 0) { totalSeconds--; }

        }, 1000);//1 second delay

    }
}
functionRunning = false;

//display inputted break time on break button press
document.getElementById('break').addEventListener('click', () => {
    breaking = true;
    minutes = breakMinutes.value;
    if (countdown) { clearInterval(countdown); }

    //display break time
    document.getElementById('hours').value = pad(0);
    document.getElementById('minutes').value = pad(minutes);
    document.getElementById('seconds').value = pad(0);
   
});

//display inputted study time on study button press
document.getElementById('study').addEventListener('click', () => {
    studying = true;
    minutes = studyMinutes.value;
    if (countdown) { clearInterval(countdown); }

    //display study time
    document.getElementById('hours').value = pad(0);
    document.getElementById('minutes').value = pad(minutes);
    document.getElementById('seconds').value = pad(0);   
    
});

//reset clock to zero and start countdown to clear running countdown
document.getElementById('reset').addEventListener('click', () => {
    document.getElementById('hours').value = '00';
    document.getElementById('minutes').value = '00';
    document.getElementById('seconds').value = '00';
    startCountdown();
    pause = true;
});

//return formatted string to be displayed
function pad(value) {
    //avoid '-' being displayed when scrolling to set
    if (value < 1 && value !== 0) {
        return '00';
    }
    //add a zero before number under 10
    return value < 10 ? '0' + value : value;
}

let initialWorkingSeconds = 0;
//start or pause the countdown when top button is clicked
document.getElementById('startpause').addEventListener('click', () => {
    //save inital break or study time or pause if countdown is running
    //ISSUE: doesn't play when pressed once if reset and values changed
    if (breaking) {
        breaking = false; 
        if (pause) { pause = false; }
    } else if (studying){
        studying = false;
        initialWorkingSeconds = getSeconds();
        console.log(initialWorkingSeconds);
        if (pause) { pause = false; }
    } else {
        if (!pause && functionRunning) {
            pause = true;
        } else {
            pause = false;
        }
    }
    
    startCountdown();
    
    //change to pressed button image for .3 seconds
    document.getElementById('background-image').src = 'assets/images/pressed.png';
    document.getElementById('startpause').style.color = 'transparent';

    setTimeout(function() {
        document.getElementById('startpause').style.color = 'white';

        document.getElementById('background-image').src = "assets/images/clock2.png";
    }, 1300);

});

//play alarm
function playAlarm() {
    let alarm = new Audio('assets/sounds/-169440.mp3');
    alarm.volume = .03;
    alarm.play();
}

//add event listeners to each text box for scrolling to change time
const hoursInputElement = document.getElementById('hours');
const minutesInputElement = document.getElementById('minutes');
const secondsInputElement = document.getElementById('seconds');
hoursInputElement.addEventListener("wheel", handleWheelEvent);
minutesInputElement.addEventListener("wheel", handleWheelEvent);
secondsInputElement.addEventListener("wheel", handleWheelEvent);

//scroll to change time:
function handleWheelEvent(event) {
  event.preventDefault();

  //get current value of input element and change it by delta
  const inputElement = event.currentTarget;
  const delta = -Math.sign(event.deltaY);
  const currentValue = parseFloat(inputElement.value) || 0;
  const newValue = currentValue + delta;

  //format and set new value with pad()
  inputElement.value = pad(newValue);
}

//open menu on menu button press
document.getElementById('menu-button').addEventListener('click', () => {
    let panel = document.getElementById("menu");
    blockToggleOpen(panel);
});

//open login on login button press
document.getElementById('register').addEventListener('click', () => {
    let loginMenu = document.getElementById("auth-container");
    flexToggleOpen(loginMenu);
    document.getElementById("menu").style.display = "none";
});

//help button
document.getElementById('help-button').addEventListener('click', () => {
    let helpText = document.getElementById("help-text");
    blockToggleOpen(helpText);    
});

document.getElementById('todo-list').addEventListener('click', () => {
    let todoList = document.querySelector('.todo-container');
    flexToggleOpen(todoList);
})

//open whatever button opens if not open already
function blockToggleOpen(a) {
    if (a.style.display === "block") {
        a.style.display = "none";
    } else {
        a.style.display = "block";
    }
};

function flexToggleOpen(a) {
    if (a.style.display === "flex") {
        a.style.display = "none";
    } else {
        a.style.display = "flex";
    }
}

//login menu close (X) button 
document.querySelectorAll('.exit').forEach((button) => {
    button.addEventListener('click', () => {
 
        let parentElement = button.closest(".todo-container");
        if(parentElement) {
            button.parentElement.style.display = "none";
            console.log(";lkasdjf;lkasjd;lfkjasd;lkjas");
        } else {
            document.getElementById("auth-container").style.display = "none";
            document.getElementById('login-form').style.display = "none";
            document.getElementById('sign-up-form').style.display = "none";   
        }
    });
 });

