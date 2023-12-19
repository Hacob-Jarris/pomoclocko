let countdown;
let i = 0;

//declare global variables
let breakHours;
let breakMinutes;
let breakSeconds;

let studyHours;
let studyMinutes;
let studySeconds;

function startCountdown(mode) { //Hours, minutes, seconds, break boolean, study boolean
    i++;

    let hoursInput;
    let minutesInput;
    let secondsInput;
    
    //Checks mode and whether some time is set
    if (mode === 'break') { //Break mode
        hoursInput = breakHours;
        minutesInput = breakMinutes;
        secondsInput = breakSeconds;
        //NEED TO DISPLAY MODE SOMEHOW
    }else if (mode === 'study') { //Study mode
        hoursInput = studyHours;
        minutesInput = studyMinutes;
        secondsInput = studySeconds;

        console.log(hoursInput, studyMinutes, studySeconds);
        //NEED TO DISPLAY MODE SOMEHOW
    }else { //basic timer functionality
        hoursInput = document.getElementById('hours');
        minutesInput = document.getElementById('minutes');
        secondsInput = document.getElementById('seconds');
    }

    //Change time from string to int
    let hours = parseInt(hoursInput.value, 10);
    let minutes = parseInt(minutesInput.value, 10);
    let seconds = parseInt(secondsInput.value, 10);

    //Convert time to seconds
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;

    //Decrement and display time each second
    countdown = setInterval(function() {
        if (i%2 == 0) { return; } //For start/pause toggle
        
        //Convert back to hours, minutes, seconds
        const hours = Math.floor(totalSeconds /3600);
        const minutes = Math.floor((totalSeconds % 3600) /60);
        const seconds = totalSeconds % 60;
        
        //Display time in text boxes
        hoursInput.value = pad(hours);
        minutesInput.value = pad(minutes);
        secondsInput.value = pad(seconds);

        //Decrement seconds
        if (totalSeconds != 0) { totalSeconds--; }

    }, 1000);//1 second delay

}

function setBreak() {
    breakHours = document.getElementById('hours');
    breakMinutes = document.getElementById('minutes');
    breakSeconds = document.getElementById('seconds');

    startCountdown('break');
}

function setStudy() {
    studyHours = document.getElementById('hours');
    console.log(studyHours);
    studyMinutes = document.getElementById('minutes');
    studySeconds = document.getElementById('seconds');

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