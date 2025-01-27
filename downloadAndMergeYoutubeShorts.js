// const fs = require('fs');
// const cp = require('child_process');
// const readline = require('readline');
// const ytdl = require('ytdl-core');
// const ffmpeg = require('ffmpeg-static');

// async function downloadAndMerge(name, url) {
//     return new Promise((resolve, reject) => {
//         try {
//             // Validate URL
//             if (!ytdl.validateURL(url)) {
//                 console.error('Invalid YouTube URL');
//                 return reject({success: false, error: new Error('Invalid YouTube URL')});
//             }

//             console.log(`Starting download for: ${name}`);

//             const tracker = {
//                 start: Date.now(),
//                 audio: { downloaded: 0, total: Infinity },
//                 video: { downloaded: 0, total: Infinity },
//                 merged: { frame: 0, speed: '0x', fps: 0 },
//             };

//             // Get streams
//             const audioStream = ytdl(url, { quality: 'highestaudio' })
//                 .on('progress', (_, downloaded, total) => {
//                     tracker.audio = { downloaded, total };
//                 });

//             const videoStream = ytdl(url, { quality: 'highestvideo' })
//                 .on('progress', (_, downloaded, total) => {
//                     tracker.video = { downloaded, total };
//                 });

//             // Progress bar setup
//             const showProgress = () => {
//                 readline.cursorTo(process.stdout, 0);
//                 const toMB = i => (i / 1024 / 1024).toFixed(2);
//                 process.stdout.write(`Audio  | ${(tracker.audio.downloaded / tracker.audio.total * 100).toFixed(2)}% (${toMB(tracker.audio.downloaded)}MB/${toMB(tracker.audio.total)}MB)\n`);
//                 process.stdout.write(`Video  | ${(tracker.video.downloaded / tracker.video.total * 100).toFixed(2)}% (${toMB(tracker.video.downloaded)}MB/${toMB(tracker.video.total)}MB)\n`);
//                 process.stdout.write(`Merged | Frame: ${tracker.merged.frame}, FPS: ${tracker.merged.fps}, Speed: ${tracker.merged.speed}\n`);
//                 process.stdout.write(`Elapsed: ${(Date.now() - tracker.start) / 1000}s\n`);
//             };

//             let progressbarHandle = setInterval(showProgress, 1000);

//             // FFmpeg process
//             const ffmpegProcess = cp.spawn(ffmpeg, [
//                 '-loglevel', '8', '-hide_banner',
//                 '-progress', 'pipe:3',
//                 '-i', 'pipe:4',
//                 '-i', 'pipe:5',
//                 '-map', '0:a', '-map', '1:v',
//                 '-c:v', 'copy',
//                 `${name}.mkv`
//             ], { windowsHide: true, stdio: ['inherit', 'inherit', 'inherit', 'pipe', 'pipe', 'pipe'] });

//             ffmpegProcess.stdio[3].on('data', chunk => {
//                 const lines = chunk.toString().trim().split('\n');
//                 lines.forEach(line => {
//                     const [key, value] = line.split('=');
//                     if (key === 'frame') tracker.merged.frame = value;
//                     if (key === 'fps') tracker.merged.fps = value;
//                     if (key === 'speed') tracker.merged.speed = value;
//                 });
//             });

//             ffmpegProcess.on('close', code => {
//                 clearInterval(progressbarHandle);
//                 if (code === 0) {
//                     console.log(`Download and merge completed: ${name}.mkv`);
//                     resolve({ success: true, file: `${name}.mkv` });
//                 } else {
//                     reject({success: false, error: new Error(`FFmpeg process exited with code ${code}`)});
//                 }
//             });

//             // Pipe streams to FFmpeg
//             audioStream.pipe(ffmpegProcess.stdio[4]);
//             videoStream.pipe(ffmpegProcess.stdio[5]);
//         } catch (error) {
//             reject(error);
//         }
//     });
// }

// const cp = require('child_process');
// const readline = require('readline');
// const ytdl = require('ytdl-core');
// const ffmpeg = require('ffmpeg-static');

