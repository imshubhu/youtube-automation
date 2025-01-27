// Replace with your YouTube Shorts URL
// const videoUrl = 'https://www.youtube.com/shorts/RVVEf7elbco';
const express = require('express');
const app = express();
const dotenv = require('dotenv')
dotenv.config()
console.log(process.env.CLIENT_ID)
const connectDB = require("./db");
const cron = require('node-cron');
const Youtube = require('./youtubeSchema');
const uploadVideo = require('./add_video_on_youtube');
const path = require('path')
const fs = require('fs');
const downloadAndMerge = require('./downloadAndMergeYoutubeShorts');
const fetch = require('node-fetch');

connectDB()

app.get('/push', async (req, res) => {
    try {

        const data = {
            name: 'Ho Gaya Tumse',
            url: 'https://youtube.com/shorts/cZLum6irRJs?si=okMggX5GDV4LW9I3',
            description: 'Ho Gaya Tumse Pyar Sun Le || Aesthetic 🍁🍂 || WhatsApp status ❤️ || #shorts',
            created_at: '2025-01-31T06:21:21.449+00:00'
        }

        await Youtube.create({
            ...data
        })

        res.status(200).send('okay')
    } catch (error) {
        res.status(400).send(error)
    }
})

app.get('/third-youtube', async (req, res) => {
    const url = 'https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=NcfX3HjmooU';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '7baf2dc25bmshb57c755427fb792p117878jsne9a78d65f9c6',
            'x-rapidapi-host': 'ytstream-download-youtube-videos.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        await downloadAndMerge.downloadAndMergeFromData('outout', result.adaptiveFormats)
        res.send(result)
    } catch (error) {
        console.error(error);
        res.send(error)
    }
})

async function fetchYoutubeDetails(id) {
    const url = `https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${id}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '7baf2dc25bmshb57c755427fb792p117878jsne9a78d65f9c6',
            'x-rapidapi-host': 'ytstream-download-youtube-videos.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result.adaptiveFormats
    } catch (error) {
        console.error(error);
        return error.message
    }
}

app.get('/youtube', async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        let data = await Youtube.find({ created_at: { $gte: startOfDay, $lte: endOfDay } })
        if (data.length) {
            let { name, url, description } = data[0]
            let result = await fetchYoutubeDetails(url)
            const download_response = await downloadAndMerge.downloadAndMergeFromData(name, result)
            console.log(download_response)
            if (download_response?.success) {
                console.log('name', name, description)
                await uploadVideo(download_response.file, name, description)
                deleteFile(download_response.file)
            }
        }
        res.send('success')
    } catch (error) {
        console.log('youtube error', error)
        res.status(500).send({ success: false, error: error.message })
    }
})

app.get('/', (req, res) => {
    res.send('Backend is running')
})


cron.schedule('* * * * *', () => {
    console.log('call every minute')
    fetch('https://youtube-automation-bvr3.onrender.com')
})

cron.schedule('0 8 * * *', async () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    let data = await Youtube.find({ created_at: { $gte: startOfDay, $lte: endOfDay } })
    if (data.length) {
        let { name, url, description } = data[0]
        let result = await fetchYoutubeDetails(url)
        const download_response = await downloadAndMerge.downloadAndMergeFromData(name, result)
        console.log(download_response)
        if (download_response?.success) {
            console.log('name', name, description)
            await uploadVideo(download_response.file, name, description)
            deleteFile(download_response.file)
        }
    }
    console.log('running a task every 10 minute', data);
});

function deleteFile(fileName) {
    const filePath = path.join(__dirname, fileName);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting file: ${err}`);
        } else {
            console.log(`File deleted: ${filePath}`);
        }
    });
}


app.listen(3000, () => console.log('Server started on http://localhost:3000'));