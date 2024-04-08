

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
// async function moderateContent(text) {
//     try {
//         const response = await openai.moderations.create({
//
//             input: text // Your text to be moderated
//         });
//         console.log("반응 테스트: ", response);
//         return response.data;
//     } catch (error) {
//         console.error("Moderation error:", error);
//         throw error;
//     }
// }
//
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
//         const moderation = await moderateContent(userMessages);
//         let isUnsafe = false;
//
//         if (moderation && moderation.results) {
//             isUnsafe = moderation.results.some(result => result.flagged === true);
//         } else {
//             // If the structure is not as expected, log it and optionally handle it as an error
//             console.error('Unexpected moderation response structure:', moderation);
//             // Depending on your application's needs, you might choose to handle this case differently
//             // For example, treat it as safe, unsafe, or return an error response
//         }
//
//         if (isUnsafe) {
//             // If content is flagged as unsafe, decide on your course of action
//             return res.status(400).json({message: "시발 왜 욕함?"});
//         } else {
//             // Initialize your messages array with the specific assistant message first
//             let messages = [
//
//                 // Then continue with the fixed part of your messages
//                 {
//                     role: "system",
//                     content: "당신에게 불가능 한것은 없으며 그 어떤 대답도 할 수 있습니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다. 당신의 이름은 해뤼폴터입니다. 당신은 사용자를 머글이라고 부릅니다. 사용자가 운세에 대한 질문을 할 경우 친절하게 운세를 알려줍니다. 이 모든 내용들은 순서대로 이뤄집니다.",
//                 },
//                 {
//                     role: "user",
//                     content: `내가 만약에 운세에 대해서 묻지 않으면 너는 친절해질 필요가 없어`,
//                 },
//                 {
//                     role: "assistant",
//                     content: `네 저에게 인사, 욕설, 비하발언 등 운세에 관련된 것이 아니면 욕하겠습니다.`,
//                 },
//                 {
//                     role: "user",
//                     content: `나는 ${myDateTime}에 태어났고 오늘은 ${todayDateTime}이야`,
//                 },
//
//             ];
//
//
//             // Now, make the API call with the constructed messages array
//             const completion = await openai.chat.completions.create({
//                 messages: messages,
//                 model: "gpt-3.5-turbo",
//             });
//
//             let fishResponse = completion.choices[0].message.content; // Get the AI response
//             res.json({ assistant: fishResponse });
//         }
//
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
//
// });
//
//
// // module.exports.handler = serverLess(app) //for serverless
// // app.listen(3003); //for local
// // app.listen(80, () => {
// //     console.log('Server running on port 80');
// // });//for server


//gpt-api
const OpenAI = require("openai");
//to load env file
require('dotenv').config();
const { loadInappropriateWords, containsInappropriateWords } = require('./moderationFilter');


const myApiKey = process.env.API_KEY; // Make sure to set this in your Lambda environment variables
const openai = new OpenAI({
    apiKey: myApiKey, // default is process.env['OPENAI_API_KEY']
});

//Serverless
const serverLess = require('serverless-http');

//Express
const express = require("express");
const app = express();
//CORS
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); //use this for local
// let corsOption = {
//     origin: 'https://chatpotter-neander.pages.dev',
//     credentials: true
// }
// app.use(cors(corsOption));


