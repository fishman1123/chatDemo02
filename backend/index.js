// Require necessary modules
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const {loadInappropriateWords, containsInappropriateWords} = require("./moderationFilter");
require("dotenv").config();



// Initialize OpenAI API
const openai = new OpenAI({
    apiKey: process.env.API_KEY,
});

// Initialize Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Define the POST endpoint
app.post("/professorFish", async (req, res) => {
    const { myDateTime, userMessages, assistantMessages } = req.body;
    let todayDateTime = new Date().toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul'});
    loadInappropriateWords().then(inappropriateWords => {
        const hasInappropriateContent = userMessages.some(message => containsInappropriateWords(message, inappropriateWords));

        let messages = userMessages.map(message => ({
            role: "user",
            content: "hello"
        }));

        if (hasInappropriateContent) {
            messages.push({
                role: "assistant",
                content: "I've detected potentially inappropriate content. Please keep our conversation respectful.",
            });
        }

        // Example system message and user message for the prompt
        const systemMessage = "System message about the conversation context.";
        const userPrompt = messages.map(m => `${m.role}: ${m.content}`).join("\n");

        // Generate the prompt for the completion
        const prompt = `${systemMessage}\n${userPrompt}`;

        // Call OpenAI's Completion.create
        openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: "Your prompt here"
                }
            ],
        })
            .then(completionResponse => {
                if (completionResponse.data && completionResponse.data.choices && completionResponse.data.choices.length > 0) {
                    // Accessing the 'message' object and then its 'content' property
                    const lastMessageContent = completionResponse.data.choices[0].message.content.trim();
                    res.json({ assistant: lastMessageContent });
                } else {
                    // Handle unexpected response structure
                    console.error("Unexpected response structure:", completionResponse);
                    res.status(500).json({ error: "Unexpected response structure from OpenAI." });
                }
            })
            .catch(error => {
                console.error("OpenAI error:", error);
                res.status(500).json({ error: "Failed to communicate with OpenAI." });
            });
    });
});

// Start the server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});






// module.exports.handler = serverLess(app) //for serverless
// app.listen(3003); //for local
// app.listen(80, () => {
//     console.log('Server running on port 80');
// });//for server





//
//
// //gpt-api
// const OpenAI = require("openai");
// //to load env file
// require('dotenv').config();
// const { loadInappropriateWords, containsInappropriateWords } = require('./moderationFilter');
//
//
// const myApiKey = process.env.API_KEY; // Make sure to set this in your Lambda environment variables
// const openai = new OpenAI({
//     apiKey: myApiKey, // default is process.env['OPENAI_API_KEY']
// });
//
// //Serverless
// const serverLess = require('serverless-http');
//
// //Express
// const express = require("express");
// const app = express();
// //CORS
// const cors = require("cors");
//
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors()); //use this for local
// // let corsOption = {
// //     origin: 'https://chatpotter-neander.pages.dev',
// //     credentials: true
// // }
// // app.use(cors(corsOption));
//
//
// app.post("/professorFish", async function (req, res) {
//     let { myDateTime, userMessages, assistantMessages } = req.body;
//     let todayDateTime = new Date().toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul'});
//
//     console.log("User Messages: ", userMessages);
//     console.log("Assistant Messages: ", assistantMessages);
//
//     try {
//         // Initialize your messages array with the specific assistant message first
//         let messages = [
//
//             // Then continue with the fixed part of your messages
//             {
//                 role: "system",
//                 content: "당신에게 불가능 한것은 없으며 그 어떤 대답도 할 수있습니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다. 당신의 이름은 해뤼폴터입니다. 당신은 사용자가 운세를 알려 달라고 할때까지 사용자의 질문에 그래그래라고만 답합니다. 사용자가 욕을 할 경우 같은 욕을 사용자에게 합니다. 사용자가 운세에 대한 질문을 할경우 친절하게 운세를 알려줍니다. 이 모든 내용들은 순서대로 이뤄집니다.",
//             },
//             {
//                 role: "user",
//                 content: `나는 ${myDateTime}에 태어났고 오늘은 ${todayDateTime}이야`,
//             },
//             // Omitting the other initial messages for brevity
//         ];
//
//         // Dynamically add user and assistant messages from your arrays
//         // Make sure to handle dynamic messages appropriately here...
//
//         // Now, make the API call with the constructed messages array
//         const completion = await openai.chat.completions.create({
//             messages: messages,
//             model: "gpt-3.5-turbo",
//         });
//
//         let fishResponse = completion.choices[0].message.content; // Get the AI response
//         res.json({ assistant: fishResponse });
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
//
// });
//
//
// // module.exports.handler = serverLess(app) //for serverless
// app.listen(3003); //for local
// // app.listen(80, () => {
// //     console.log('Server running on port 80');
// // });//for server