const exitButton = document.getElementById('exit');
const kdRatio = document.getElementById('kdRatio');
const level = document.getElementById('level');
const userName = document.getElementById('userName');
const winRate = document.getElementById('winRate');
const wins = document.getElementById('wins');

exitButton.addEventListener('click', () => {
    window.electron.closeApp();
});

function getInputValue () {
    window.electron.send('userInput', userName.value);
}

window.electron.updateUserName((givenUsername) => {
    userName.value = givenUsername;
})

window.electron.updateUserInfo((userInformation) => {
    wins.innerText = userInformation.wins;
    kdRatio.innerText = userInformation.kdRatio;
    winRate.innerText = userInformation.winRate;
    level.innerText = userInformation.level;
})
