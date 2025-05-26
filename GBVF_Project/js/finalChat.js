document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendMessage');
    const quickExitButton = document.getElementById('quickExit');
    const categoryButtons = document.querySelectorAll('.category');
    const closePanelButton = document.querySelector('.close-panel');
    const resourcePanel = document.querySelector('.resource-panel');
    const resourceLinks = document.querySelectorAll('.support-options a');
    const counselorStatus = document.querySelector('.counselor-status');
    const clearChatButton = document.querySelector('.clear-chat');
    const downloadChatButton = document.querySelector('.download-chat');
    const emojiButton = document.querySelector('.emoji-btn');
    const emergencyButton = document.getElementById('emergencyBtn');
    const apiKey = "AIzaSyAFAYp5fJWuXKU4sTTcs_Nu36EovnxaAJM"; // <--- INSERT YOUR API KEY HERE
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    scrollToBottom();
    counselorStatus.textContent = 'Online';

    function escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function displayUserMessage(message) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;

        const messageHTML = `
            <div class="message user">
                <div class="message-content">
                    <p>${escapeHTML(message)}</p>
                </div>
                <div class="message-time">${timeString}</div>
            </div>
        `;

        const typingIndicator = document.querySelector('.is-typing');
        if (typingIndicator) {
            typingIndicator.insertAdjacentHTML('beforebegin', messageHTML);
        } else {
            chatMessages.insertAdjacentHTML('beforeend', messageHTML);
        }
        scrollToBottom();
    }

    function displayCounselorMessage(message) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;

        const counselorHTML = `
            <div class="message counselor">
                <div class="message-content">
                    <p>${escapeHTML(message)}</p>
                </div>
                <div class="message-time">${timeString}</div>
            </div>
        `;
        chatMessages.insertAdjacentHTML('beforeend', counselorHTML);
        scrollToBottom();
    }

    function showTypingIndicator() {
        hideTypingIndicator(); 

        const typingHTML = `
            <div class="message counselor is-typing">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        chatMessages.insertAdjacentHTML('beforeend', typingHTML);
        scrollToBottom();

        counselorStatus.textContent = 'Zandi is typing...';
    }

    function hideTypingIndicator() {
        const typingIndicators = document.querySelectorAll('.is-typing');
        typingIndicators.forEach(indicator => indicator.remove());
        counselorStatus.textContent = 'Online';
    }

    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        displayUserMessage(message);
        messageInput.value = '';
        sendButton.disabled = true;
        showTypingIndicator();

        try {
            const chatHistory = [
                { role: "user", parts: [{ text: message }] }
            ];

            const generationConfig = {
                maxOutputTokens: 50,
                temperature: 0.7,
                topP: 0.95,
            };

            const systemInstruction = {
                parts: [{
                    text: "You are Zandi, a supportive and empathetic counselor for Safe Haven. Your goal is to provide concise, helpful, and reassuring responses. Focus on active listening, validating feelings, and offering practical, brief guidance or asking open-ended questions to encourage further sharing. Keep your responses under 100 words."
                }]
            };

            const payload = {
                contents: chatHistory,
                generationConfig: generationConfig,
                systemInstruction: systemInstruction
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("API Response Error Status:", response.status);
                console.error("API Response Error Data:", errorData);
                throw new Error(`API error: ${response.status} - ${errorData.error.message || 'Unknown API error'}`);
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const botResponse = result.candidates[0].content.parts[0].text;
                displayCounselorMessage(botResponse);
            } else {
                displayCounselorMessage("Sorry, I couldn't get a clear response from the AI. The response structure was unexpected.", 'bot');
                console.error("Unexpected API response structure:", result);
            }
        } catch (error) {
            console.error("Error sending message to Gemini API:", error);
            displayCounselorMessage("Oops! Something went wrong while connecting to the AI. Please ensure your API key is correct and check your console for details.", 'bot');
        } finally {
            hideTypingIndicator();
            sendButton.disabled = false;
            messageInput.focus();
        }
    }

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    if (emergencyButton) {
        emergencyButton.addEventListener('click', function() {
            window.location.href = 'https://www.google.com';
        });
    }

    quickExitButton.addEventListener('click', function() {
        window.location.href = 'https://www.google.com';
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.location.href = 'https://www.google.com';
        }
    });

    if (clearChatButton) {
        clearChatButton.addEventListener('click', function() {
            const initialTimestamp = chatMessages.querySelector('.message-timestamp');
            const initialCounselorMessage = chatMessages.querySelector('.message.counselor');

            chatMessages.innerHTML = ''; 

            if (initialTimestamp && initialCounselorMessage) {
                chatMessages.appendChild(initialTimestamp.cloneNode(true));
                chatMessages.appendChild(initialCounselorMessage.cloneNode(true));
            }
            scrollToBottom();
            console.log('Chat history cleared.');
            displayCounselorMessage("Chat history cleared. How can I help you now?");
        });
    }

    if (downloadChatButton) {
        downloadChatButton.addEventListener('click', function() {
            let chatTranscript = '';
            const messages = chatMessages.querySelectorAll('.message');

            messages.forEach(messageDiv => {
                const sender = messageDiv.classList.contains('user') ? 'User' : 'Counselor';
                const content = messageDiv.querySelector('.message-content p').textContent;
                const time = messageDiv.querySelector('.message-time') ? messageDiv.querySelector('.message-time').textContent : '';
                const timestamp = messageDiv.classList.contains('message-timestamp') ? messageDiv.querySelector('span').textContent : '';

                if (timestamp) {
                    chatTranscript += `--- ${timestamp} ---\n`;
                } else {
                    chatTranscript += `${sender} (${time}): ${content}\n`;
                }
            });

            const blob = new Blob([chatTranscript], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'chat_transcript.txt';
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            displayCounselorMessage("Your chat transcript has been downloaded!");
            console.log('Chat transcript downloaded.');
        });
    }

    if (emojiButton) {
        emojiButton.addEventListener('click', function() {
            console.log('Emoji picker functionality would be implemented here.');
            displayCounselorMessage("Emoji picker is not yet implemented. You can type emojis directly for now! 😊");
        });
    }


    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const category = this.dataset.category;
            console.log(`Switched to ${category} category. Loading relevant resources.`);
            displayCounselorMessage(`Switched to "${this.textContent}" resources. Here you would see updated content.`);
        });
    });

    if (closePanelButton) {
        closePanelButton.addEventListener('click', function() {
            if (resourcePanel) {
                resourcePanel.style.display = 'none';
            }
        });
    }

    resourceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            resourceLinks.forEach(lnk => lnk.classList.remove('active'));
            this.classList.add('active');
            const option = this.className.split(' ')[0];
            console.log(`Switched to ${option}. Changing chat context.`);
            displayCounselorMessage(`You've selected "${this.textContent}". The chat context would change here.`);
        });
    });

    function adjustLayout() {
        if (window.innerWidth <= 992 && window.innerWidth > 768) {
            if (resourcePanel) resourcePanel.style.display = 'none';
        } else if (window.innerWidth > 992) {
            if (resourcePanel) resourcePanel.style.display = 'flex';
        }
    }

    adjustLayout();

    window.addEventListener('resize', adjustLayout);
});
