const userName = document.getElementById('userName');
const wins = document.getElementById('wins');
const kdRatio = document.getElementById('kdRatio');
const winRate = document.getElementById('winRate');
const level = document.getElementById('level');

function getInputValue () {
    window.ipcRenderer.send('userInput', userName.value);
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

