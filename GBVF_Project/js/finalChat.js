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
    const emojiPicker = document.getElementById('emojiPicker');
    const emergencyButton = document.getElementById('emergencyBtn');
    const chatWithCounselorLink = document.getElementById('chatWithCounselorLink');
    const counselorSelectionPanel = document.getElementById('counselorSelectionPanel');
    const chatInterface = document.getElementById('chatInterface');
    const counselorListDiv = counselorSelectionPanel.querySelector('.counselor-list');
    const currentCounselorNameSpan = document.getElementById('currentCounselorName');

    // --- API Configuration ---
    // IMPORTANT: Replace with the actual URL to your PHP API file
    const phpApiUrl = 'http://localhost/website/GBVF_Project/api.php'; // Corrected path based on your XAMPP setup

    // Your existing Gemini API key and URL
    const geminiApiKey = "AIzaSyAFAYp5fJWuXKU4sTTcs_Nu36EovnxaAJM"; // Keep this if you're calling Gemini from frontend
    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

    let selectedCounselor = null;
    const counselors = [
        { name: 'Zandi', bio: 'Specializes in emotional support and stress management.' },
        { name: 'Sipho', bio: 'Focuses on relationship issues and conflict resolution.' },
        { name: 'Lindiwe', bio: 'Expert in grief counseling and coping strategies.' },
        { name: 'Thabo', bio: 'Provides guidance on financial stress and career challenges.' },
        { name: 'Naledi', bio: 'Offers support for anxiety, depression, and self-esteem.' }
    ];

    // --- User and Chat Session Management ---
    let currentChatSessionId = null;
    let currentUsername = null; // This will be set after the prompt

    // Function to get or create a unique chat session ID, including the username
    // This function now assumes currentUsername is already set.
    function getOrCreateChatSessionId() {
        if (!currentChatSessionId && currentUsername) {
            // We'll generate a new session ID based on the current username
            // This ensures a new session if the user enters a different username
            currentChatSessionId = `session_${currentUsername}_${crypto.randomUUID()}`;
            localStorage.setItem('safeHavenChatSessionId', currentChatSessionId); // Store for persistence within this session
        }
        return currentChatSessionId;
    }

    // Function to prompt the user for their username
    function showUsernamePrompt() {
        const dialogId = 'customUsernameDialog';
        let dialog = document.getElementById(dialogId);

        if (!dialog) {
            dialog = document.createElement('div');
            dialog.id = dialogId;
            dialog.classList.add('custom-dialog-overlay');
            dialog.innerHTML = `
                <div class="custom-dialog-content">
                    <p>Please enter your username:</p>
                    <input type="text" id="usernameInput" placeholder="Your username">
                    <div class="custom-dialog-buttons">
                        <button id="usernameSubmitBtn">Submit</button>
                    </div>
                </div>
            `;
            document.body.appendChild(dialog);
        }

        dialog.style.display = 'flex'; // Show the dialog

        const usernameInput = document.getElementById('usernameInput');
        const submitBtn = document.getElementById('usernameSubmitBtn');

        // Clear previous event listeners to prevent multiple calls
        submitBtn.onclick = null;

        submitBtn.onclick = () => {
            const username = usernameInput.value.trim();
            if (username) {
                currentUsername = username; // Set the global currentUsername
                localStorage.setItem('safeHavenUsername', username); // Optionally save for future default, but prompt still shows
                dialog.style.display = 'none';
                // Reset session ID to force a new one based on the new username
                currentChatSessionId = null;
                initializeChatSession(); // Proceed with chat initialization
            } else {
                showAlertDialog('Please enter a valid username.');
            }
        };
        usernameInput.focus(); // Focus on the input field
    }

    // Function to display a simple alert dialog (replaces window.alert)
    function showAlertDialog(message) {
        const dialogId = 'customAlertDialog';
        let dialog = document.getElementById(dialogId);

        if (!dialog) {
            dialog = document.createElement('div');
            dialog.id = dialogId;
            dialog.classList.add('custom-dialog-overlay');
            dialog.innerHTML = `
                <div class="custom-dialog-content">
                    <p id="customAlertDialogMessage"></p>
                    <div class="custom-dialog-buttons">
                        <button id="customAlertDialogClose">OK</button>
                    </div>
                </div>
            `;
            document.body.appendChild(dialog);
        }

        document.getElementById('customAlertDialogMessage').textContent = message;
        dialog.style.display = 'flex';

        const closeBtn = document.getElementById('customAlertDialogClose');
        closeBtn.onclick = null; // Clear previous listener
        closeBtn.onclick = () => {
            dialog.style.display = 'none';
        };
    }


    // --- Helper Functions ---
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function displayUserMessage(message, timestamp = new Date()) {
        const now = new Date(timestamp);
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

    function displayCounselorMessage(message, timestamp = new Date()) {
        const now = new Date(timestamp);
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
        hideTypingIndicator(); // Ensure only one typing indicator is present

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

        if (selectedCounselor) {
            counselorStatus.textContent = `${selectedCounselor.name} is typing...`;
        } else {
            counselorStatus.textContent = 'Counselor is typing...';
        }
    }

    function hideTypingIndicator() {
        const typingIndicators = document.querySelectorAll('.is-typing');
        typingIndicators.forEach(indicator => indicator.remove());
        counselorStatus.textContent = 'Online';
    }

    // --- Database Interaction Functions ---

    // Saves a message to the MySQL database via PHP API
    async function saveMessageToDatabase(sender, message, counselorName) {
        const chatSessionId = getOrCreateChatSessionId();
        if (!chatSessionId) {
            console.error("Cannot save message: No chat session ID available.");
            return; // Don't save if no session ID (username not yet entered)
        }

        try {
            const response = await fetch(phpApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatSessionId: chatSessionId,
                    sender: sender,
                    messageContent: message,
                    counselorName: counselorName,
                    username: currentUsername // Include the username
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Backend Save Error Status:", response.status);
                console.error("Backend Save Error Data:", errorData);
                throw new Error(`Failed to save message: ${errorData.message || response.statusText}`);
            }
            const result = await response.json();
            console.log('Message saved to database:', result);
        } catch (error) {
            console.error('Error saving message to database:', error);
            // Optionally, display a user-friendly error message
            // displayCounselorMessage("Failed to save message history. Please check your connection.");
        }
    }

    // Loads chat history from the MySQL database via PHP API, filtered by username
    async function loadChatHistory(session_id) {
        if (!session_id || !currentUsername) {
            console.warn("Cannot load chat history: Session ID or Username not available.");
            return; // Don't load if no session ID or username
        }

        try {
            const response = await fetch(`${phpApiUrl}?session_id=${session_id}&username=${currentUsername}`);
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Backend Load Error Status:", response.status);
                console.error("Backend Load Error Data:", errorData);
                throw new Error(`Failed to load chat history: ${errorData.message || response.statusText}`);
            }
            const data = await response.json();

            if (data.status === 'success' && data.messages) {
                chatMessages.innerHTML = ''; // Clear existing messages before loading
                // Add a timestamp for the start of the loaded conversation
                chatMessages.insertAdjacentHTML('beforeend', `
                    <div class="message-timestamp">
                        <span>Chat History Loaded for ${currentUsername}</span>
                    </div>
                `);

                data.messages.forEach(msg => {
                    // Assuming timestamp from DB is in a format Date() can parse
                    if (msg.sender === 'user') {
                        displayUserMessage(msg.message_content, msg.timestamp);
                    } else {
                        displayCounselorMessage(msg.message_content, msg.timestamp);
                    }
                });
                scrollToBottom();
            } else {
                console.error('Error loading chat history from PHP:', data.message);
                // displayCounselorMessage("Failed to load previous chat history. Please try again.");
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            // displayCounselorMessage("Failed to load previous chat history. Please try again.");
        }
    }

    // --- Main Chat Logic (Modified) ---

    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        displayUserMessage(message);
        await saveMessageToDatabase('user', message, selectedCounselor ? selectedCounselor.name : 'N/A'); // Save user message

        messageInput.value = '';
        sendButton.disabled = true;
        showTypingIndicator();

        try {
            const chatHistory = [
                { role: "user", parts: [{ text: message }] }
            ];

            const generationConfig = {
                maxOutputTokens: 100,
                temperature: 0.7,
                topP: 0.95,
            };

            const systemInstruction = {
                parts: [{
                    text: `You are ${selectedCounselor.name}, a supportive and empathetic counselor for Safe Haven. Your goal is to provide concise, helpful, and reassuring responses. Focus on active listening, validating feelings, and offering practical, brief guidance or asking open-ended questions to encourage further sharing. Keep your responses under 100 words. Remember your specialty is: ${selectedCounselor.bio}`
                }]
            };

            const payload = {
                contents: chatHistory,
                generationConfig: generationConfig,
                systemInstruction: systemInstruction
            };

            const response = await fetch(geminiApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Gemini API Response Error Status:", response.status);
                console.error("Gemini API Response Error Data:", errorData);
                throw new Error(`Gemini API error: ${response.status} - ${errorData.error.message || 'Unknown API error'}`);
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const botResponse = result.candidates[0].content.parts[0].text;
                displayCounselorMessage(botResponse);
                await saveMessageToDatabase(selectedCounselor.name, botResponse, selectedCounselor.name); // Save counselor message
            } else {
                displayCounselorMessage("Sorry, I couldn't get a clear response from the AI. The response structure was unexpected.");
                console.error("Unexpected Gemini API response structure:", result);
            }
        } catch (error) {
            console.error("Error sending message to Gemini API or saving to DB:", error);
            displayCounselorMessage("Oops! Something went wrong while processing your message. Please try again.");
        } finally {
            hideTypingIndicator();
            sendButton.disabled = false;
            messageInput.focus();
        }
    }

    function renderCounselorList() {
        counselorListDiv.innerHTML = '';
        counselors.forEach(counselor => {
            const counselorCard = document.createElement('div');
            counselorCard.classList.add('counselor-card');
            counselorCard.innerHTML = `
                <div class="counselor-avatar">${counselor.name.charAt(0)}</div>
                <h4>${counselor.name}</h4>
                <p>${counselor.bio}</p>
            `;
            counselorCard.addEventListener('click', () => startChatSession(counselor));
            counselorListDiv.appendChild(counselorCard);
        });
    }

    async function startChatSession(counselor) {
        selectedCounselor = counselor;
        currentCounselorNameSpan.textContent = counselor.name;
        counselorStatus.textContent = 'Online';

        counselorSelectionPanel.style.display = 'none';
        chatInterface.style.display = 'flex';

        // Get or create session ID for the new chat (will use the currentUsername)
        const sessionId = getOrCreateChatSessionId();
        if (!sessionId) {
            // This case should ideally not be hit if username prompt is handled correctly
            console.error("Session ID not available to start chat session.");
            return;
        }

        // Load existing chat history for this session
        await loadChatHistory(sessionId);

        // If no messages were loaded (new session or cleared history), display initial counselor message
        // The check `chatMessages.children.length <= 1` accounts for the "Chat History Loaded" timestamp
        if (chatMessages.children.length <= 1) {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const timeString = `${hours}:${minutes}`;

            const initialMessage = `Hello and welcome to Safe Haven, ${currentUsername}. My name is ${counselor.name} and I'm here to support you. Everything you share is confidential. How can I help you today?`;
            displayCounselorMessage(initialMessage);
            await saveMessageToDatabase(counselor.name, initialMessage, counselor.name);
        }

        scrollToBottom();
        messageInput.focus();
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
            showConfirmationDialog("Are you sure you want to clear the entire chat history? This action cannot be undone.", function() {
                // User confirmed clear
                localStorage.removeItem('safeHavenChatSessionId'); // Invalidate the session ID
                currentChatSessionId = null; // Reset current session ID in memory
                chatMessages.innerHTML = ''; // Clear display

                // Re-initialize a new session
                if (selectedCounselor) {
                    startChatSession(selectedCounselor);
                } else {
                    // If no counselor selected, just reset the interface with a general message
                    const now = new Date();
                    const hours = now.getHours().toString().padStart(2, '0');
                    const minutes = now.getMinutes().toString().padStart(2, '0');
                    const timeString = `${hours}:${minutes}`;
                    chatMessages.innerHTML = `
                        <div class="message-timestamp">
                            <span>Today, ${timeString}</span>
                        </div>
                        <div class="message counselor">
                            <div class="message-content">
                                <p>Hello and welcome to Safe Haven. How can I help you today?</p>
                            </div>
                            <div class="message-time">${timeString}</div>
                        </div>
                    `;
                    saveMessageToDatabase('Counselor', 'Hello and welcome to Safe Haven. How can I help you today?', 'N/A');
                    scrollToBottom();
                }
                console.log('Chat history cleared and session ID reset.');
            }, function() {
                // User cancelled clear
                console.log('Chat clear cancelled.');
            });
        });
    }

    // Custom Confirmation Dialog (replaces window.confirm)
    function showConfirmationDialog(message, onConfirm, onCancel) {
        const dialogId = 'customConfirmDialog';
        let dialog = document.getElementById(dialogId);

        if (!dialog) {
            dialog = document.createElement('div');
            dialog.id = dialogId;
            dialog.classList.add('custom-dialog-overlay');
            dialog.innerHTML = `
                <div class="custom-dialog-content">
                    <p id="customDialogMessage"></p>
                    <div class="custom-dialog-buttons">
                        <button id="customDialogConfirm">Confirm</button>
                        <button id="customDialogCancel">Cancel</button>
                    </div>
                </div>
            `;
            document.body.appendChild(dialog);
        }

        document.getElementById('customDialogMessage').textContent = message;
        dialog.style.display = 'flex'; // Show the dialog

        const confirmBtn = document.getElementById('customDialogConfirm');
        const cancelBtn = document.getElementById('customDialogCancel');

        // Clear previous event listeners to prevent multiple calls
        confirmBtn.onclick = null;
        cancelBtn.onclick = null;

        confirmBtn.onclick = () => {
            dialog.style.display = 'none';
            if (onConfirm) onConfirm();
        };

        cancelBtn.onclick = () => {
            dialog.style.display = 'none';
            if (onCancel) onCancel();
        };
    }


    if (downloadChatButton) {
        downloadChatButton.addEventListener('click', function() {
            let chatTranscript = '';
            const messages = chatMessages.querySelectorAll('.message, .message-timestamp');

            messages.forEach(item => {
                if (item.classList.contains('message-timestamp')) {
                    chatTranscript += `--- ${item.querySelector('span').textContent} ---\n`;
                } else if (item.classList.contains('message')) {
                    const sender = item.classList.contains('user') ? 'User' : (selectedCounselor ? selectedCounselor.name : 'Counselor');
                    const content = item.querySelector('.message-content p').textContent;
                    const time = item.querySelector('.message-time') ? item.querySelector('.message-time').textContent : '';
                    chatTranscript += `${sender} (${time}): ${content}\n`;
                }
            });

            const blob = new Blob([chatTranscript], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `chat_transcript_${selectedCounselor ? selectedCounselor.name.toLowerCase() : 'general'}_${new Date().toISOString().slice(0,10)}.txt`;
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            displayCounselorMessage("Your chat transcript has been downloaded!");
            console.log('Chat transcript downloaded.');
        });
    }

    const emojis = ['😀', '😃', '😄', '😁', '😅', '😂', '�', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '🤪', '😝', '🤗', '🤔', '🤫', '😶', '😐', '😏', '😒', '🙄', '😬', '😮‍💨', '🤥', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😳', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '😈', '👿', '💀', '👻', '👽', '🤖', '💩', '🤝', '👍', '👎', '👏', '🙏', '❤️', '💔', '💖', '✨', '🔥', '🎉', '🌸', '🌷', '☀️', '🌈', '🫂'];


    if (emojiPicker) {
        emojis.forEach(emoji => {
            const span = document.createElement('span');
            span.textContent = emoji;
            span.addEventListener('click', () => {
                messageInput.value += emoji;
                messageInput.focus();
                emojiPicker.classList.remove('active');
            });
            emojiPicker.appendChild(span);
        });
    }

    if (emojiButton) {
        emojiButton.addEventListener('click', function(event) {
            event.stopPropagation();
            emojiPicker.classList.toggle('active');
        });
    }

    document.addEventListener('click', function(event) {
        if (emojiPicker && !emojiPicker.contains(event.target) && !emojiButton.contains(event.target)) {
            emojiPicker.classList.remove('active');
        }
    });

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
            if (option === 'counselor-chat') {
                showCounselorSelection();
            } else {
                displayCounselorMessage(`You've selected "${this.textContent}". The chat context would change here.`);
            }
        });
    });

    function showCounselorSelection() {
        chatInterface.style.display = 'none';
        counselorSelectionPanel.style.display = 'flex';
        renderCounselorList();
    }

    function adjustLayout() {
        if (window.innerWidth <= 992 && window.innerWidth > 768) {
            if (resourcePanel) resourcePanel.style.display = 'none';
        } else if (window.innerWidth > 992) {
            if (resourcePanel) resourcePanel.style.display = 'flex';
        }
    }

    adjustLayout();

    // New function to handle the initial chat session setup after username is obtained
    async function initializeChatSession() {
        // Update the anonymous avatar with the first letter of the username
        const anonymousAvatar = document.querySelector('.anonymous-avatar span');
        const userInfoName = document.querySelector('.user-info h3');
        if (currentUsername) {
            anonymousAvatar.textContent = currentUsername.charAt(0).toUpperCase();
            userInfoName.textContent = currentUsername;
        }

        const sessionId = getOrCreateChatSessionId(); // This will now get the ID based on the new username
        if (sessionId) {
            await loadChatHistory(sessionId);
            showCounselorSelection(); // Show counselor selection after loading history
        } else {
            console.error("Failed to get session ID after username entry.");
        }
    }

    // Always show username prompt when the page loads
    showUsernamePrompt();
});

// Add basic CSS for the custom dialogs (username prompt, confirm, alert)
const style = document.createElement('style');
style.textContent = `
    .custom-dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        display: none; /* Hidden by default */
    }

    .custom-dialog-content {
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        text-align: center;
        max-width: 400px;
        width: 90%;
        font-family: 'Inter', sans-serif;
    }

    .custom-dialog-content p {
        margin-bottom: 20px;
        font-size: 1.1em;
        color: #333;
    }

    .custom-dialog-content input[type="text"] {
        width: calc(100% - 20px);
        padding: 10px;
        margin-bottom: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 1em;
    }

    .custom-dialog-buttons button {
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1em;
        margin: 0 10px;
        transition: background-color 0.3s ease;
    }

    .custom-dialog-buttons button:hover {
        background-color: #45a049;
    }

    .custom-dialog-buttons #customDialogCancel,
    .custom-dialog-buttons #customAlertDialogClose {
        background-color: #f44336;
    }

    .custom-dialog-buttons #customDialogCancel:hover,
    .custom-dialog-buttons #customAlertDialogClose:hover {
        background-color: #da190b;
    }
`;
document.head.appendChild(style);