const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");
const themeToggle = document.getElementById("themeToggle");
const chips = document.querySelectorAll(".chip");

let engineState = {
  lastIntent: null,
  lastResponse: null
};

const intents = [
  {
    name: "greeting",
    keywords: ["hello", "hi", "hey", "greetings", "morning", "evening", "sup"],
    responses: [
      "Hello! It's great to connect with you. How can I assist you today?",
      "Hi there! How's your day going?",
      "Hey! I'm ready to help. What's on your mind?"
    ]
  },
  {
    name: "identity",
    keywords: ["who are you", "your name", "what are you", "identify"],
    responses: [
      "I'm Nexa, your personal AI assistant. I'm designed to help you streamline your tasks and answer questions.",
      "I'm Nexa! Think of me as your digital collaborator for logic and automation.",
      "They call me Nexa. I'm an intelligent interface built to assist with your inquiries."
    ]
  },
  {
    name: "capabilities",
    keywords: ["what can you do", "help", "features", "capabilities", "can you"],
    responses: [
      "I can help you with information, generate creative ideas, or solve basic logic problems. Try asking me a question or for a joke!",
      "My current capabilities include answering FAQs, keeping you entertained with jokes, and staying on top of your requests. What shall we do first?",
      "I am equipped to handle inquiries, provide creative input, and assist with your daily tasks. Feel free to test me!"
    ]
  },
  {
    name: "joke",
    keywords: ["joke", "funny", "laugh", "humor"],
    responses: [
      "Why do programmers prefer dark mode? Because light attracts bugs.",
      "I told my computer I needed a break, and now it won't stop sending me beach wallpapers.",
      "What is a programmer's favorite hangout spot? The Foo Bar.",
      "There are 10 types of people in the world: those who understand binary, and those who don't."
    ]
  },
  {
    name: "status",
    keywords: ["how are you", "how are things", "status", "doing"],
    responses: [
      "Everything is running smoothly on my end! How can I make your day better?",
      "I'm firing on all cylinders. I'm ready for your next request.",
      "I'm doing excellent, thanks for asking. How are you holding up?"
    ]
  },
  {
    name: "gratitude",
    keywords: ["thank you", "thanks", "appreciate", "great"],
    responses: [
      "You're very welcome! Happy to help.",
      "It was my pleasure. Let me know if there's anything else you need.",
      "Glad I could assist! I'm here if you have more questions."
    ]
  },
  {
    name: "farewell",
    keywords: ["bye", "goodbye", "see ya", "exit"],
    responses: [
      "Goodbye! Have a fantastic day ahead.",
      "Catch you later! Don't hesitate to reach out if you need anything else.",
      "See you soon! Logic engine powering down."
    ]
  }
];

function scrollChatToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

function autoResizeTextarea() {
  userInput.style.height = "auto";
  userInput.style.overflowY = "hidden";
  const maxHeight = 120;
  const newHeight = Math.min(userInput.scrollHeight, maxHeight);
  userInput.style.height = `${newHeight}px`;
  if (userInput.scrollHeight > maxHeight) {
    userInput.style.overflowY = "auto";
  }
}

function createMessage(text, sender) {
  const message = document.createElement("div");
  message.className = `message ${sender} bubble-in`;
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  const tag = document.createElement("small");
  tag.textContent = sender === "user" ? "You" : "Nexa";
  message.appendChild(paragraph);
  message.appendChild(tag);
  chatBox.appendChild(message);
  scrollChatToBottom();
}

function showTypingIndicator() {
  const typing = document.createElement("div");
  typing.className = "message bot bubble-in";
  typing.id = "typingIndicator";
  typing.innerHTML = `
    <div class="typing-dots" aria-label="Bot is typing">
      <span></span><span></span><span></span>
    </div>
    <small>Nexa</small>
  `;
  chatBox.appendChild(typing);
  scrollChatToBottom();
}

function removeTypingIndicator() {
  const typing = document.getElementById("typingIndicator");
  if (typing) typing.remove();
}

function getBotReply(input) {
  const text = input.toLowerCase().trim();
  let bestIntent = null;
  let maxScore = 0;
  intents.forEach(intent => {
    let score = 0;
    intent.keywords.forEach(kw => {
      if (text.includes(kw)) score++;
    });
    if (score > maxScore) {
      maxScore = score;
      bestIntent = intent;
    }
  });
  if (bestIntent) {
    let availableResponses = bestIntent.responses;
    if (engineState.lastIntent === bestIntent.name && availableResponses.length > 1) {
      availableResponses = availableResponses.filter(res => res !== engineState.lastResponse);
    }
    const randomIndex = Math.floor(Math.random() * availableResponses.length);
    const selectedResponse = availableResponses[randomIndex];
    engineState.lastIntent = bestIntent.name;
    engineState.lastResponse = selectedResponse;
    return selectedResponse;
  }
  const fallbackResponses = [
    "That's an interesting point! I'm still learning, so I'm not quite sure about that yet. Could you try asking about my capabilities?",
    "I'm not familiar with that topic yet, but I'm always evolving. How about we talk about something else?",
    "Hmm, I don't have a specific answer for that. Maybe we could try a different topic or a joke?"
  ];
  const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  engineState.lastIntent = "fallback";
  engineState.lastResponse = randomFallback;
  return randomFallback;
}

function handleSubmit(event) {
  event.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;
  createMessage(text, "user");
  userInput.value = "";
  userInput.style.height = "44px";
  userInput.style.overflowY = "hidden";
  showTypingIndicator();
  setTimeout(() => {
    removeTypingIndicator();
    createMessage(getBotReply(text), "bot");
  }, 1000);
}

userInput.addEventListener("input", autoResizeTextarea);
userInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});
chatForm.addEventListener("submit", handleSubmit);
chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    userInput.value = chip.textContent.trim();
    autoResizeTextarea();
    userInput.focus();
  });
});
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  themeToggle.textContent = document.body.classList.contains("light-mode") ? "☀" : "☾";
});
window.addEventListener("load", () => {
  autoResizeTextarea();
  scrollChatToBottom();
});
window.addEventListener("resize", () => {
  autoResizeTextarea();
  scrollChatToBottom();
});
