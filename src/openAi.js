import { Configuration, OpenAIApi } from "Serve/src/openAi";

export async function getWordExplanation(word) {

    const configuration = new Configuration({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const prompt = `Explique moi en environ une page ce qu'est ${word}.`;

    try {
        const chat = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0.6,
            max_tokens: 2048,
        });

        const explanation = chat.data.choices[0].text.trim();

        return explanation;
    }catch (error){
        console.error(error);
        alert(error.message);
    }

}
