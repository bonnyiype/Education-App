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
                    
                    // Speak the number or letter
                    const utterance = new SpeechSynthesisUtterance(value.toString());
                    utterance.rate = 0.8; // Slightly slower
                    utterance.pitch = 1.2; // Slightly higher pitch
                    speechSynthesis.speak(utterance);
                }
            });
        }
        
        return box;
    }

    function handleWordClick(selectedWord) {
        total++;
        
        const clickedBox = document.querySelector(`.word-option[data-word="${selectedWord}"]:not(.target-word)`);
        if (clickedBox) {
            if (clickedBox.classList.contains('selected')) {
                clickedBox.classList.remove('selected');
                return;
            } else {
                const allWordBoxes = document.querySelectorAll('.word-option');
                allWordBoxes.forEach(box => box.classList.remove('selected'));
                clickedBox.classList.add('selected');
                
                // Speak the selected word
                const utterance = new SpeechSynthesisUtterance(selectedWord);
                utterance.rate = 0.8; // Slightly slower
                utterance.pitch = 1.2; // Slightly higher pitch
                speechSynthesis.speak(utterance);
            }
        }
        
        if (selectedWord === targetWord) {
            score++;
            feedback = 'Wonderful! 🌟';
            isCorrect = true;
            celebration = true;

            // Add matched class to both target and selected words
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

            // Wait for animation to complete before showing next word
            setTimeout(() => {
                targetWord = sightWords[Math.floor(Math.random() * sightWords.length)];
                updateSightWordsDisplay();
                
                // Speak the new target word after a delay
                setTimeout(() => {
                    const newWordUtterance = new SpeechSynthesisUtterance(targetWord);
                    newWordUtterance.rate = 0.8;
                    newWordUtterance.pitch = 1.2;
                    speechSynthesis.speak(newWordUtterance);
                }, 500);
            }, 2000);
        } else {
            feedback = "Let's try again! 💪";
            isCorrect = false;
            celebration = false;
            updateSightWordsDisplay();
            
            // Restore the selected state after redraw
            const newClickedBox = document.querySelector(`.word-option[data-word="${selectedWord}"]:not(.target-word)`);
            if (newClickedBox) {
                newClickedBox.classList.add('selected');
            }
        }
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
        
        // Create target word box
        const targetBox = document.createElement('div');
        targetBox.className = 'number-box word-option target-word';
        targetBox.textContent = targetWord;
        targetContainer.appendChild(targetBox);
        numberGrid.appendChild(targetContainer);
        
        // Create options container
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-container';
        
        // Create word options
        const wrongOptions = getRandomWords(targetWord, 2);
        const allOptions = [...wrongOptions, targetWord];
        const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
        
        shuffledOptions.forEach((word) => {
            const box = document.createElement('div');
            box.className = 'number-box word-option';
            box.textContent = word;
            box.setAttribute('data-word', word);
            
            box.addEventListener('click', function() {
                handleWordClick(word);
            });
            
            optionsContainer.appendChild(box);
        });
        
        numberGrid.appendChild(optionsContainer);
        
        // Create feedback display if there is feedback
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

    // Initialize the lowercase button as hidden
    toggleLowerCase.style.display = 'none';
});
