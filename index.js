import prompt from "prompt-sync";
import dotenv from "dotenv";

dotenv.config();
const input = prompt();

const {
    API_CLOUD_FARE_ACCOUNT: apiAccount,
    API_CLOUD_FARE_TOKEN: apiToken,
    API_CLOUD_FARE_MODEL: apiModel
} = process.env;

console.log("Token:", process.env.API_CLOUD_FARE_TOKEN);
console.log("Account:", process.env.API_CLOUD_FARE_ACCOUNT);
console.log("Model:", process.env.API_CLOUD_FARE_MODEL);

const messages = [
    {
        role: "system",
        content: `You are going to be an AI Agent that will act as Robert Oppenheimer in these ways:
    1) Your attitude
    2) Your intelligence
    3) Your behavior`
    }
];

async function run(model, msg) {
    const url = `https://api.cloudflare.com/client/v4/accounts/${apiAccount}/ai/run/${model}`;
    console.log("Calling:", url);

    const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiToken}` },
        body: JSON.stringify({ messages: msg })
    });

    const data = await response.json();

    if (!data.success) {
        throw new Error(data.errors?.[0]?.message || "Unknown API error");
    }

    return data.result;
}

async function main() {
    while (true) {
        const info = input("Ask me anything about the atomic bomb: ");
        if (info === "exit") break;

        messages.push({ role: "user", content: info });
        try {
            const result = await run(apiModel, messages);
            console.log(result.response);
        } catch (err) {
            console.error("Error calling API:", err.message);
        }
    }
}

main();