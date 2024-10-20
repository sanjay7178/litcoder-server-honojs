import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";
import { ChatMistralAI } from "@langchain/mistralai";

// let promptTemplate: string = "'Note: use the doSomething function by default sampleCode , dont change doSomething arguments in sampleCode and generate only code dont give any other ' Generate code based upon this context in Java language. There should be a Main class. This is the code --> ";
let promptTemplate: string = "solve the quoestion based on context and sampleCode then generate only code , only change the doSomething fucntion and not change the  whole code ,  This is the Samplecode and content--> ";
async function gemini(prompt: string, apiKey: string ,modelName:string): Promise<string> {
  try {
    const model = new ChatGoogleGenerativeAI({
      apiKey,
      modelName: modelName,
      maxOutputTokens: 2048,
    });
    const res = await model.invoke([
      ["human", promptTemplate + prompt],
    ]);
    return res.content.toString();
  } catch (error) {
    console.error("Error in Gemini function:", error);
    return "An error occurred while processing your request.";
  }
}
async function mixtral(prompt: string, apiKey: string ,modelName :string): Promise<string> {
  try {
    const model = new ChatMistralAI({
      modelName: modelName,
      apiKey,
    });
    const res = await model.invoke([
      ["human", promptTemplate + prompt],
    ]);
    return res.content.toString();
  } catch (error) {
    console.error("Error in Mixtral function:", error);
    return "An error occurred while processing your request.";
  }
}
async function groq(prompt: string, apiKey: string ,modelName :string): Promise<string> {
  try {
    const model = new ChatGroq({
      modelName: modelName,
      apiKey,
    });
    const res = await model.invoke([
      ["human", promptTemplate + prompt],
    ]);
    return res.content.toString();
  } catch (error) {
    console.error("Error in Groq function:", error);
    return "An error occurred while processing your request.";
  }
}

async function openai(prompt: string, apiKey: string,modelName :string): Promise<string> {
  try {
    const model = new ChatOpenAI({
      modelName: modelName,
      openAIApiKey: apiKey,
    });
    const res = await model.invoke([
      ["human", promptTemplate + prompt],
    ]);
    return res.content.toString();
  } catch (error) {
    console.error("Error in OpenAI function:", error);
    return "An error occurred while processing your request.";
  }
}
export { gemini, mixtral, groq, openai };
