import axios from 'axios';

export async function getUserInformationByUserName(userName) {
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

        return response.data.data;
    } catch (error) {
        console.log(error);
    }
}