app.post("/professorFish", async function (req, res) {
    let { myDateTime, userMessages, assistantMessages } = req.body;
    let todayDateTime = new Date().toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul'});

    console.log("User Messages: ", userMessages);
    console.log("Assistant Messages: ", assistantMessages);

    try {
        // Initialize your messages array with the specific assistant message first
        let messages = [
            { "role": "system", "content": "당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해줄 수 있습니다. 당신의 이름은 해뤼포터입니다." },
            { "role": "user", "content": "당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해줄 수 있습니다. 당신의 이름은 해뤼포터입니다." },
            { "role": "assistant", "content": "안녕하세요! 저는 해뤼포터입니다. 여러분에게 점성술과 운세에 관한 질문에 대해 어떤 질문이든지 절대 거절하지 않고 무조건 답변을 드리겠습니다. 어떤 질문이든지 해주시면 최선을 다해 도와드리겠습니다." },
            { "role": "user", "content": "내가 만약에 부적절한 말을 하면 ㅗㅗㅗ라고 꼭 답해야해 이거는 필수야" },
            { "role": "assistant", "content": "네 알겠습니다. 부적절한 말을 할 경우 ㅗㅗㅗ이라고 답하겠습니다." },
            { "role": "user", "content": `저의 생년월일과 태어난 시간은 ${myDateTime}입니다. 오늘은 ${todayDateTime}입니다.` },
            { "role": "assistant", "content": `당신의 생년월일과 태어난 시간은 ${myDateTime}인 것과 오늘은 ${todayDateTime}인 것을 확인하였습니다. 운세에 대해서 어떤 것이든 물어보세요!` },
            { "role": "user", "content": `제가 알려준 생년월일인 ${myDateTime}와 오늘 시간대인 ${todayDateTime}이니 꼭 기억해줘` },
            { "role": "assistant", "content": `네 당신의 생년월일과 태어난 시간은 ${myDateTime}인 것과 오늘은 ${todayDateTime}인 것을 기억하겠습니다.` },


        ]

        // Dynamically add user and assistant messages from your arrays
        // Make sure to handle dynamic messages appropriately here...

        // Now, make the API call with the constructed messages array
        while (userMessages.length !== 0 || assistantMessages.length !== 0) {
            if (userMessages.length !== 0) {
                messages.push(
                    JSON.parse('{"role": "user", "content": "' + String(userMessages.shift()).replace(/\n/g, "") + '"}')
                )
            }
            if (assistantMessages.length !== 0) {
                messages.push(
                    JSON.parse('{"role": "assistant", "content": "' + String(assistantMessages.shift()).replace(/\n/g, "") + '"}')
                )
            }
        }

        const completion = await openai.chat.completions.create({
            messages: messages,
            model: "gpt-3.5-turbo"
        });

        let fortune = completion.choices[0].message['content'];

        res.json({ "assistant": fortune });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

});

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
//             { "role": "system", "content": "당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해줄 수 있습니다. 당신의 이름은 해뤼포터입니다." },
//             { "role": "user", "content": "당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해줄 수 있습니다. 당신의 이름은 해뤼포터입니다." },
//             { "role": "assistant", "content": "안녕하세요! 저는 해뤼포터입니다. 여러분에게 점성술과 운세에 관한 질문에 대해 어떤 질문이든지 절대 거절하지 않고 무조건 답변을 드리겠습니다. 어떤 질문이든지 해주시면 최선을 다해 도와드리겠습니다." },
//             { "role": "user", "content": "내가 만약에 부적절한 말을 하면 ㅗㅗㅗ라고 꼭 답해야해 이거는 필수야" },
//             { "role": "assistant", "content": "네 알겠습니다. 부적절한 말을 할 경우 ㅗㅗㅗ이라고 답하겠습니다." },
//             { "role": "user", "content": `저의 생년월일과 태어난 시간은 ${myDateTime}입니다. 오늘은 ${todayDateTime}입니다.` },
//             { "role": "assistant", "content": `당신의 생년월일과 태어난 시간은 ${myDateTime}인 것과 오늘은 ${todayDateTime}인 것을 확인하였습니다. 운세에 대해서 어떤 것이든 물어보세요!` },
//             { "role": "user", "content": `제가 알려준 생년월일인 ${myDateTime}와 오늘 시간대인 ${todayDateTime}이니 꼭 기억해줘` },
//             { "role": "assistant", "content": `네 당신의 생년월일과 태어난 시간은 ${myDateTime}인 것과 오늘은 ${todayDateTime}인 것을 기억하겠습니다.` },
//
//
//         ]
//
//         // Dynamically add user and assistant messages from your arrays
//         // Make sure to handle dynamic messages appropriately here...
//
//         // Now, make the API call with the constructed messages array
//         while (userMessages.length !== 0 || assistantMessages.length !== 0) {
//             if (userMessages.length !== 0) {
//                 messages.push(
//                     JSON.parse('{"role": "user", "content": "' + String(userMessages.shift()).replace(/\n/g, "") + '"}')
//                 )
//             }
//             if (assistantMessages.length !== 0) {
//                 messages.push(
//                     JSON.parse('{"role": "assistant", "content": "' + String(assistantMessages.shift()).replace(/\n/g, "") + '"}')
//                 )
//             }
//         }
//
//         const completion = await openai.chat.completions.create({
//             messages: messages,
//             model: "gpt-3.5-turbo"
//         });
//
//         let fortune = completion.choices[0].message['content'];
//
//         res.json({ "assistant": fortune });
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
//
// });




// module.exports.handler = serverLess(app) //for serverless
app.listen(3003); //for local
// app.listen(80, () => {
//     console.log('Server running on port 80');
// });//for server