const fs = require('fs');
const ytdl = require('ytdl-core');

async function downloadYouTubeShorts(name, url) {
    try {
        // Validate the URL
        console.log('url', url)
        if (!ytdl.validateURL(url)) {
            console.log('Invalid YouTube URL');
            return { success: false };
        }

        // Get video info
        const videoInfo = await ytdl.getInfo(url);
        // const videoTitle = videoInfo.videoDetails.title.replace(/[<>:"/\\|?*]/g, ''); // Sanitize filename

        console.log(`Downloading: ${name}`);
        const format = ytdl.chooseFormat(videoInfo.formats, {
            filter: "audioandvideo",
            quality: "highest",
        });
        console.log('Format found!', format);

        // Download video
        const outputPath = `${name}.mp4`;
        const process = await new Promise((resolve, reject) => {

            ytdl.downloadFromInfo(videoInfo, {
                quality: format.itag
            })

            ytdl(url, { quality: '18' })
                .pipe(fs.createWriteStream(outputPath))
                .on('finish', () => {
                    console.log(`Download completed: ${outputPath}`);
                    resolve({ success: true });
                })
                .on('error', (error) => {
                    console.error('Error during download:', error);
                    reject({success: false});
                });
        });
        console.log('done', process)
        return process
    } catch (error) {
        console.error('Error downloading video:', error);
        return { success: false } 
    }
}

module.exports = downloadYouTubeShorts;