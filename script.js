document.addEventListener('DOMContentLoaded', function() {
    const numberGrid = document.getElementById('numberGrid');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageInfo = document.getElementById('pageInfo');
    const toggleBtn = document.getElementById('toggleMode');
    const toggleColorsBtn = document.getElementById('toggleColors');
    const toggleSightWordsBtn = document.getElementById('toggleSightWords');
    const pageTitle = document.querySelector('h1');
    
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
    const endNumber = 26;

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
        return String.fromCharCode(64 + num);
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
        } else {
            box.textContent = value;
            // Add click handler for numbers and letters
            box.addEventListener('click', function() {
                if (this.classList.contains('selected')) {
                    this.classList.remove('selected');
                } else {
                    const allBoxes = document.querySelectorAll('.number-box');
                    allBoxes.forEach(b => b.classList.remove('selected'));
                    this.classList.add('selected');
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
            }

            // Wait for animation to complete before showing next word
            setTimeout(() => {
                targetWord = sightWords[Math.floor(Math.random() * sightWords.length)];
                updateSightWordsDisplay();
            }, 1000);
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
        
        // Create target word box - now using plain style
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
        
        // Create the option boxes - now using plain style
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

    function updatePage() {
        // Reset grid class first
        numberGrid.className = 'number-grid';
        
        if (isColorMode) {
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
            
            const start = (currentPage - 1) * numbersPerPage + 1;
            const end = Math.min(start + numbersPerPage - 1, endNumber);
            
            for (let i = start; i <= end; i++) {
                const value = isNumberMode ? i : getLetterForNumber(i);
                const box = createBox(value, i);
                numberGrid.appendChild(box);
            }
            
            pageInfo.textContent = `Page ${currentPage}`;
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = end >= endNumber;
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
            toggleBtn.textContent = isNumberMode ? 'Switch to Letters' : 'Switch to Numbers';
            pageTitle.textContent = isNumberMode ? 'Select a Number' : 'Select a Letter';
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
            numberGrid.className = 'number-grid'; // Reset to default grid layout
        }

        currentPage = 1;
        updatePage();
    });
});
