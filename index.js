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
const downloadYouTubeShorts = require('./downloadYoutubeShorts');
const generateYouTubeMetadata = require('./generateMetaData');
const uploadVideo = require('./add_video_on_youtube');


connectDB()

app.get('/fetch', async(req, res) => {
    // await Youtube.create({
    //     name: 'Yeh Tune Kya Kiya Song',
    //     url: 'https://youtube.com/shorts/oeSjd9v4ZNg?si=qWYwV9_pspC_Wqo8',
    //     description: 'Yeh Tune Kya Kiya Song ❤🕊️ ~ Lyrics Slowed Reverb Song | Aesthetic Status | #shorts #aesthetic #song'
    // })
    // Get start and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    let data = await Youtube.find({ created_at: { $gte: startOfDay, $lte: endOfDay } })

    if(data.length){
        let { name, url, description } = data[0]
        // await downloadYouTubeShorts(name, url)
        // const metadata = await generateYouTubeMetadata(name, 'Young and old audenince both', ['shorts', 'viral', 'fun', 'entertainment']);

        // if (metadata) {
        //     console.log('Generated Metadata:', metadata);
        // }
    }

    res.send(data)
})

app.get('/', (req, res) => {
    res.send('Backend is running')
})


cron.schedule('0 8 * * *', async() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    let data = await Youtube.find({ created_at: { $gte: startOfDay, $lte: endOfDay } })
    if(data.length){
        let { name, url, description } = data[0]
        const download_response = await downloadYouTubeShorts(name, url)
        if(download_response?.success){
            await uploadVideo(name, description)
            deleteFile(`${name}.mp4`)
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