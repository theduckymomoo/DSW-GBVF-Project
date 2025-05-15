document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendMessage');
    const quickExitButton = document.getElementById('quickExit');
    const categoryButtons = document.querySelectorAll('.category');
    const closePanelButton = document.querySelector('.close-panel');
    const resourcePanel = document.querySelector('.resource-panel');
    const resourceLinks = document.querySelectorAll('.support-options a');
    
    // Auto-scroll to bottom of chat
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Initial scroll to bottom
    scrollToBottom();
    
    // Send message function
    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;
        
        // Get current time
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        
        // Create message HTML
        const messageHTML = `
            <div class="message user">
                <div class="message-content">
                    <p>${escapeHTML(message)}</p>
                </div>
                <div class="message-time">${timeString}</div>
            </div>
        `;
        
        // Insert message before typing indicator
        const typingIndicator = document.querySelector('.is-typing');
        if (typingIndicator) {
            typingIndicator.insertAdjacentHTML('beforebegin', messageHTML);
        } else {
            chatMessages.insertAdjacentHTML('beforeend', messageHTML);
        }
        
        // Clear input
        messageInput.value = '';
        
        // Scroll to bottom
        scrollToBottom();
        
        // Show typing indicator if not already visible
        if (!typingIndicator) {
            showTypingIndicator();
        }
        
        // Simulate counselor response after a delay
        simulateCounselorResponse(message);
    }
    
    // Show typing indicator
    function showTypingIndicator() {
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
        
        // Update counselor status
        document.querySelector('.counselor-status').textContent = 'Zandi is typing...';
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.querySelector('.is-typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        
        // Update counselor status
        document.querySelector('.counselor-status').textContent = 'Online';
    }
    
    // Simulate counselor response
    function simulateCounselorResponse(userMessage) {
        // Simple response logic based on user message keywords
        let responseText = '';
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            responseText = "Hello there. I'm here to help. How are you feeling today?";
        } else if (lowerMessage.includes('help') || lowerMessage.includes('need help')) {
            responseText = "I'm glad you've reached out. To help you better, could you share a bit more about what you're going through?";
        } else if (lowerMessage.includes('scared') || lowerMessage.includes('afraid') || lowerMessage.includes('fear')) {
            responseText = "It takes courage to acknowledge fear. Your safety is the priority. Would you like to discuss some safety planning options?";
        } else if (lowerMessage.includes('money') || lowerMessage.includes('financial') || lowerMessage.includes('finance')) {
            responseText = "Financial abuse is a serious form of control. There are resources and support available. Would you like me to share some options for financial assistance?";
        } else if (lowerMessage.includes('leave') || lowerMessage.includes('escape') || lowerMessage.includes('get out')) {
            responseText = "If you're considering leaving a difficult situation, it's important to plan carefully. Would you like me to help you think through some safety considerations?";
        } else if (lowerMessage.includes('children') || lowerMessage.includes('kids') || lowerMessage.includes('child')) {
            responseText = "I understand you're concerned about children in this situation. Their safety and wellbeing is important. There are specific resources available to help protect children.";
        } else {
            responseText = "Thank you for sharing that. It's important to acknowledge these experiences. How have you been coping with this situation?";
        }
        
        // Random response delay between 2-4 seconds
        const delay = Math.floor(Math.random() * 2000) + 2000;
        
        setTimeout(() => {
            // Hide typing indicator
            hideTypingIndicator();
            
            // Get current time
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const timeString = `${hours}:${minutes}`;
            
            // Create counselor message HTML
            const counselorHTML = `
                <div class="message counselor">
                    <div class="message-content">
                        <p>${responseText}</p>
                    </div>
                    <div class="message-time">${timeString}</div>
                </div>
            `;
            
            chatMessages.insertAdjacentHTML('beforeend', counselorHTML);
            scrollToBottom();
        }, delay);
    }
    
    // Escape HTML special characters to prevent XSS
    function escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Quick exit button
    quickExitButton.addEventListener('click', function() {
        window.location.href = 'https://www.google.com';
    });
    
    // Keyboard shortcut for quick exit (ESC key)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.location.href = 'https://www.google.com';
        }
    });
    
    // Resource category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Here you would load different resources based on category
            const category = this.dataset.category;
            
            // Placeholder for category switching logic
            console.log(`Switched to ${category} category`);
            
            // In a real implementation, you would load different content here
            // updateResourceContent(category);
        });
    });
    
    // Toggle resource panel on mobile
    closePanelButton.addEventListener('click', function() {
        resourcePanel.style.display = 'none';
    });
    
    // Support options links
    resourceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            resourceLinks.forEach(lnk => lnk.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Here you would load different chat interfaces based on option
            const option = this.className.split(' ')[0];
            
            // Placeholder for option switching logic
            console.log(`Switched to ${option}`);
            
            // In a real implementation, you would change the chat context
            // switchChatContext(option);
        });
    });
    
    // Adjust layout based on screen size
    function adjustLayout() {
        if (window.innerWidth <= 992 && window.innerWidth > 768) {
            // Tablet view
            resourcePanel.style.display = 'none';
        } else if (window.innerWidth > 992) {
            // Desktop view
            resourcePanel.style.display = 'flex';
        }
    }
    
    // Initial layout adjustment
    adjustLayout();
    
    // Adjust layout on window resize
    window.addEventListener('resize', adjustLayout);
});