// async function downloadAndMerge(name, url) {
//     return new Promise((resolve, reject) => {
//         try {
//             // Validate URL
//             // const PROXY_URI = 'http://152.26.229.66:9443'
//             // const AGENT = ytdl.createProxyAgent({ uri: PROXY_URI });
//             if (!ytdl.validateURL(url)) {
//                 console.error('Invalid YouTube URL');
//                 return reject({success: false, error: new Error('Invalid YouTube URL')});
//             }

//             console.log(`Starting download for: ${name}`);

//             const tracker = {
//                 start: Date.now(),
//                 audio: { downloaded: 0, total: Infinity },
//                 video: { downloaded: 0, total: Infinity },
//                 merged: { frame: 0, speed: '0x', fps: 0 },
//             };

//             // Get streams
//             const audioStream = ytdl(url, { quality: 'highestaudio' })
//                 .on('progress', (_, downloaded, total) => {
//                     tracker.audio = { downloaded, total };
//                 });

//             const videoStream = ytdl(url, { quality: 'highestvideo' })
//                 .on('progress', (_, downloaded, total) => {
//                     tracker.video = { downloaded, total };
//                 });

//             // Progress bar setup
//             const showProgress = () => {
//                 readline.cursorTo(process.stdout, 0);
//                 const toMB = i => (i / 1024 / 1024).toFixed(2);
//                 process.stdout.write(`Audio  | ${(tracker.audio.downloaded / tracker.audio.total * 100).toFixed(2)}% (${toMB(tracker.audio.downloaded)}MB/${toMB(tracker.audio.total)}MB)\n`);
//                 process.stdout.write(`Video  | ${(tracker.video.downloaded / tracker.video.total * 100).toFixed(2)}% (${toMB(tracker.video.downloaded)}MB/${toMB(tracker.video.total)}MB)\n`);
//                 process.stdout.write(`Merged | Frame: ${tracker.merged.frame}, FPS: ${tracker.merged.fps}, Speed: ${tracker.merged.speed}\n`);
//                 process.stdout.write(`Elapsed: ${(Date.now() - tracker.start) / 1000}s\n`);
//             };

//             let progressbarHandle = setInterval(showProgress, 1000);

//             // FFmpeg process
//             const ffmpegProcess = cp.spawn(ffmpeg, [
//                 '-loglevel', '8', '-hide_banner',
//                 '-progress', 'pipe:3',
//                 '-i', 'pipe:4',
//                 '-i', 'pipe:5',
//                 '-map', '0:a', '-map', '1:v',
//                 '-c:v', 'copy',
//                 `${name}.mkv`
//             ], { windowsHide: true, stdio: ['inherit', 'inherit', 'inherit', 'pipe', 'pipe', 'pipe'] });

//             ffmpegProcess.stdio[3].on('data', chunk => {
//                 const lines = chunk.toString().trim().split('\n');
//                 lines.forEach(line => {
//                     const [key, value] = line.split('=');
//                     if (key === 'frame') tracker.merged.frame = value;
//                     if (key === 'fps') tracker.merged.fps = value;
//                     if (key === 'speed') tracker.merged.speed = value;
//                 });
//             });

//             ffmpegProcess.on('close', code => {
//                 clearInterval(progressbarHandle);
//                 if (code === 0) {
//                     console.log(`Download and merge completed: ${name}.mkv`);
//                     resolve({ success: true, file: `${name}.mkv` });
//                 } else {
//                     reject({success: false, error: new Error(`FFmpeg process exited with code ${code}`)});
//                 }
//             });

//             // Pipe streams to FFmpeg
//             audioStream.pipe(ffmpegProcess.stdio[4]);
//             videoStream.pipe(ffmpegProcess.stdio[5]);
//         } catch (error) {
//             reject(error);
//         }
//     });
// }

const fs = require('fs');
const cp = require('child_process');
const readline = require('readline');
const youtubedl = require('youtube-dl-exec');
const ffmpeg = require('ffmpeg-static');

async function downloadAndMerge(name, url) {
    return new Promise((resolve, reject) => {
        try {
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

module.exports = downloadAndMerge

// Usage example
// downloadAndMerge('output-video', 'https://www.youtube.com/watch?v=aqz-KE-bpKQ')
//     .then(result => console.log('Process completed successfully:', result))
//     .catch(error => console.error('Error:', error));
