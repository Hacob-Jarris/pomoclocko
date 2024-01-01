let countdown;
let minutes;
let i = 1;
let breaking = false;
let studying = false;
let pause = false;
//start with zero values
document.getElementById('hours').value = pad(0);
document.getElementById('minutes').value = pad(0);
document.getElementById('seconds').value = pad(0);

let breakMinutes = document.getElementById("breakMin");
let studyMinutes = document.getElementById("studyMin");



function getSeconds() {
    let hours = 0;
    let seconds = 0;

    //account for unnacceptable input
    if (isNaN(hours) || hours < 0) {hours = 0;}
    if (isNaN(minutes) || minutes < 0) {minutes = 0;}
    if (isNaN(seconds) || seconds < 0) {seconds = 0;}

    //get values from timer text boxes, change string to integer
    hours = parseInt (document.getElementById('hours').value, 10);
    minutes = parseInt (document.getElementById('minutes').value, 10);
    seconds = parseInt (document.getElementById('seconds').value, 10);
 
    //convert to seconds
    return hours * 3600 + minutes * 60 + seconds;
}

function startCountdown() { //Hours, minutes, seconds, break boolean, study boolean
    //stop alarm sound
    alarm.pause();

    //clear previous countdown
    if (countdown) {
        clearInterval(countdown);
    }

    let totalSeconds = getSeconds();
    console.log(totalSeconds);

    let first = true;
    if (totalSeconds != 0) {
    //decrement and display time each second using setInterval()
        countdown = setInterval(function() {

            if (first && totalSeconds == 0) {
                playAlarm();
                setTimeout(function() {
                    alert("time's up");
                    alarm.pause();
                }, 4000); 
                first = false;
            }
            
            if (pause) { 
                console.log("pause"); 
                clearInterval(countdown); 
            }
            
            //convert back to hours, minutes, seconds for displaying
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
        
            
            //display time in text boxes
            document.getElementById('hours').value = pad(hours);
            document.getElementById('minutes').value = pad(minutes);
            document.getElementById('seconds').value = pad(seconds);

            //decrement seconds
            if (totalSeconds != 0) { totalSeconds--; }

        }, 1000);//1 second delay

    }
}

function setBreak() {
    breaking = true;

    minutes = breakMinutes.value;
    if (countdown) { clearInterval(countdown); }

    //display break time
    document.getElementById('hours').value = pad(0);
    document.getElementById('minutes').value = pad(minutes);
    document.getElementById('seconds').value = pad(0);
}

function setStudy() {
    studying = true;
    minutes = studyMinutes.value;
    if (countdown) { clearInterval(countdown); }

    //display study time
    document.getElementById('hours').value = pad(0);
    document.getElementById('minutes').value = pad(minutes);
    document.getElementById('seconds').value = pad(0);   
}

function reset() {
    document.getElementById('hours').value = '00';
    document.getElementById('minutes').value = '00';
    document.getElementById('seconds').value = '00';
    startCountdown();
}

//returns a string to be displayed
function pad(value) {

    //avoid - being displayed when scrolling to set
    if (value < 1 && value !== 0) {
        return '00';
    }
    //adds a zero if numer under 10
    return value < 10 ? '0' + value : value;
}

let initialWorkingSeconds = 0;


function pressed(a) {
    //change to pressed image
    document.getElementById('background-image').src = a;
    setTimeout(function() {
        document.getElementById('background-image').src = "assets/images/clock2.png";
    }, 300);

    //save inital break or study time or pause if countdown is running
    if (breaking) {
        breaking = false; 
        if (pause) { pause = false; }
    } else if (studying){
        studying = false;
        initialWorkingSeconds = getSeconds();
        console.log(initialWorkingSeconds);
        if (pause) { pause = false; }
    } else {
        if (!pause) {
            pause = true;
        } else {
            pause = false;
        }
    }

    
}

function setSession() {

}

function playClick() {
    let click = document.getElementById('click');
    click.volume=.03;
    click.play();
}

function playAlarm() {
    let alarm = new Audio('assets/sounds/-169440.mp3');
    alarm.volume = .03;
    alarm.play();
}

//getting time and adding event listeners
let hoursInputElement = document.getElementById('hours');
let minutesInputElement = document.getElementById('minutes');
let secondsInputElement = document.getElementById('seconds');

hoursInputElement.addEventListener("wheel", handleWheelEvent);
minutesInputElement.addEventListener("wheel", handleWheelEvent);
secondsInputElement.addEventListener("wheel", handleWheelEvent);

//scroll to change time:
function handleWheelEvent(event) {
  event.preventDefault();

  const inputElement = event.currentTarget;
  const delta = -Math.sign(event.deltaY);
  const currentValue = parseFloat(inputElement.value) || 0;
  const newValue = currentValue + delta;

  inputElement.value = pad(newValue);
}


//accordion menu
let acc = document.getElementsByClassName("accordion");
let j;

for (j = 0; j < acc.length; j++) {
    acc[j].addEventListener("click", function() {
        this.classList.toggle("active");

        let panel = this.nextElementSibling;

        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}

//help button
document.getElementById("help").addEventListener("click", function() {
    let helpText = document.getElementById("helpText");
    helpText.style.display = (helpText.style.display === 'none' || helpText.style.display === '')  ? 'block' : 'none';
});

let helpButton = document.getElementById("help");
let helpText = document.getElementById("helpText");

helpButton.addEventListener("click", function() {
    helpText.classList.toggle('visible');
});