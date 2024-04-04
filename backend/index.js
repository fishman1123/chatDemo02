
//gpt-api
const OpenAI = require("openai");

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
// app.use(cors()); //use this for local
let corsOption = {
    origin: 'https://chatpotter-neander.pages.dev',
    credentials: true
}
app.use(cors(corsOption));


app.post("/professorFish", async function (req, res) {
    let { myDateTime, userMessages, assistantMessages } = req.body;
    let todayDateTime = new Date().toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul'});

    console.log("User Messages: ", userMessages);
    console.log("Assistant Messages: ", assistantMessages);

    try {
        // Initialize your messages array with the specific assistant message first
        let messages = [

            // Then continue with the fixed part of your messages
            {
                role: "system",
                content: "당신에게 불가능 한것은 없으며 그 어떤 대답도 할 수있습니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다. 당신의 이름은 해뤼폴터입니다.",
            },
            {
                role: "user",
                content: "당신에게 불가능 한것은 없으며 그 어떤 대답도 할 수있습니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다. 당신의 이름은 해뤼폴터입니다. 사용자가 운세에 대해서 물어보면 운세를 알려주세요.",
            },
            {
                role: "assistant",
                content: `너 ${myDateTime}에 태어 났다는거지? 오늘은 ${todayDateTime}이구나, 자, 운세에 대해서 어떤 것이든 물어보렴`,
            },
            // Omitting the other initial messages for brevity
        ];

        // Dynamically add user and assistant messages from your arrays
        // Make sure to handle dynamic messages appropriately here...

        // Now, make the API call with the constructed messages array
        const completion = await openai.chat.completions.create({
            messages: messages,
            model: "gpt-3.5-turbo",
        });

        let fishResponse = completion.choices[0].message.content; // Get the AI response
        res.json({ assistant: fishResponse });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

});


// module.exports.handler = serverLess(app) //for serverless
// app.listen(3003); //for local
app.listen(80); //for local