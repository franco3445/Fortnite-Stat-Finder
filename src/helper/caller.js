import axios from 'axios';

export async function getUserInformationByUserName(userName) {
    if (!userName) {
        throw Error('A `userName` is required');
    }

    const headers = {
        'Content-Type': 'application/json',
        Authorization: process.env.FORTNITE_API_KEY,
    }

    const url = `https://fortnite-api.com/v2/stats/br/v2?name=${userName}`;

    try {
        const response = await axios({
            method: 'GET',
            url,
            headers
        });
        const rawUserInformation = response.data.data;

        return {
            wins: rawUserInformation.stats.all.overall.wins.toString(),
            kdRatio: rawUserInformation.stats.all.overall.kd.toString(),
            winRate: rawUserInformation.stats.all.overall.winRate.toString(),
            level: rawUserInformation.battlePass.level.toString(),
        }


    } catch (error) {
        console.log(error.response.data.error);
    }
}
