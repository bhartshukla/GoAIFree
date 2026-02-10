
        // Main application JavaScript
        document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const aiText = document.getElementById('aiText');
            const humanText = document.getElementById('humanText');
            const humanizeBtn = document.getElementById('humanizeBtn');
            const copyBtn = document.getElementById('copyBtn');
            const downloadBtn = document.getElementById('downloadBtn');
            const clearInputBtn = document.getElementById('clearInputBtn');
            const pasteBtn = document.getElementById('pasteBtn');
            const apiSettingsBtn = document.getElementById('apiSettingsBtn');
            const helpBtn = document.getElementById('helpBtn');
            const closeApiModal = document.getElementById('closeApiModal');
            const closeHelpModal = document.getElementById('closeHelpModal');
            const apiModal = document.getElementById('apiModal');
            const helpModal = document.getElementById('helpModal');
            const testApiBtn = document.getElementById('testApiBtn');
            const saveApiBtn = document.getElementById('saveApiBtn');
            const apiToggle = document.getElementById('apiToggle');
            const modeLabel = document.getElementById('modeLabel');
            const apiStatus = document.getElementById('apiStatus');
            const totalConversions = document.getElementById('totalConversions');
            const todayConversions = document.getElementById('todayConversions');
            const remainingConversions = document.getElementById('remainingConversions');
            const progressContainer = document.getElementById('progressContainer');
            const progress = document.getElementById('progress');
            const progressText = document.getElementById('progressText');
            const qualityDots = document.getElementById('qualityDots');
            const qualityScore = document.getElementById('qualityScore');
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');
            
            // Application state
            const state = {
                apiKey: localStorage.getItem('goAIFree_apiKey') || '',
                apiModel: localStorage.getItem('goAIFree_apiModel') || 'sao10k/l3-lunaris-8b',
                maxConversions: parseInt(localStorage.getItem('goAIFree_maxConversions')) || 100,
                fallbackMode: localStorage.getItem('goAIFree_fallbackMode') !== 'false',
                useApi: localStorage.getItem('goAIFree_useApi') === 'true',
                totalConversionsCount: parseInt(localStorage.getItem('goAIFree_totalConversions')) || 0,
                todayConversionsCount: parseInt(localStorage.getItem('goAIFree_todayConversions')) || 0,
                lastConversionDate: localStorage.getItem('goAIFree_lastConversionDate') || '',
                apiConnected: false
            };
            
            // Initialize the application
            function init() {
                // Load saved settings
                document.getElementById('apiKey').value = state.apiKey;
                document.getElementById('apiModel').value = state.apiModel;
                document.getElementById('maxConversions').value = state.maxConversions;
                document.getElementById('fallbackToggle').checked = state.fallbackMode;
                apiToggle.checked = state.useApi;
                
                // Update UI based on state
                updateModeLabel();
                updateStats();
                resetDateIfNeeded();
                
                // Check API connection if API is enabled
                if (state.useApi && state.apiKey) {
                    checkApiConnection();
                }
            }
            
            // Update mode label based on toggle
            function updateModeLabel() {
                modeLabel.textContent = state.useApi ? 'API Processing' : 'Local Processing';
                apiStatus.textContent = state.useApi ? (state.apiConnected ? 'Online' : 'Offline') : 'Local';
                apiStatus.style.color = state.useApi ? (state.apiConnected ? '#4CAF50' : '#F44336') : '#FF9800';
            }
            
            // Update statistics display
            function updateStats() {
                totalConversions.textContent = state.totalConversionsCount;
                todayConversions.textContent = state.todayConversionsCount;
                
                const remaining = state.maxConversions - state.todayConversionsCount;
                remainingConversions.textContent = remaining > 0 ? remaining : '0';
                remainingConversions.style.color = remaining > 10 ? '#4CAF50' : (remaining > 0 ? '#FF9800' : '#F44336');
            }
            
            // Reset conversions if it's a new day
            function resetDateIfNeeded() {
                const today = new Date().toDateString();
                if (state.lastConversionDate !== today) {
                    state.todayConversionsCount = 0;
                    state.lastConversionDate = today;
                    saveToLocalStorage('goAIFree_todayConversions', 0);
                    saveToLocalStorage('goAIFree_lastConversionDate', today);
                    updateStats();
                }
            }
            
            // Save value to localStorage
            function saveToLocalStorage(key, value) {
                localStorage.setItem(key, value);
            }
            
            // Show toast notification
            function showToast(message, isError = false) {
                toastMessage.textContent = message;
                toast.style.backgroundColor = isError ? '#F44336' : '#4361ee';
                toast.style.display = 'flex';
                
                setTimeout(() => {
                    toast.style.display = 'none';
                }, 3000);
            }
            
            // Update quality indicator
            function updateQualityIndicator(quality) {
                const dots = qualityDots.querySelectorAll('.quality-dot');
                dots.forEach((dot, index) => {
                    if (index < quality / 20) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
                qualityScore.textContent = `${quality}%`;
            }
            
            // Simulate API call for humanization
            async function humanizeWithAPI(text, style, creativity) {
                // In a real implementation, this would call the OpenRouter API
                // For this demo, we'll simulate an API call
                
                return new Promise((resolve) => {
                    setTimeout(() => {
                        // Simulate different humanization based on style
                        let humanized = text;
                        
                        if (style === 'student') {
                            humanized = text.replace(/utilize/g, 'use')
                                          .replace(/commence/g, 'start')
                                          .replace(/endeavor/g, 'try')
                                          .replace(/additional/g, 'more')
                                          .replace(/facilitate/g, 'help');
                        } else if (style === 'blog') {
                            humanized = text.replace(/In conclusion/g, 'To wrap things up')
                                          .replace(/Furthermore/g, 'What\'s more')
                                          .replace(/However/g, 'That said')
                                          .replace(/Therefore/g, 'So')
                                          .replace(/Thus/g, 'As a result');
                        } else if (style === 'exam') {
                            humanized = text.replace(/It is important to note/g, 'It should be noted')
                                          .replace(/In my opinion/g, 'From my perspective')
                                          .replace(/To sum up/g, 'In summary')
                                          .replace(/For example/g, 'For instance')
                                          .replace(/Because/g, 'Due to the fact that');
                        } else if (style === 'casual') {
                            humanized = text.replace(/subsequently/g, 'then')
                                          .replace(/consequently/g, 'so')
                                          .replace(/nevertheless/g, 'still')
                                          .replace(/furthermore/g, 'also')
                                          .replace(/notwithstanding/g, 'though');
                        } else if (style === 'professional') {
                            humanized = text.replace(/get/g, 'obtain')
                                          .replace(/make sure/g, 'ensure')
                                          .replace(/a lot of/g, 'numerous')
                                          .replace(/cheap/g, 'cost-effective')
                                          .replace(/easy/g, 'straightforward');
                        }
                        
                        // Add some human-like variations based on creativity
                        if (creativity === 'medium') {
                            humanized = humanized.replace(/\. /g, (match, offset) => {
                                return offset % 3 === 0 ? '. Well, ' : '. ';
                            });
                        } else if (creativity === 'high') {
                            humanized = humanized.replace(/\. /g, (match, offset) => {
                                const variations = ['. You know, ', '. Actually, ', '. I mean, ', '. So, '];
                                return offset % 2 === 0 ? variations[offset % variations.length] : '. ';
                            });
                        }
                        
                        resolve({
                            success: true,
                            text: humanized,
                            quality: Math.floor(Math.random() * 30) + 70 // Random quality between 70-100%
                        });
                    }, 2000);
                });
            }
            
            // Local humanization (fallback)
            function humanizeLocally(text, style, creativity) {
                // Simple local humanization algorithm
                let humanized = text;
                
                // Replace AI-sounding phrases
                const aiPatterns = [
                    [/As an AI language model/g, ''],
                    [/I'm an AI assistant/g, ''],
                    [/I am an AI/g, ''],
                    [/based on my training data/g, 'based on available information'],
                    [/according to my knowledge/g, 'from what I understand'],
                    [/It is worth noting/g, 'It\'s important to note'],
                    [/It is important to/g, 'We should'],
                    [/One might argue/g, 'Some people think'],
                    [/It can be observed that/g, 'We can see that'],
                    [/This suggests that/g, 'This means that']
                ];
                
                aiPatterns.forEach(pattern => {
                    humanized = humanized.replace(pattern[0], pattern[1]);
                });
                
                // Add human-like errors occasionally
                if (creativity !== 'low') {
                    const sentences = humanized.split('. ');
                    if (sentences.length > 2) {
                        const randomIndex = Math.floor(Math.random() * (sentences.length - 1));
                        sentences[randomIndex] = sentences[randomIndex] + ', uh,';
                        humanized = sentences.join('. ');
                    }
                }
                
                // Calculate a simple quality score
                const aiPhraseCount = aiPatterns.reduce((count, pattern) => {
                    return count + (text.match(pattern[0]) || []).length;
                }, 0);
                
                const quality = Math.max(30, 100 - (aiPhraseCount * 10));
                
                return {
                    success: true,
                    text: humanized,
                    quality: quality
                };
            }
            
            // Check API connection
            async function checkApiConnection() {
                if (!state.apiKey) {
                    state.apiConnected = false;
                    updateModeLabel();
                    showToast('No API key configured', true);
                    return;
                }
                
                testApiBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
                testApiBtn.disabled = true;
                
                // Simulate API test (in reality, this would be a real API call)
                setTimeout(() => {
                    state.apiConnected = Math.random() > 0.3; // 70% chance of success for demo
                    updateModeLabel();
                    
                    if (state.apiConnected) {
                        showToast('API connection successful!');
                    } else {
                        showToast('API connection failed. Using local mode.', true);
                    }
                    
                    testApiBtn.innerHTML = '<i class="fas fa-plug"></i> Test API Connection';
                    testApiBtn.disabled = false;
                }, 1500);
            }
            
            // Humanize text
            async function humanizeText() {
                const text = aiText.value.trim();
                if (!text) {
                    showToast('Please enter some text to humanize', true);
                    return;
                }
                
                // Check daily limit
                if (state.todayConversionsCount >= state.maxConversions) {
                    showToast(`Daily limit reached (${state.maxConversions}). Try again tomorrow.`, true);
                    return;
                }
                
                const style = document.getElementById('writingStyle').value;
                const creativity = document.getElementById('creativityLevel').value;
                
                // Show progress
                progressContainer.style.display = 'block';
                progress.style.width = '0%';
                progressText.textContent = 'Starting humanization...';
                humanizeBtn.disabled = true;
                
                // Simulate progress
                let progressValue = 0;
                const progressInterval = setInterval(() => {
                    progressValue += Math.random() * 10;
                    if (progressValue > 90) progressValue = 90;
                    progress.style.width = `${progressValue}%`;
                    
                    if (progressValue < 30) {
                        progressText.textContent = 'Analyzing AI patterns...';
                    } else if (progressValue < 60) {
                        progressText.textContent = 'Rewriting text in human style...';
                    } else {
                        progressText.textContent = 'Applying finishing touches...';
                    }
                }, 300);
                
                try {
                    let result;
                    
                    if (state.useApi && state.apiConnected) {
                        progressText.textContent = 'Connecting to API...';
                        result = await humanizeWithAPI(text, style, creativity);
                    } else {
                        progressText.textContent = 'Processing locally...';
                        result = humanizeLocally(text, style, creativity);
                    }
                    
                    clearInterval(progressInterval);
                    progress.style.width = '100%';
                    progressText.textContent = 'Humanization complete!';
                    
                    if (result.success) {
                        humanText.value = result.text;
                        updateQualityIndicator(result.quality);
                        
                        // Update stats
                        state.totalConversionsCount++;
                        state.todayConversionsCount++;
                        saveToLocalStorage('goAIFree_totalConversions', state.totalConversionsCount);
                        saveToLocalStorage('goAIFree_todayConversions', state.todayConversionsCount);
                        saveToLocalStorage('goAIFree_lastConversionDate', new Date().toDateString());
                        updateStats();
                        
                        showToast('Text humanized successfully!');
                    } else {
                        showToast('Humanization failed. Please try again.', true);
                    }
                } catch (error) {
                    clearInterval(progressInterval);
                    showToast('An error occurred: ' + error.message, true);
                } finally {
                    setTimeout(() => {
                        progressContainer.style.display = 'none';
                        humanizeBtn.disabled = false;
                    }, 1000);
                }
            }
            
            // Copy humanized text to clipboard
            function copyToClipboard() {
                if (!humanText.value.trim()) {
                    showToast('No text to copy', true);
                    return;
                }
                
                humanText.select();
                document.execCommand('copy');
                
                // For modern browsers
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(humanText.value);
                }
                
                showToast('Text copied to clipboard!');
            }
            
            // Download humanized text
            function downloadText() {
                if (!humanText.value.trim()) {
                    showToast('No text to download', true);
                    return;
                }
                
                const text = humanText.value;
                const style = document.getElementById('writingStyle').value;
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `humanized-text-${style}-${new Date().getTime()}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                showToast('Text downloaded!');
            }
            
            // Paste from clipboard
            async function pasteFromClipboard() {
                try {
                    const clipboardText = await navigator.clipboard.readText();
                    aiText.value = clipboardText;
                    showToast('Text pasted from clipboard!');
                } catch (err) {
                    // Fallback for browsers that don't support clipboard API
                    aiText.focus();
                    document.execCommand('paste');
                    showToast('Text pasted!');
                }
            }
            
            // Event Listeners
            humanizeBtn.addEventListener('click', humanizeText);
            
            copyBtn.addEventListener('click', copyToClipboard);
            
            downloadBtn.addEventListener('click', downloadText);
            
            clearInputBtn.addEventListener('click', () => {
                aiText.value = '';
                aiText.focus();
                showToast('Input cleared');
            });
            
            pasteBtn.addEventListener('click', pasteFromClipboard);
            
            apiSettingsBtn.addEventListener('click', () => {
                apiModal.style.display = 'flex';
            });
            
            helpBtn.addEventListener('click', () => {
                helpModal.style.display = 'flex';
            });
            
            closeApiModal.addEventListener('click', () => {
                apiModal.style.display = 'none';
            });
            
            closeHelpModal.addEventListener('click', () => {
                helpModal.style.display = 'none';
            });
            
            // Close modals when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === apiModal) {
                    apiModal.style.display = 'none';
                }
                if (e.target === helpModal) {
                    helpModal.style.display = 'none';
                }
            });
            
            testApiBtn.addEventListener('click', checkApiConnection);
            
            saveApiBtn.addEventListener('click', () => {
                state.apiKey = document.getElementById('apiKey').value;
                state.apiModel = document.getElementById('apiModel').value;
                state.maxConversions = parseInt(document.getElementById('maxConversions').value);
                state.fallbackMode = document.getElementById('fallbackToggle').checked;
                
                saveToLocalStorage('goAIFree_apiKey', state.apiKey);
                saveToLocalStorage('goAIFree_apiModel', state.apiModel);
                saveToLocalStorage('goAIFree_maxConversions', state.maxConversions);
                saveToLocalStorage('goAIFree_fallbackMode', state.fallbackMode);
                
                updateStats();
                showToast('Settings saved successfully!');
                
                // Check API connection if API key is provided
                if (state.apiKey && state.useApi) {
                    checkApiConnection();
                }
            });
            
            apiToggle.addEventListener('change', () => {
                state.useApi = apiToggle.checked;
                saveToLocalStorage('goAIFree_useApi', state.useApi);
                updateModeLabel();
                
                if (state.useApi && state.apiKey) {
                    checkApiConnection();
                }
            });
            
            // Example text for demo
            aiText.value = "As an AI language model, I can provide information on various topics. It is important to note that AI systems like myself are trained on extensive datasets to generate human-like text. However, one might argue that AI-generated content sometimes lacks the nuanced understanding and emotional depth that characterizes authentic human communication. Furthermore, it can be observed that AI text often exhibits certain patterns that sophisticated detection algorithms can identify. In conclusion, while AI has made significant advancements in natural language processing, distinguishing between AI-generated and human-written text remains an active area of research.";
            
            // Initialize the app
            init();
        });
