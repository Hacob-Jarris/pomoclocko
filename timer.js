let countdown;
let i = 0;

//declare global variables
let breakHours;
let breakMinutes = document.getElementById("breakMin");
let breakSeconds;

let studyHours;
let studyMinutes = document.getElementById("studyMin");
let studySeconds;

function startCountdown(mode) { //Hours, minutes, seconds, break boolean, study boolean

    

    let hours;
    let minutes;
    let seconds;

    let hoursInput = document.getElementById('hours');
    let minutesInput = document.getElementById('minutes');
    let secondsInput = document.getElementById('seconds');
    if (countdown) {
        clearInterval(countdown);
    }

    //Checks mode and whether some time is set
            //NEED TO DISPLAY MODE SOMEHOW

    if (mode === 'break') { //Break mode
        hours = 0;
        minutes = breakMinutes;
        seconds = 0;
    }else if (mode === 'study') { //Study mode
        hours = 0;
        minutes = studyMinutes.value;
        seconds = 0;
    } else {
        i++;
    }

    //account for unnacceptable input
    if (isNaN(hours) || hours < 0) {hours = 0;}

    if (isNaN(minutes) || minutes < 0) {minutes = 0;}

    if (isNaN(seconds) || seconds < 0) {seconds = 0;}
    
    //change time from string to int if set inside clock
    if (typeof mode === 'undefined') {
        hours = parseInt(hoursInput.value, 10);
        minutes = parseInt(minutesInput.value, 10);
        seconds = parseInt(secondsInput.value, 10);    
    }

    //convert time to seconds
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;

    //decrement and display time each second
    countdown = setInterval(function() {
        if (i%2 == 0) { return; } //For start/pause toggle
        
        //convert back to hours, minutes, seconds for displaying
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        //Display time in text boxes
        document.getElementById('hours').value = pad(hours);
        document.getElementById('minutes').value = pad(minutes);
        document.getElementById('seconds').value = pad(seconds);

        //Decrement seconds
        if (totalSeconds != 0) { totalSeconds--; }

    }, 1000);//1 second delay

}

function setBreak() {
       startCountdown('break');
}

function setStudy() {
    startCountdown('study');
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

function pressedImg(a) {
    document.getElementById('clockImg').src = a;
    setTimeout(function() {
        document.getElementById('clockImg').src = "internal/pixel-alarm-clock.png";
    }, 300);
}

function playClick() {
    let click = document.getElementById('click');
    click.volume=.1;
    click.play();
}
/*
function changeColor(clickedButton) {
    let button = document.querySelectorAll('.mode');

    button.forEach(function(button)) {
    clickedButton.classList.add("clicked");
}*/

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

  let inputElement = event.currentTarget;

  //change numeric value with scroll in +y direction
  let delta = -Math.sign(event.deltaY);
  let currentValue = parseFloat(inputElement.value) || 0;
  let newValue = currentValue + delta;

  inputElement.value = pad(newValue);
}


//accordion menu functionality
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