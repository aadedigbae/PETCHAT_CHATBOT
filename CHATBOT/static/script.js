class PetChatbot {
    constructor() {
        this.messagesArea = document.getElementById("messagesArea")
        this.messageInput = document.getElementById("messageInput")
        this.sendButton = document.getElementById("sendButton")
        this.chatForm = document.getElementById("chatForm")

        this.isLoading = false

        this.init()
    }

    init() {
        // Set initial timestamp
        document.getElementById("initialTime").textContent = this.getCurrentTime()

        // Enable input and button
        this.messageInput.disabled = false
        this.sendButton.disabled = false

        // Event listeners
        this.chatForm.addEventListener("submit", (e) => this.handleSubmit(e))
        this.messageInput.addEventListener("input", () => this.toggleSendButton())

        // Focus on input
        this.messageInput.focus()
    }

    handleSubmit(e) {
        e.preventDefault()

        const message = this.messageInput.value.trim()
        if (!message || this.isLoading) return

        this.addUserMessage(message)
        this.messageInput.value = ""
        this.toggleSendButton()

        this.sendMessage(message)
    }

    addUserMessage(message) {
        const messageElement = this.createMessageElement(message, "user")
        this.messagesArea.appendChild(messageElement)
        this.scrollToBottom()
    }

    addAssistantMessage(message) {
        const messageElement = this.createMessageElement(message, "assistant")
        this.messagesArea.appendChild(messageElement)
        this.scrollToBottom()
    }

    createMessageElement(message, role) {
        const messageDiv = document.createElement("div")
        messageDiv.className = `message ${role}-message`

        const avatar = role === "assistant" ? "🤖" : "👤"
        const avatarClass = role === "assistant" ? "assistant-avatar" : "user-avatar"

        messageDiv.innerHTML = `
            <div class="message-avatar ${avatarClass}">${avatar}</div>
            <div class="message-content">
                <div class="message-text">${this.escapeHtml(message)}</div>
                <div class="message-time">${this.getCurrentTime()}</div>
            </div>
        `

        return messageDiv
    }

    showLoadingMessage() {
        const loadingDiv = document.createElement("div")
        loadingDiv.className = "loading-message"
        loadingDiv.id = "loadingMessage"

        loadingDiv.innerHTML = `
            <div class="message-avatar assistant-avatar">🤖</div>
            <div class="loading-dots">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>
        `

        this.messagesArea.appendChild(loadingDiv)
        this.scrollToBottom()
    }

    hideLoadingMessage() {
        const loadingMessage = document.getElementById("loadingMessage")
        if (loadingMessage) {
            loadingMessage.remove()
        }
    }

    async sendMessage(message) {
        this.isLoading = true
        this.messageInput.disabled = true
        this.sendButton.disabled = true

        this.showLoadingMessage()

        try {
            // Call backend API instead of generateResponse
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: message })
            });

            const data = await response.json();

            this.hideLoadingMessage()
            this.addAssistantMessage(data.response)
        } catch (error) {
            console.error("Error:", error)
            this.hideLoadingMessage()
            this.addAssistantMessage("Sorry, I'm having trouble responding right now. Please try again!")
        } finally {
            this.isLoading = false
            this.messageInput.disabled = false
            this.sendButton.disabled = false
            this.messageInput.focus()
            this.toggleSendButton()
        }
    }

    toggleSendButton() {
        const hasText = this.messageInput.value.trim().length > 0
        this.sendButton.disabled = !hasText || this.isLoading
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesArea.scrollTop = this.messagesArea.scrollHeight
        }, 100)
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    escapeHtml(text) {
        const div = document.createElement("div")
        div.textContent = text
        return div.innerHTML
    }
}

// Initialize the chatbot when the page loads
document.addEventListener("DOMContentLoaded", () => {
    new PetChatbot()
})
