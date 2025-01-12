const { google } = require('googleapis');

// OAuth 2.0 setup
const CLIENT_ID = ''
const CLIENT_SECRET = ''
const REDIRECT_URI = ''; // E.g., http://localhost:3000/oauth2callback

// Replace with your refresh token (generated once using OAuth flow)
const REFRESH_TOKEN = '';

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
async function fetchTrendingShorts(query) {
    try {
        console.log(`Fetching trending YouTube Shorts for query: "${query}"...`);

        const response = await youtube.search.list({
            part: 'snippet',
            q: query,
            type: 'video',
            videoDuration: 'short', // Ensures only Shorts are fetched
            // videoType: 'any', // Includes Shorts
            order: 'date', // Sort by most viewed
            maxResults: 3, // Number of results to fetch
            regionCode: 'IN', // Change based on target region
            publishedAfter: '2024-12-29T16:02:20.476Z'
        });

        const videos = response.data.items;
        if (videos.length === 0) {
            console.log('No videos found.');
            return;
        }

        console.log(`Found ${videos.length} trending Shorts:`);
        videos.forEach((video, index) => {
            const { title, channelTitle } = video.snippet;
            const videoId = video.id.videoId;
            console.log(
                `${index + 1}. ${title} by ${channelTitle} - https://www.youtube.com/watch?v=${videoId}`
            );
        });
    } catch (error) {
        console.error('Error fetching trending Shorts:', error.message);
    }
}

// Replace "song lyrics" with your niche
fetchTrendingShorts('hindei song lyrics shorts video');
