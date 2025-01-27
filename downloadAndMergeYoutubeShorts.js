const cp = require('child_process');
const readline = require('readline');
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg-static');

async function downloadAndMerge(name, url) {
    return new Promise((resolve, reject) => {
        try {
            // Validate URL
            // const PROXY_URI = 'http://152.26.229.66:9443'
            // const AGENT = ytdl.createProxyAgent({ uri: PROXY_URI });
            if (!ytdl.validateURL(url)) {
                console.error('Invalid YouTube URL');
                return reject({success: false, error: new Error('Invalid YouTube URL')});
            }

            console.log(`Starting download for: ${name}`);

            const tracker = {
                start: Date.now(),
                audio: { downloaded: 0, total: Infinity },
                video: { downloaded: 0, total: Infinity },
                merged: { frame: 0, speed: '0x', fps: 0 },
            };

            // Audio and video output paths
            const audioPath = `${name}-audio.m4a`;
            const videoPath = `${name}-video.mp4`;

            // Download audio and video using youtube-dl-exec
            console.log('Downloading audio...');
            const audioDownload = youtubedl(url, {
                output: audioPath,
                format: 'bestaudio',
            });

            console.log('Downloading video...');
            const videoDownload = youtubedl(url, {
                output: videoPath,
                format: 'bestvideo',
            });

            Promise.all([audioDownload, videoDownload])
                .then(() => {
                    console.log('Audio and video downloaded. Starting merge...');

                    // FFmpeg process
                    const ffmpegProcess = cp.spawn(ffmpeg, [
                        '-loglevel', '8', '-hide_banner',
                        '-progress', 'pipe:3',
                        '-i', audioPath,
                        '-i', videoPath,
                        '-c:v', 'copy',
                        '-c:a', 'aac',
                        `${name}.mkv`,
                    ], { windowsHide: true, stdio: ['inherit', 'inherit', 'inherit', 'pipe'] });

                    ffmpegProcess.stdio[3].on('data', chunk => {
                        const lines = chunk.toString().trim().split('\n');
                        lines.forEach(line => {
                            const [key, value] = line.split('=');
                            if (key === 'frame') tracker.merged.frame = value;
                            if (key === 'fps') tracker.merged.fps = value;
                            if (key === 'speed') tracker.merged.speed = value;
                        });
                    });

                    ffmpegProcess.on('close', code => {
                        if (code === 0) {
                            console.log(`Download and merge completed: ${name}.mkv`);

                            // Clean up temporary audio and video files
                            fs.unlinkSync(audioPath);
                            fs.unlinkSync(videoPath);

                            resolve({ success: true, file: `${name}.mkv` });
                        } else {
                            reject({ success: false, error: new Error(`FFmpeg process exited with code ${code}`) });
                        }
                    });
                })
                .catch(error => {
                    console.error('Error during download:', error.message);
                    reject({ success: false, error });
                });
        } catch (error) {
            reject(error);
        }
    });
}

async function downloadAndMergeFromData(name, data) {
    return new Promise((resolve, reject) => {
        try {
            // Validate the input data
            if (!Array.isArray(data) || data.length === 0) {
                console.error('Invalid data array');
                return reject(new Error('Invalid data array'));
            }

            console.log(`Starting download and merge for: ${name}`);

            const tracker = {
                start: Date.now(),
                audio: { downloaded: 0, total: Infinity },
                video: { downloaded: 0, total: Infinity },
                merged: { frame: 0, speed: '0x', fps: 0 },
            };

            // Find the best video and audio streams
            const bestAudio = data.find(format => format.mimeType.startsWith('audio/') && format.itag === 140); // Change `itag` as needed for preferred audio
            const bestVideo = data.find(format => format.mimeType.startsWith('video/') && format.itag === 136); // Change `itag` as needed for preferred video

            if (!bestAudio || !bestVideo) {
                console.error('Failed to find suitable audio or video streams');
                return reject(new Error('No suitable streams found'));
            }

            console.log(`Best Audio URL: ${bestAudio.url}`);
            console.log(`Best Video URL: ${bestVideo.url}`);

            // Track progress
            const showProgress = () => {
                readline.cursorTo(process.stdout, 0);
                const toMB = i => (i / 1024 / 1024).toFixed(2);
                process.stdout.write(`Audio  | ${(tracker.audio.downloaded / tracker.audio.total * 100).toFixed(2)}% (${toMB(tracker.audio.downloaded)}MB/${toMB(tracker.audio.total)}MB)\n`);
                process.stdout.write(`Video  | ${(tracker.video.downloaded / tracker.video.total * 100).toFixed(2)}% (${toMB(tracker.video.downloaded)}MB/${toMB(tracker.video.total)}MB)\n`);
                process.stdout.write(`Merged | Frame: ${tracker.merged.frame}, FPS: ${tracker.merged.fps}, Speed: ${tracker.merged.speed}\n`);
                process.stdout.write(`Elapsed: ${(Date.now() - tracker.start) / 1000}s\n`);
            };

            let progressbarHandle = setInterval(showProgress, 1000);

            // FFmpeg process
            const ffmpegProcess = cp.spawn(ffmpeg, [
                '-loglevel', '8', '-hide_banner',
                '-progress', 'pipe:3',
                '-i', bestAudio.url,
                '-i', bestVideo.url,
                '-map', '0:a', '-map', '1:v',
                '-c:v', 'copy',
                `${name}.mkv`
            ], { windowsHide: true, stdio: ['inherit', 'inherit', 'inherit', 'pipe'] });

            ffmpegProcess.stdio[3].on('data', chunk => {
                const lines = chunk.toString().trim().split('\n');
                lines.forEach(line => {
                    const [key, value] = line.split('=');
                    if (key === 'frame') tracker.merged.frame = value;
                    if (key === 'fps') tracker.merged.fps = value;
                    if (key === 'speed') tracker.merged.speed = value;
                });
            });

            ffmpegProcess.on('close', code => {
                clearInterval(progressbarHandle);
                if (code === 0) {
                    console.log(`Download and merge completed: ${name}.mkv`);
                    resolve({ success: true, file: `${name}.mkv` });
                } else {
                    reject(new Error(`FFmpeg process exited with code ${code}`));
                }
            });

        } catch (error) {
            reject(error);
        }
    });
}


module.exports = {downloadAndMerge, downloadAndMergeFromData}

// Usage example
// downloadAndMerge('output-video', 'https://www.youtube.com/watch?v=aqz-KE-bpKQ')
//     .then(result => console.log('Process completed successfully:', result))
//     .catch(error => console.error('Error:', error));
