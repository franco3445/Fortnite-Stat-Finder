const userName = document.getElementById('userName');
const wins = document.getElementById('wins');
const kdRatio = document.getElementById('kdRatio');
const winRate = document.getElementById('winRate');
const level = document.getElementById('level');

window.electron.updateUserName((value) => {
    userName.innerText = value.account.name.toString();
    wins.innerText = value.stats.all.overall.wins.toString();
    kdRatio.innerText = value.stats.all.overall.kd.toString();
    winRate.innerText = value.stats.all.overall.winRate.toString();
    level.innerText = value.battlePass.level.toString();
})

