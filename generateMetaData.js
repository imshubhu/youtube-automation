const OpenAIApi = require('openai');
const openai = new OpenAIApi({apiKey: ''});

async function generateYouTubeMetadata(topic, targetAudience, keywords) {
    try {
        const prompt = `
Generate optimized YouTube metadata for a video:
Topic: ${topic}
Target Audience: ${targetAudience}
Keywords: ${keywords.join(', ')}

Provide:
1. A compelling title (max 70 characters).
2. A detailed description (2-3 paragraphs).
3. A list of tags (10-15 tags) for better ranking.

Respond in JSON format like this:
{
  "title": "Your Title Here",
  "description": "Your Description Here",
  "tags": ["tag1", "tag2", "tag3", ...]
}`;

console.log('prompt', prompt)

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            prompt,
            max_tokens: 300,
            temperature: 0.7,
        });

        const metadata = JSON.parse(response.data.choices[0].text.trim());
        return metadata;
    } catch (error) {
        console.error('Error generating metadata:', error);
        return null;
    }
}

// Example usage
// (async () => {
//     const topic = 'Top 10 Productivity Tips for 2023';
//     const targetAudience = 'Young professionals and students';
//     const keywords = ['productivity', 'time management', '2023 tips'];

//     const metadata = await generateYouTubeMetadata(topic, targetAudience, keywords);

//     if (metadata) {
//         console.log('Generated Metadata:', metadata);
//     }
// })();

module.exports = generateYouTubeMetadata
