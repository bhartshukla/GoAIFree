
        // DOM elements
        const inputText = document.getElementById('inputText');
        const outputText = document.getElementById('outputText');
        const modeButtons = document.querySelectorAll('.mode-btn');
        const convertBtn = document.getElementById('convertBtn');
        const clearBtn = document.getElementById('clearBtn');
        const copyBtn = document.getElementById('copyBtn');
        const apiKeyInput = document.getElementById('apiKey');
        const saveApiKeyBtn = document.getElementById('saveApiKey');
        const loadingIndicator = document.getElementById('loadingIndicator');
        const notification = document.getElementById('notification');
        
        // Current selected mode
        let currentMode = 'student';
        let apiKey = localStorage.getItem('goaifree_api_key') || '';
        
        // Initialize API key field
        if (apiKey) {
            apiKeyInput.value = '••••••••••••••••••••';
        }
        
        // Mode selection
        modeButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                modeButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Update current mode
                currentMode = button.getAttribute('data-mode');
                
                showNotification(`Switched to ${getModeName(currentMode)}`);
            });
        });
        
        // Save API key
        saveApiKeyBtn.addEventListener('click', () => {
            const key = apiKeyInput.value.trim();
            
            if (key && !key.includes('••••')) {
                apiKey = key;
                localStorage.setItem('goaifree_api_key', apiKey);
                apiKeyInput.value = '••••••••••••••••••••';
                showNotification('API key saved successfully!', 'success');
            } else if (key.includes('••••')) {
                // User is trying to save the masked key - ask for new one
                const newKey = prompt('Please enter your API key:');
                if (newKey && newKey.trim()) {
                    apiKey = newKey.trim();
                    localStorage.setItem('goaifree_api_key', apiKey);
                    apiKeyInput.value = '••••••••••••••••••••';
                    showNotification('API key updated successfully!', 'success');
                }
            } else {
                showNotification('Please enter a valid API key', 'error');
            }
        });
        
        // Clear input
        clearBtn.addEventListener('click', () => {
            inputText.value = '';
            showNotification('Input cleared', 'info');
        });
        
        // Copy output
        copyBtn.addEventListener('click', () => {
            const textToCopy = outputText.textContent;
            
            if (textToCopy && !textToCopy.includes('Your humanized text will appear here')) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        showNotification('Output copied to clipboard!', 'success');
                    })
                    .catch(err => {
                        console.error('Failed to copy: ', err);
                        showNotification('Failed to copy text', 'error');
                    });
            } else {
                showNotification('No output text to copy', 'error');
            }
        });
        
        // Convert text
        convertBtn.addEventListener('click', async () => {
            const text = inputText.value.trim();
            
            if (!text) {
                showNotification('Please enter some text to convert', 'error');
                return;
            }
            
            if (!apiKey) {
                showNotification('Please enter your OpenRouter API key first', 'error');
                apiKeyInput.focus();
                return;
            }
            
            // Show loading indicator
            loadingIndicator.style.display = 'block';
            outputText.style.opacity = '0.5';
            
            try {
                const humanizedText = await convertText(text, currentMode);
                outputText.textContent = humanizedText;
                showNotification(`Text converted using ${getModeName(currentMode)}`, 'success');
            } catch (error) {
                console.error('Conversion error:', error);
                
                // Fallback to local conversion if API fails
                const fallbackText = fallbackConversion(text, currentMode);
                outputText.textContent = fallbackText;
                
                showNotification(`API connection issue. Using local conversion for ${getModeName(currentMode)}`, 'warning');
            } finally {
                // Hide loading indicator
                loadingIndicator.style.display = 'none';
                outputText.style.opacity = '1';
            }
        });
        
        // Convert text using OpenRouter API
        async function convertText(text, mode) {
            const prompt = createPromptForMode(text, mode);
            
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "sao10k/l3-lunaris-8b",
                    "messages": [
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "max_tokens": 1000
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'API request failed');
            }
            
            const data = await response.json();
            return data.choices[0].message.content.trim();
        }
        
        // Create prompt for specific mode
        function createPromptForMode(text, mode) {
            const modeInstructions = {
                student: `Rewrite the following text in Student Mode: "Written the way a real student writes." Make it simple and straightforward with mild, natural imperfections. Use short to medium-length sentences, easy school/college-level vocabulary, and a light conversational tone. Break complex sentences into simpler ones and convert rigid, structured points into a smooth natural flow. Here's the text to rewrite: "${text}"`,
                
                blog: `Rewrite the following text in Blog Mode: "Written with opinion and personality." Make it personal and expressive with opinions and perspective. Use first-person thinking ("I think", "In my experience"), a balanced mix of emotion and reasoning, varied sentence length, and natural emphasis words (honestly, actually, interestingly). Remove neutral, generic AI tone and inject personal bias and viewpoint. Here's the text to rewrite: "${text}"`,
                
                exam: `Rewrite the following text in Exam-Safe Mode: "Formal, clear, but not robotic." Ensure a formal academic tone with high grammatical clarity but avoid overly perfect AI-like phrasing. Use proper academic language, clear structure (introduction → explanation → conclusion), no slang or filler words, and maintain a human-written feel without informality. Here's the text to rewrite: "${text}"`
            };
            
            return modeInstructions[mode] || modeInstructions.student;
        }
        
        // Fallback conversion for when API is unavailable
        function fallbackConversion(text, mode) {
            // Simple transformations based on mode
            const sentences = text.split('. ').filter(s => s.trim());
            
            if (mode === 'student') {
                return sentences.map(s => 
                    s.replace(/significant/g, 'important')
                     .replace(/modern/g, 'today\'s')
                     .replace(/enhances productivity/g, 'helps us get more done')
                     .replace(/automating tasks/g, 'doing tasks automatically')
                     .replace(/improving efficiency/g, 'making things work better')
                ).join('. ') + '.';
            } else if (mode === 'blog') {
                return sentences.map((s, i) => {
                    if (i === 0) return s;
                    return `Personally, I think ${s.toLowerCase()}`;
                }).join('. ') + '. In my experience, this has been really helpful for many people.';
            } else if (mode === 'exam') {
                return sentences.map(s => 
                    s.replace(/plays a significant role/g, 'has an important function')
                     .replace(/enhances productivity/g, 'improves productivity')
                ).join('. ') + '. As a result, it plays an important role in contemporary systems.';
            }
            
            return text;
        }
        
        // Get display name for mode
        function getModeName(mode) {
            const names = {
                student: 'Student Mode',
                blog: 'Blog Mode',
                exam: 'Exam-Safe Mode'
            };
            return names[mode] || 'Student Mode';
        }
        
        // Show notification
        function showNotification(message, type = 'info') {
            notification.textContent = message;
            notification.className = 'notification';
            
            // Add type class
            if (type === 'success') {
                notification.style.backgroundColor = '#4CAF50';
            } else if (type === 'error') {
                notification.style.backgroundColor = '#f44336';
            } else if (type === 'warning') {
                notification.style.backgroundColor = '#FF9800';
            } else {
                notification.style.backgroundColor = '#4a6fa5';
            }
            
            notification.classList.add('show');
            
            // Hide after 3 seconds
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
        
        // Demo conversion on page load
        window.addEventListener('DOMContentLoaded', () => {
            // Show a welcome notification
            setTimeout(() => {
                showNotification('Welcome to GoAIFree! Enter your API key and start converting AI text.', 'info');
            }, 1000);
            
            // If API key exists, show a demo
            if (apiKey) {
                const demoText = "Artificial Intelligence plays a significant role in modern education systems.";
                const demoOutput = fallbackConversion(demoText, currentMode);
                outputText.textContent = demoOutput;
            }
        });
   