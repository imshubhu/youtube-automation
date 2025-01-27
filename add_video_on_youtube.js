const fs = require('fs');
const { google } = require('googleapis');
const path = require('path');

// OAuth 2.0 setup
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI; // E.g., http://localhost:3000/oauth2callback

// Replace with your refresh token (generated once using OAuth flow)
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(    
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client,
});

async function uploadVideo(name, title) {
    try {
        const videoPath = path.resolve(__dirname, name); // Path to your video file
        const videoFileSize = fs.statSync(videoPath).size;

        const requestParameters = {
            part: 'snippet,status',
            requestBody: {
                snippet: {
                    title: title,
                    description: title,
                    tags: [`${name.split(".")[0]} lyrics`, 'lyrics video', 'shorts lyrics', 'music lyrics', 'song lyrics', 'lyrics video shorts', 'viral lyrics video', 'fun lyrics', 'entertainment lyrics', 'trending lyrics video', 'pop lyrics'], // Optional
                    categoryId: '10', // Category ID (e.g., 22 for People & Blogs)
                },
                status: {
                    privacyStatus: 'private', // Options: 'public', 'private', 'unlisted'
                },
            },
            media: {
                body: fs.createReadStream(videoPath),
            },
        };

        console.log('Uploading video...');
        const response = await youtube.videos.insert(requestParameters, {
            onUploadProgress: (evt) => {
                const progress = (evt.bytesRead / videoFileSize) * 100;
                console.log(`Upload progress: ${progress.toFixed(2)}%`);
            },
        });

        console.log('Video uploaded successfully:');
        console.log(`https://www.youtube.com/watch?v=${response.data.id}`);
        return
    } catch (error) {
        console.error('Error uploading video:', error);
        return
    }
}

module.exports = uploadVideo;