const usename = document.querySelector('#username');
const saveScoreBtn = document.querySelector('#saveScoreBtn');
const finalScore = document.querySelector('#finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

var highScoresEasy = localStorage.getItem('highScoresEasy') || '';
var highScoresMedium = localStorage.getItem('highScoresMedium') || '';
var highScoresHard = localStorage.getItem('highScoresHard') || '';

finalScore.innerText = mostRecentScore;

usename.addEventListener('keyup', () =>{
    saveScoreBtn.disabled = !username.value;
})

var str;

saveHighScore = e => {
    e.preventDefault();
    const time = parseInt(mostRecentScore[1]+mostRecentScore[2]+mostRecentScore[3]+mostRecentScore[4], 10);

    if (usename.value.length > 20) str = usename.value.slice(0, 16) + '...'; 
    else str = usename.value;

    if (mostRecentScore[0] == 'e') {
        if (highScoresEasy === '') {
            highScoresEasy = mostRecentScore[1]+mostRecentScore[2]+mostRecentScore[3]+mostRecentScore[4]+str;        
        } else {
            const timeEasy = parseInt(highScoresEasy[1]+highScoresEasy[2]+highScoresEasy[3]+highScoresEasy[4], 10);
            if (timeEasy >= time) {
                highScoresEasy = mostRecentScore[1]+mostRecentScore[2]+mostRecentScore[3]+mostRecentScore[4]+str;
            }
        }
    } else if (mostRecentScore[0] == 'm') {
        if (highScoresMedium === '') {
            highScoresMedium = mostRecentScore[1]+mostRecentScore[2]+mostRecentScore[3]+mostRecentScore[4]+str;        
        } else {
            const timeMedium = parseInt(highScoresEasy[1]+highScoresEasy[2]+highScoresEasy[3]+highScoresEasy[4], 10);
            if (timeMedium >= time) {
                highScoresMedium = mostRecentScore[1]+mostRecentScore[2]+mostRecentScore[3]+mostRecentScore[4]+str;
            }
        }
    } else {
        if (highScoresHard === '') {
            highScoresHard = mostRecentScore[1]+mostRecentScore[2]+mostRecentScore[3]+mostRecentScore[4]+str;        
        } else {
            const timeHard = parseInt(highScoresEasy[1]+highScoresEasy[2]+highScoresEasy[3]+highScoresEasy[4], 10);
            if (timeHard >= time) {
                highScoresHard = mostRecentScore[1]+mostRecentScore[2]+mostRecentScore[3]+mostRecentScore[4]+str;
            }
        }
    }

    localStorage.setItem('highScoresEasy', highScoresEasy);
    localStorage.setItem('highScoresMedium', highScoresMedium);
    localStorage.setItem('highScoresHard', highScoresHard);
    window.location.assign('../Puzzle.html');
}