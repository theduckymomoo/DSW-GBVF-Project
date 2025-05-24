const chat = document.getElementById("chatMessages")

document.getElementById("send").addEventListener("click",function(event){
  event.preventDefault()
  let userMessage = document.createElement("div")
  let message = document.getElementById("userInput").value
  userMessage.textContent = message
  userMessage.className = "message user"
  chat.appendChild(userMessage);

  let reply = "I'm here to listen. Can you tell me more?";

  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("sad") || lowerMessage.includes("depressed")) {
    reply = "I'm really sorry you're feeling this way. Do you want to talk more about what’s been bothering you?";
  } else if (lowerMessage.includes("anxious") || lowerMessage.includes("worried")) {
    reply = "It’s okay to feel anxious. Do you want to share what’s making you feel this way?";
  } else if (lowerMessage.includes("happy") || lowerMessage.includes("good")) {
    reply = "That's great to hear! What’s been going well for you lately?";
  } else if (lowerMessage.includes("alone") || lowerMessage.includes("lonely")) {
    reply = "You’re not alone — I’m here with you. Would you like to talk about it?";
  }

  const counselorMessage = document.createElement("div");
  counselorMessage.textContent = reply;
  counselorMessage.className = "message counselor";
  chat.appendChild(counselorMessage);
})