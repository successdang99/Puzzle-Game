const highScoresListEasy = document.querySelector('#highScoresListEasy');
const highScoresListMedium = document.querySelector('#highScoresListMedium');
const highScoresListHard = document.querySelector('#highScoresListHard');

var highScoresEasy = localStorage.getItem('highScoresEasy') || '';
var highScoresMedium = localStorage.getItem('highScoresMedium') || '';
var highScoresHard = localStorage.getItem('highScoresHard') || '';
var time, minutes, seconds;
var secondStr = '', minuteStr = '';
if (highScoresEasy !== '') {
    time = parseInt(highScoresEasy[0]+highScoresEasy[1]+highScoresEasy[2]+highScoresEasy[3], 10);
    seconds = time % 60; secondStr = `${seconds}`;
    minutes = Math.floor(time / 60); minuteStr = `${minutes}`;
    if (seconds<10) secondStr = '0' + secondStr;
    if (minutes<10) minuteStr = '0' + minuteStr;

    highScoresListEasy.innerHTML = 
        `<li class="high-score">${highScoresEasy.slice(4,highScoresEasy.lenght)}  -  ${minuteStr}:${secondStr}</li>`;
}

if (highScoresMedium !== '') {
    time = parseInt(highScoresMedium[0]+highScoresMedium[1]+highScoresMedium[2]+highScoresMedium[3], 10);
    seconds = time % 60; secondStr = `${seconds}`;
    minutes = Math.floor(time / 60); minuteStr = `${minutes}`;
    if (seconds<10) secondStr = '0' + secondStr;
    if (minutes<10) minuteStr = '0' + minuteStr;

    highScoresListMedium.innerHTML = 
        `<li class="high-score">${highScoresMedium.slice(4,highScoresMedium.lenght)}  -  ${minuteStr}:${secondStr}</li>`;
}

if (highScoresHard !== '') {
    time = parseInt(highScoresHard[0]+highScoresHard[1]+highScoresHard[2]+highScoresHard[3], 10);
    seconds = time % 60; secondStr = `${seconds}`;
    minutes = Math.floor(time / 60); minuteStr = `${minutes}`;
    if (seconds<10) secondStr = '0' + secondStr;
    if (minutes<10) minuteStr = '0' + minuteStr;

    highScoresListHard.innerHTML = 
        `<li class="high-score">${highScoresHard.slice(4,highScoresHard.lenght)}  -  ${minuteStr}:${secondStr}</li>`;
}