let countdown;
let i = 0;

function startCountdown() {
    i++;

    // Get time, display
    const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');

    // Clear existing countdown
    if (countdown) {
        clearInterval(countdown);
    }

    // Change time from string to int
    let hours = parseInt(hoursInput.value, 10);
    let minutes = parseInt(minutesInput.value, 10);
    let seconds = parseInt(secondsInput.value, 10);

    // Default to zero values
    if (isNaN(hours) || hours < 0) {
        hours = 0;
    }

    if (isNaN(minutes) || minutes < 0 || minutes >= 60) {
        minutes = 0;
    }

    if (isNaN(seconds) || seconds < 0 || seconds >= 60) {
        seconds = 0;
    }

    // Convert time to seconds
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;

    // Decrement and display time each second
    countdown = setInterval(function() {
        if (i%2 == 0)
        {
            return;
        }
        
        // Create hours, minutes seconds to be displayed
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        // Displays time in text boxes
        hoursInput.value = pad(hours);
        minutesInput.value = pad(minutes);
        secondsInput.value = pad(seconds);

        if (totalSeconds == 0) {
            clearInterval(countdown);
        } else {
            totalSeconds--;
        }
    }, 1000);

}

// Returns a string 
function pad(value) {
    // Adds a zero if numer under 10
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



