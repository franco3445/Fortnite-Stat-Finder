const userName = document.getElementById('userName');
const wins = document.getElementById('wins');
const kdRatio = document.getElementById('kdRatio');
const winRate = document.getElementById('winRate');
const level = document.getElementById('level');

window.electron.updateUserName((userInformation) => {
    userName.value = userInformation.account.name.toString();
    wins.innerText = userInformation.stats.all.overall.wins.toString();
    kdRatio.innerText = userInformation.stats.all.overall.kd.toString();
    winRate.innerText = userInformation.stats.all.overall.winRate.toString();
    level.innerText = userInformation.battlePass.level.toString();
})

