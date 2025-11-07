import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// Extract params from URL
const params = new URLSearchParams(window.location.search);
const prompt = params.get("prompt");
const experience = params.get("experience");
const interview = params.get("type");

// Compose the system instruction for Gemini
const finalPrompt = `You are a professional interviewer. Ask ${interview} interview questions for a candidate with ${experience} years of experience. Custom prompt: ${prompt}. Ask one question at a time. Wait for the user to respond before asking the next. Keep your questions short and realistic like a real human interviewer. Respond conversationally. Do not give multiple questions at once.Also end the interview after 5-7 questions.Also at last gave the score out of 10 seperately in just score.`;


// Get DOM elements
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

const API_KEY = "YOUR_API_KEY";
const MODEL_NAME = "gemini-2.5-flash";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: MODEL_NAME,
  systemInstruction: finalPrompt,
});

let chatSession;

function addMessage(text, sender = "user") {
  const msg = document.createElement("div");
  msg.classList.add("message");
  msg.classList.add(sender === "user" ? "user-message" : "ai-message");
  msg.textContent = sender === "user" ? `You: ${text}` : `Recro AI: ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

export async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) {
    Swal.fire({
      icon: "warning",
      title: "Oops!",
      text: "Please enter a message.",
      timer: 1500,
      showConfirmButton: false,
    });
    return;
  }

  addMessage(text, "user");
  userInput.value = "";

  // Show loading/typing...
  const loadingMsg = document.createElement("div");
  loadingMsg.classList.add("message", "ai-message");
  loadingMsg.textContent = "Recro AI is typing...";
  chatBox.appendChild(loadingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const result = await chatSession.sendMessage(text);
    const response = await result.response;
    const aiText = response.text();

    loadingMsg.remove();
    addMessage(aiText, "ai");
  } catch (err) {
    console.error("Gemini error:", err);
    loadingMsg.textContent = "⚠️ AI failed to respond. Try again.";
  }
}

// Called once on load
function startChat() {
  chatSession = model.startChat({ history: [] });
  addMessage("👋 Welcome to Recro AI Interview! Let’s begin...", "ai");
}

// End chat and go to thank you page
window.endChat = function () {
  window.location.href = "thanks.html";
};

// Make sendMessage accessible globally since you use onclick in HTML
window.sendMessage = sendMessage;

startChat();

