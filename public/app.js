//importing needed functions from respective software dev kit (SDK)
//import { <service getter functions> } from "<content delivery network (CDN) URL>";
import { initializeApp, getApps} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

//firebase config for this web app (from firebase console)
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

//initializing firebase app instance
let firebaseApp;
if(!getApps().length) {
    firebaseApp = initializeApp(config);
}else {
    firebaseApp = getApps();
}

//set auth and firestore objects to a variable
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

//get auth status of user
onAuthStateChanged(auth, (user) => {
    if(user != null) {
        console.log('logged in as ' + user.email);
    } else { 
        console.log('not logged in');
    }
});

//working google login/ registerp
let provider = new GoogleAuthProvider();
document.getElementById('google-login').addEventListener('click', () => {
    signInWithPopup(auth, provider)
    .then(function(result) {
        //google access token to access Google API.
        let token = result.credential.accessToken;
        //current user set to user object from promise resolution of signInWithPopup 
        let user = result.user;
        //stuff i might need to do with user later goes here-----------------------


    //catch errors and alert user
    // }).catch(function(error) {
    //     //firebase error codes to identify error
    //     switch (error.code) {
    //         case 'auth/popup-closed-by-user':
    //             alert('The popup was closed by the user. Please try again.');
    //             break;
    //         case 'auth/popup-blocked':
    //             alert('The popup was blocked by the browser. Please enable popups for this site.');
    //             break;
    //         default:
    //             alert('An unknown error occurred. Please try again.');
    //     }
    });
});

//register form
document.getElementById('sign-up-form').addEventListener('submit', (event) => {
    //prevent page refresh
    event.preventDefault();

    //get email, password
    const email = document.getElementById('email').value;
    console.log(email);
    const password = document.getElementById('password').value;
   
    //
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            //singed in
            let user = userCredential.user;
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode, errorMessage);
            alert(errorMessage);
        });
});

//email login form
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
 
    let email = document.getElementById('login-email').value;
    let password = document.getElementById('login-password').value;
 
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            let user = userCredential.user;
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode, errorMessage);
            alert(errorMessage);
        });
 });


document.getElementById('login').addEventListener('click', () => {
    //display login form, hide sign up form
    document.getElementById('sign-up-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'flex';
    document.getElementById('sign-up').style.background = 'none';
    document.getElementById('login').style.background = 'rgb(105, 66, 47)';

});

document.getElementById('sign-up').addEventListener('click', () => {
    //display sign-up form, hide login form
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('sign-up-form').style.display = 'flex';

    document.getElementById('login').style.background = 'none';
    document.getElementById('sign-up').style.background = 'rgb(105, 66, 47)';


});

//background color picker 
let colorPicker = document.getElementById('color-picker');
colorPicker.addEventListener('input', function () {
    console.log('in here');
    document.body.style.backgroundColor = colorPicker.value;
});
  

//todo list
const form = document.getElementById("new-task-form");
const input = document.getElementById("new-task-input");
const listElement = document.getElementById("tasks");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const task = input.value;

    //create task div
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");

    //create content div, append task to it
    const taskContentElement = document.createElement("div");
    taskContentElement.classList.add("content");

    taskElement.appendChild(taskContentElement);

    //create task input element to allow for edit, append to content div
    const taskInputElement = document.createElement("input");
    taskInputElement.classList.add("text");
    taskInputElement.type = "text";
    taskInputElement.value = task;
    taskInputElement.setAttribute("readonly", "readonly");

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
    const icon = document.createElement("i");
    icon.className = "fa fa-check";
    taskDeleteElement.appendChild(icon);

    taskActionsElement.appendChild(taskEditElement);
    taskActionsElement.appendChild(taskDeleteElement);

    taskElement.appendChild(taskActionsElement);

    listElement.appendChild(taskElement);

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
    })
})

//add todos to firestore db

//get new task and 
const inputForm = document.getElementById("new-task-form")
let date = new Date();
let time = date.getTime();
let counter = time;

inputForm.addEventListener('submit', e => {
    e.preventDefault();

    const todos = inputForm['new-task-input'].value;
    console.log(todos);

    let id = counter += 1;
    inputForm.reset();

    //if user is logged in, add todos to firestore
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, {
          id: "_" + id,
          todos
        }).then(() => {
          console.log('todo added');
        }).catch((error) => {
        //   console.log(error.message);
        //   alert(error.message); //!!security issues, try real account next
        })
      } else {
        console.log('user is not signed in to add todos');
      }
    })
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
    breaking = t 
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
    setTimeout(function() {
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
document.getElementById('login/sign-up').addEventListener('click', () => {
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
        console.log("clicked");
 
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

