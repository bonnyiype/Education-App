document.addEventListener('DOMContentLoaded', function() {
    const numberGrid = document.getElementById('numberGrid');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageInfo = document.getElementById('pageInfo');
    const toggleBtn = document.getElementById('toggleMode');
    const toggleLowerCase = document.getElementById('toggleLowerCase');
    const toggleColorsBtn = document.getElementById('toggleColors');
    const toggleSightWordsBtn = document.getElementById('toggleSightWords');
    const toggleEmotionsBtn = document.getElementById('toggleEmotions');
    const pageTitle = document.querySelector('h1');
    const toggleShapesBtn = document.getElementById('toggleShapes');
    const toggleFixedSightWordsBtn = document.getElementById('toggleFixedSightWords');
    const toggleCVCMatchingBtn = document.getElementById('toggleCVCMatching');
    
    const sightWords = [
        // Basic Sight Words
        "a", "and", "away", "big", "blue", "can", "come", "down", "find", "for",
        "funny", "go", "help", "here", "I", "in", "is", "it", "jump", "little",
        "look", "make", "me", "my", "not", "one", "play", "red", "run", "said",
        "see", "the", "three", "to", "two", "up", "we", "where", "yellow", "you",
        
        // Common Action Words
        "eat", "drink", "sleep", "walk", "run", "jump", "sit", "stand", "read", "write",
        "draw", "color", "play", "sing", "dance", "give", "take", "open", "close", "stop",
        
        // Colors and Numbers
        "red", "blue", "green", "yellow", "black", "white", "one", "two", "three", "four",
        "five", "six", "seven", "eight", "nine", "ten",
        
        // Family Words
        "mom", "dad", "sister", "brother", "family", "grandma", "grandpa", "baby", "friend", "teacher",
        
        // Food Words
        "food", "water", "milk", "juice", "bread", "cookie", "apple", "banana", "pizza", "snack",
        
        // Feeling Words
        "happy", "sad", "mad", "tired", "hungry", "thirsty", "hot", "cold", "sick", "better",
        
        // Question Words
        "what", "where", "when", "who", "why", "how",
        
        // Common Phrases
        "thank you", "please", "help me", "I want", "I need", "I like", "I see", "I can",
        "good job", "all done"
    ];

    const colors = [
        { name: 'Red', hex: '#FF0000' },
        { name: 'Blue', hex: '#0000FF' },
        { name: 'Yellow', hex: '#FFFF00' },
        { name: 'Green', hex: '#008000' },
        { name: 'Orange', hex: '#FFA500' },
        { name: 'Purple', hex: '#800080' },
        { name: 'Pink', hex: '#FFC0CB' },
        { name: 'Brown', hex: '#8B4513' },
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Gray', hex: '#808080' },
        { name: 'Gold', hex: '#FFD700' }
    ];
    
    let currentPage = 1;
    let isNumberMode = true;
    let isUpperCase = true;
    let isColorMode = false;
    let isSightWordsMode = false;
    let targetWord = '';
    let score = 0;
    let total = 0;
    let feedback = '';
    let isCorrect = null;
    let celebration = false;
    const numbersPerPage = 10;
    const startNumber = 1;
    const endNumber = 50;
    let isEmotionsMode = false;
    let isShapesMode = false;
    let isFixedSightWordsMode = false;
    let isCVCMode = false;
    let isLowerCaseMode = false;
    let isTimerMode = false;
    
    const emotions = [
        { name: 'Happy', emoji: '😊', category: 'basic' },
        { name: 'Sad', emoji: '😢', category: 'basic' },
        { name: 'Angry', emoji: '😠', category: 'basic' },
        { name: 'Surprised', emoji: '😮', category: 'basic' },
        { name: 'Scared', emoji: '😨', category: 'basic' },
        { name: 'Tired', emoji: '😫', category: 'physical' },
        { name: 'Sleepy', emoji: '😴', category: 'physical' },
        { name: 'Sick', emoji: '🤒', category: 'physical' },
        { name: 'Hurt', emoji: '🤕', category: 'physical' },
        { name: 'Hungry', emoji: '😋', category: 'physical' },
        { name: 'Thirsty', emoji: '🥤', category: 'physical' },
        { name: 'Excited', emoji: '🤩', category: 'mood' },
        { name: 'Bored', emoji: '😑', category: 'mood' },
        { name: 'Silly', emoji: '🤪', category: 'mood' },
        { name: 'Calm', emoji: '😌', category: 'mood' },
        { name: 'Loved', emoji: '🥰', category: 'mood' }
    ];

    const shapes = [
        {
            name: 'Circle',
            svg: '<circle cx="60" cy="60" r="50" stroke="black" stroke-width="3"/>',
        },
        {
            name: 'Square',
            svg: '<rect x="10" y="10" width="100" height="100" stroke="black" stroke-width="3"/>',
        },
        {
            name: 'Triangle',
            svg: '<polygon points="60,10 110,110 10,110" stroke="black" stroke-width="3"/>',
        },
        {
            name: 'Rectangle',
            svg: '<rect x="10" y="30" width="100" height="60" stroke="black" stroke-width="3"/>',
        },
        {
            name: 'Diamond',
            svg: '<polygon points="60,10 110,60 60,110 10,60" stroke="black" stroke-width="3"/>',
        },
        {
            name: 'Star',
            svg: '<path d="M60,10 L70,40 L100,40 L75,60 L85,90 L60,70 L35,90 L45,60 L20,40 L50,40 Z" stroke="black" stroke-width="3"/>',
        },
        {
            name: 'Heart',
            svg: '<path d="M60,100 L90,70 A20,20 0 1,0 60,50 A20,20 0 1,0 30,70 Z" stroke="black" stroke-width="3"/>',
        },
        {
            name: 'Oval',
            svg: '<ellipse cx="60" cy="60" rx="50" ry="30" stroke="black" stroke-width="3"/>',
        }
    ];

    function getRandomWords(exclude, count = 2) {
        const availableWords = sightWords.filter(word => word !== exclude);
        const randomWords = [];
        while (randomWords.length < count) {
            const randomIndex = Math.floor(Math.random() * availableWords.length);
            const word = availableWords[randomIndex];
            if (!randomWords.includes(word)) {
                randomWords.push(word);
            }
        }
        return randomWords;
    }

    function getLetterForNumber(num) {
        if (num > 26) return num; // Return numbers above 26 as is
        const charCode = 64 + num; // ASCII for uppercase letters
        return isUpperCase ? String.fromCharCode(charCode) : String.fromCharCode(charCode + 32);
    }

    function createBox(value, number, isColor = false) {
        const box = document.createElement('div');
        box.className = isColor ? 'number-box color-box' : 'number-box';
        box.setAttribute('data-number', number);
        
        if (isColor) {
            box.style.backgroundColor = value.hex;
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = value.name;
            box.appendChild(tooltip);
            
            // Add click handler for colors
            box.addEventListener('click', function() {
                if (this.classList.contains('selected')) {
                    this.classList.remove('selected');
                } else {
                    const allBoxes = document.querySelectorAll('.color-box');
                    allBoxes.forEach(b => b.classList.remove('selected'));
                    this.classList.add('selected');
                    
                    // Speak the color name
                    const utterance = new SpeechSynthesisUtterance(value.name);
                    utterance.rate = 0.8; // Slightly slower
                    utterance.pitch = 1.2; // Slightly higher pitch
                    speechSynthesis.speak(utterance);
                }
            });
        } else {
            box.textContent = value;
            box.addEventListener('click', function() {
                if (this.classList.contains('selected')) {
                    this.classList.remove('selected');
                } else {
                    const allBoxes = document.querySelectorAll('.number-box');
                    allBoxes.forEach(b => b.classList.remove('selected'));
                    this.classList.add('selected');
                    
                    // Simply speak the value for all cases
                    const utterance = new SpeechSynthesisUtterance(value.toString());
                    utterance.rate = 0.8;
                    utterance.pitch = 1.2;
                    speechSynthesis.speak(utterance);
                }
            });
        }
        
        return box;
    }

    function updateSightWordsDisplay() {
        numberGrid.innerHTML = '';
        numberGrid.className = 'number-grid sight-words-mode';
        
        // Create score display
        const scoreDisplay = document.createElement('div');
        scoreDisplay.className = 'score-display';
        scoreDisplay.innerHTML = `Score: ${score}/${total}`;
        numberGrid.appendChild(scoreDisplay);
        
        // Create target word container
        const targetContainer = document.createElement('div');
        targetContainer.className = 'target-container';
        
        // Create target word box (displayed at the top)
        const targetBox = document.createElement('div');
        targetBox.className = 'number-box word-option target-word';
        targetBox.textContent = targetWord;
        targetContainer.appendChild(targetBox);
        numberGrid.appendChild(targetContainer);
        
        // Speak the target word aloud (for "read" concept)
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(targetWord);
            utterance.rate = 0.8;
            utterance.pitch = 1.2;
            speechSynthesis.speak(utterance);
        }, 500);
        
        // Create options container
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-container';
        
        // Get two wrong words (different from target)
        let wrongOptions = getRandomWords(targetWord, 2);
        
        // Randomly replace one wrong option with a blank card (shown as "___")
        if (Math.random() < 0.5) {
            const indexToReplace = Math.floor(Math.random() * wrongOptions.length);
            wrongOptions[indexToReplace] = "";
        }
        
        // Prepare all options: target word and the wrong options
        const allOptions = [...wrongOptions, targetWord];
        const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
        
        // Create each option box
        shuffledOptions.forEach((word) => {
            const box = document.createElement('div');
            box.className = 'number-box word-option';
            // Show a placeholder for blank cards
            box.textContent = word === "" ? "___" : word;
            box.setAttribute('data-word', word);
            
            box.addEventListener('click', function() {
                handleWordClick(word);
            });
            
            optionsContainer.appendChild(box);
        });
        
        numberGrid.appendChild(optionsContainer);
        
        // Create feedback display if any feedback exists
        if (feedback) {
            const feedbackDisplay = document.createElement('div');
            feedbackDisplay.className = `feedback-display ${isCorrect ? 'correct' : 'incorrect'}`;
            feedbackDisplay.innerHTML = `
                ${feedback}
                ${celebration ? '<div class="celebration">✨ 🎈 ⭐️</div>' : ''}
            `;
            numberGrid.appendChild(feedbackDisplay);
        }
    }

    function handleWordClick(selectedWord) {
        total++;
        
        // Get the clicked box (only if it is not the target word display)
        const clickedBox = document.querySelector(`.word-option[data-word="${selectedWord}"]:not(.target-word)`);
        if (clickedBox) {
            if (clickedBox.classList.contains('selected')) {
                clickedBox.classList.remove('selected');
                return;
            } else {
                const allWordBoxes = document.querySelectorAll('.word-option');
                allWordBoxes.forEach(box => box.classList.remove('selected'));
                clickedBox.classList.add('selected');
                
                // Speak the selected word aloud (if it is not blank)
                if (selectedWord !== "") {
                    const utterance = new SpeechSynthesisUtterance(selectedWord);
                    utterance.rate = 0.8;
                    utterance.pitch = 1.2;
                    speechSynthesis.speak(utterance);
                }
            }
        }
        
        // Check if the selected word is the target (blank cards will not match)
        if (selectedWord === targetWord) {
            score++;
            feedback = 'Wonderful! 🌟';
            isCorrect = true;
            celebration = true;

            // Add matched styling to both target and selected boxes
            const targetWordBox = document.querySelector('.target-word');
            const selectedWordBox = document.querySelector(`.word-option[data-word="${selectedWord}"]:not(.target-word)`);
            
            if (targetWordBox && selectedWordBox) {
                targetWordBox.classList.add('matched');
                selectedWordBox.classList.add('matched');
                
                // Speak "Correct!" after a short delay
                setTimeout(() => {
                    const correctUtterance = new SpeechSynthesisUtterance("Correct!");
                    correctUtterance.rate = 0.8;
                    correctUtterance.pitch = 1.2;
                    speechSynthesis.speak(correctUtterance);
                }, 1000);
            }

            // After a delay, set a new target word and update the display
            setTimeout(() => {
                targetWord = sightWords[Math.floor(Math.random() * sightWords.length)];
                updateSightWordsDisplay();
                
                // Speak the new target word aloud
                setTimeout(() => {
                    const newWordUtterance = new SpeechSynthesisUtterance(targetWord);
                    newWordUtterance.rate = 0.8;
                    newWordUtterance.pitch = 1.2;
                    speechSynthesis.speak(newWordUtterance);
                }, 500);
            }, 2000);
        } else {
            // If the selection is not correct (including a blank card), provide feedback
            feedback = selectedWord === "" ? "That's a blank card. Try finding the matching word! 💪" : "Let's try again! 💪";
            isCorrect = false;
            celebration = false;
            updateSightWordsDisplay();
            
            // Reapply the selected state after redraw
            const newClickedBox = document.querySelector(`.word-option[data-word="${selectedWord}"]:not(.target-word)`);
            if (newClickedBox) {
                newClickedBox.classList.add('selected');
            }
        }
    }

    function createEmotionBox(emotion) {
        const box = document.createElement('div');
        box.className = 'emotion-box';
        box.setAttribute('data-category', emotion.category);
        
        const emojiDiv = document.createElement('div');
        emojiDiv.className = 'emoji';
        emojiDiv.textContent = emotion.emoji;
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'emotion-name';
        nameDiv.textContent = emotion.name;
        
        box.appendChild(emojiDiv);
        box.appendChild(nameDiv);
        
        box.addEventListener('click', function() {
            // Remove selection from other boxes
            const allBoxes = document.querySelectorAll('.emotion-box');
            allBoxes.forEach(b => b.classList.remove('selected'));
            
            // Add selection to clicked box
            this.classList.add('selected');
            
            // Speak the emotion name
            const utterance = new SpeechSynthesisUtterance(emotion.name);
            utterance.rate = 0.8; // Slightly slower
            utterance.pitch = 1.2; // Slightly higher pitch
            speechSynthesis.speak(utterance);
        });
        
        return box;
    }

    function createShapeBox(shape) {
        const box = document.createElement('div');
        box.className = 'shape-box';
        
        const svgContainer = document.createElement('div');
        svgContainer.className = 'shape-svg';
        svgContainer.innerHTML = `<svg viewBox="0 0 120 120">${shape.svg}</svg>`;
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'shape-name';
        nameDiv.textContent = shape.name;
        
        box.appendChild(svgContainer);
        box.appendChild(nameDiv);
        
        box.addEventListener('click', function() {
            // Remove selection from other boxes
            const allBoxes = document.querySelectorAll('.shape-box');
            allBoxes.forEach(b => b.classList.remove('selected'));
            
            // Add selection to clicked box
            this.classList.add('selected');
            
            // Speak the shape name
            const utterance = new SpeechSynthesisUtterance(shape.name);
            utterance.rate = 0.8; // Slightly slower
            utterance.pitch = 1.2; // Slightly higher pitch
            speechSynthesis.speak(utterance);
        });
        
        return box;
    }

    function updatePage() {
        numberGrid.className = 'number-grid';
        
        if (isShapesMode) {
            numberGrid.innerHTML = '';
            shapes.forEach(shape => {
                const box = createShapeBox(shape);
                numberGrid.appendChild(box);
            });
            document.querySelector('.navigation').style.display = 'none';
        } else if (isEmotionsMode) {
            numberGrid.innerHTML = '';
            emotions.forEach(emotion => {
                const box = createEmotionBox(emotion);
                numberGrid.appendChild(box);
            });
            document.querySelector('.navigation').style.display = 'none';
        } else if (isColorMode) {
            numberGrid.innerHTML = '';
            colors.forEach((color, index) => {
                const box = createBox(color, index + 1, true);
                numberGrid.appendChild(box);
            });
            document.querySelector('.navigation').style.display = 'none';
        } else if (isSightWordsMode) {
            if (!targetWord) {
                targetWord = sightWords[Math.floor(Math.random() * sightWords.length)];
            }
            updateSightWordsDisplay();
            document.querySelector('.navigation').style.display = 'none';
        } else if (isFixedSightWordsMode) {
            document.querySelector('.navigation').style.display = 'none';
            updateFixedSightWordsDisplay();
        } else if (isTimerMode) {
            // Timer mode handling
            // ... existing code ...
        } else {
            numberGrid.innerHTML = '';
            document.querySelector('.navigation').style.display = 'flex';
            
            const maxEnd = isNumberMode ? endNumber : 26;  // Use 26 as max for letter mode
            const start = (currentPage - 1) * numbersPerPage + 1;
            const end = Math.min(start + numbersPerPage - 1, maxEnd);
            
            for (let i = start; i <= end; i++) {
                const value = isNumberMode ? i : getLetterForNumber(i);
                const box = createBox(value, i);
                numberGrid.appendChild(box);
            }
            
            pageInfo.textContent = `Page ${currentPage}`;
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = end >= maxEnd;  // Use maxEnd instead of endNumber
        }
    }

    // Initialize first page
    updatePage();

    // Add navigation handlers
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePage();
        }
    });

    nextBtn.addEventListener('click', () => {
        if ((currentPage * numbersPerPage) < endNumber) {
            currentPage++;
            updatePage();
        }
    });

    // Add toggle handlers
    toggleBtn.addEventListener('click', () => {
        if (!isColorMode && !isSightWordsMode) {
            isNumberMode = !isNumberMode;
            isUpperCase = true; // Reset to uppercase when switching to letters
            toggleBtn.textContent = isNumberMode ? 'Switch to Letters' : 'Switch to Numbers';
            toggleLowerCase.style.display = isNumberMode ? 'none' : 'block';
            pageTitle.textContent = isNumberMode ? 'Select a Number' : 'Select a Letter';
            updatePage();
        }
    });

    toggleLowerCase.addEventListener('click', () => {
        if (!isNumberMode && !isColorMode && !isSightWordsMode) {
            isUpperCase = !isUpperCase;
            toggleLowerCase.textContent = isUpperCase ? 'Switch to Lowercase' : 'Switch to Uppercase';
            updatePage();
        }
    });

    toggleColorsBtn.addEventListener('click', () => {
        isColorMode = !isColorMode;
        isNumberMode = true;
        isSightWordsMode = false;
        
        toggleColorsBtn.textContent = isColorMode ? 'Switch to Numbers' : 'Switch to Colors';
        toggleBtn.style.display = isColorMode ? 'none' : 'block';
        toggleSightWordsBtn.style.display = isColorMode ? 'none' : 'block';
        pageTitle.textContent = isColorMode ? 'Select a Color' : 'Select a Number';
        
        currentPage = 1;
        updatePage();
    });

    toggleSightWordsBtn.addEventListener('click', () => {
        isSightWordsMode = !isSightWordsMode;
        isColorMode = false;
        isNumberMode = true;

        toggleSightWordsBtn.textContent = isSightWordsMode ? 'Back to Main Page' : 'Switch to Sight Words';
        toggleBtn.style.display = isSightWordsMode ? 'none' : 'block';
        toggleColorsBtn.style.display = isSightWordsMode ? 'none' : 'block';
        pageTitle.textContent = isSightWordsMode ? 'Word Matching Fun!' : 'Select a Number';

        if (isSightWordsMode) {
            score = 0;
            total = 0;
            feedback = '';
            isCorrect = null;
            celebration = false;
            targetWord = sightWords[Math.floor(Math.random() * sightWords.length)];
        } else {
            numberGrid.className = 'number-grid';
        }

        currentPage = 1;
        updatePage();
    });

    // Add emotions toggle handler
    toggleEmotionsBtn.addEventListener('click', () => {
        isEmotionsMode = !isEmotionsMode;
        isColorMode = false;
        isSightWordsMode = false;
        isNumberMode = true;

        toggleEmotionsBtn.textContent = isEmotionsMode ? 'Back to Main Page' : 'Switch to Emotions';
        toggleBtn.style.display = isEmotionsMode ? 'none' : 'block';
        toggleColorsBtn.style.display = isEmotionsMode ? 'none' : 'block';
        toggleSightWordsBtn.style.display = isEmotionsMode ? 'none' : 'block';
        pageTitle.textContent = isEmotionsMode ? 'Learn Emotions!' : 'Select a Number';

        currentPage = 1;
        updatePage();
    });

    // Add shapes toggle handler
    toggleShapesBtn.addEventListener('click', () => {
        isShapesMode = !isShapesMode;
        isEmotionsMode = false;
        isColorMode = false;
        isSightWordsMode = false;
        isNumberMode = true;

        toggleShapesBtn.textContent = isShapesMode ? 'Back to Main Page' : 'Switch to Shapes';
        toggleBtn.style.display = isShapesMode ? 'none' : 'block';
        toggleColorsBtn.style.display = isShapesMode ? 'none' : 'block';
        toggleSightWordsBtn.style.display = isShapesMode ? 'none' : 'block';
        toggleEmotionsBtn.style.display = isShapesMode ? 'none' : 'block';
        pageTitle.textContent = isShapesMode ? 'Learn Shapes!' : 'Select a Number';

        currentPage = 1;
        updatePage();
    });

    // Add BBC phonics button handler
    const bbcPhonicsBtn = document.getElementById('bbcPhonics');
    bbcPhonicsBtn.addEventListener('click', () => {
        window.open('https://www.bbc.co.uk/bitesize/topics/z7tr96f', '_blank');
    });

    // Initialize the lowercase button as hidden
    toggleLowerCase.style.display = 'none';

    // === TIMER FEATURE CODE ===
    
    // Get references to the timer elements
    const timerBtn = document.getElementById('timerBtn');
    const timerPage = document.getElementById('timerPage');
    const timerInput = document.getElementById('timerInput');
    const startTimerBtn = document.getElementById('startTimerBtn');
    const timerDisplay = document.getElementById('timerDisplay');
    const resetTimerBtn = document.getElementById('resetTimerBtn');
    const backToMainBtn = document.getElementById('backToMainBtn');
    
    // Also get references to existing main content elements
    const header = document.querySelector('.header');
    const navigation = document.querySelector('.navigation');
    
    // Global variable to hold the interval reference
    let timerInterval = null;
    
    // Function to show the timer page and hide main content
    function showTimerPage() {
        header.style.display = 'none';
        numberGrid.style.display = 'none';
        navigation.style.display = 'none';
        timerPage.style.display = 'block';
        // Clear previous timer display/input
        timerDisplay.textContent = '';
        timerInput.value = '';
        // If any timer is already running, clear it
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }
    
    // Function to return to main page and stop the timer if running
    function showMainPage() {
        timerPage.style.display = 'none';
        header.style.display = '';
        numberGrid.style.display = '';
        navigation.style.display = 'flex';
        // Clear timer if it is running
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        // Refresh the main page view
        updatePage();
    }
    
    // Attach event listener to Timer button in the dropdown menu
    timerBtn.addEventListener('click', showTimerPage);
    
    // Back button returns to the main app view and stops any timer
    backToMainBtn.addEventListener('click', showMainPage);
    
    // Start Timer button: after a short "Wait" message, count up from 1 to target
    startTimerBtn.addEventListener('click', function() {
        let target = parseInt(timerInput.value, 10);
        if (isNaN(target) || target <= 0 || target > 10000) {
            timerDisplay.textContent = "Please enter a valid number (1-10000)!";
            return;
        }
        
        // Clear any existing interval
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        
        // Show a "Wait" message for 1 second before starting the count
        timerDisplay.textContent = "Wait";
        timerDisplay.style.color = '#333';
        
        setTimeout(() => {
            let count = 1;
            timerInterval = setInterval(() => {
                if (count < target) {
                    timerDisplay.textContent = count;
                    timerDisplay.style.color = '#333';
                    // Speak the current number aloud
                    const utterance = new SpeechSynthesisUtterance(count.toString());
                    utterance.rate = 0.8;
                    utterance.pitch = 1.2;
                    speechSynthesis.speak(utterance);
                    count++;
                } else if (count === target) {
                    // For the final digit, display it in red
                    timerDisplay.textContent = count;
                    timerDisplay.style.color = '#f44336';
                    const utterance = new SpeechSynthesisUtterance(count.toString());
                    utterance.rate = 0.8;
                    utterance.pitch = 1.2;
                    speechSynthesis.speak(utterance);
                    
                    // After a short delay, speak "Time's up!"
                    setTimeout(() => {
                        const finishUtterance = new SpeechSynthesisUtterance("Time's up!");
                        finishUtterance.rate = 0.8;
                        finishUtterance.pitch = 1.2;
                        speechSynthesis.speak(finishUtterance);
                    }, 1000);
                    
                    clearInterval(timerInterval);
                    timerInterval = null;
                }
            }, 1000); // Update every second
        }, 1000);
    });
    
    // Reset Timer button: clear any running timer and reset display/input
    resetTimerBtn.addEventListener('click', function() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        timerDisplay.textContent = '';
        timerDisplay.style.color = '#333';
        timerInput.value = '';
    });

    //////////////////////////////
    // Fixed Sight Words Reading Mode Code
    //////////////////////////////

    const fixedSightWords = ["I", "Want", "Yes", "No", "Finish", "Wait"];
    let fixedTargetWord = "";

    toggleFixedSightWordsBtn.addEventListener('click', () => {
        isFixedSightWordsMode = !isFixedSightWordsMode;
        // Turn off other modes when Fixed mode is activated
        if (isFixedSightWordsMode) {
            isSightWordsMode = false;
            isEmotionsMode = false;
            isColorMode = false;
            toggleFixedSightWordsBtn.textContent = 'Back to Main Page';
        } else {
            toggleFixedSightWordsBtn.textContent = 'Fixed Sight Words';
        }
        currentPage = 1;
        updatePage();
    });

    function updateFixedSightWordsDisplay() {
        numberGrid.innerHTML = '';
        numberGrid.className = 'number-grid fixed-sight-words-mode';
        numberGrid.style.position = 'fixed';
        numberGrid.style.top = '50%';
        numberGrid.style.left = '50%';
        numberGrid.style.transform = 'translate(-50%, -50%)';
        
        // Set fixed target word if not already set
        if (!fixedTargetWord) {
            fixedTargetWord = fixedSightWords[Math.floor(Math.random() * fixedSightWords.length)];
        }
        
        // Speak the target word aloud after 500ms
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(fixedTargetWord);
            utterance.rate = 0.8;
            utterance.pitch = 1.2;
            speechSynthesis.speak(utterance);
        }, 500);
        
        // Prepare exactly 3 options: one is the target and two distractors from sightWords
        let available = sightWords.filter(word => word !== fixedTargetWord);
        let distractors = [];
        while (distractors.length < 2 && available.length > 0) {
            const randIndex = Math.floor(Math.random() * available.length);
            const word = available.splice(randIndex, 1)[0];
            distractors.push(word);
        }
        
        let options = [...distractors, fixedTargetWord];
        // Shuffle options
        options = options.sort(() => Math.random() - 0.5);
        
        // With 50% chance, replace one non-target option with blank ("___")
        if (Math.random() < 0.5) {
            let nonTargetIndices = options.map((word, index) => word !== fixedTargetWord ? index : -1).filter(index => index !== -1);
            if (nonTargetIndices.length > 0) {
                const randomIndex = nonTargetIndices[Math.floor(Math.random() * nonTargetIndices.length)];
                options[randomIndex] = "";
            }
        }
        
        // Create options container and add 3 cards
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-container';
        options.forEach(word => {
            const box = document.createElement('div');
            box.className = 'number-box word-option';
            box.textContent = word === "" ? "___" : word;
            box.setAttribute('data-word', word);
            box.addEventListener('click', function(event) {
                handleFixedSightWordsClick(word, event.currentTarget);
            });
            optionsContainer.appendChild(box);
        });
        
        numberGrid.appendChild(optionsContainer);
    }

    function handleFixedSightWordsClick(selectedWord, element) {
        if (selectedWord === fixedTargetWord) {
            // Highlight the card
            element.classList.add('matched');
            const utterance = new SpeechSynthesisUtterance("Correct!");
            utterance.rate = 0.8;
            utterance.pitch = 1.2;
            speechSynthesis.speak(utterance);
            setTimeout(() => {
                fixedTargetWord = fixedSightWords[Math.floor(Math.random() * fixedSightWords.length)];
                updateFixedSightWordsDisplay();
            }, 2000);
        } else {
            const utterance = new SpeechSynthesisUtterance("Try again!");
            utterance.rate = 0.8;
            utterance.pitch = 1.2;
            speechSynthesis.speak(utterance);
            // Optionally, add incorrect highlight or feedback
        }
    }
});

