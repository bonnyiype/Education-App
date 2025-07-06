document.addEventListener('DOMContentLoaded', () => {
    const wordDisplay = document.getElementById('word-display');
    const optionsContainer = document.getElementById('options-container');
    const feedback = document.getElementById('feedback');
    const backBtn = document.getElementById('backBtn');

    const cvcWords = [
        'cat', 'dog', 'sun', 'hat', 'run', 'big', 'bed', 'pig', 'mop', 'hen',
        'cup', 'lip', 'man', 'pan', 'top', 'hot', 'log', 'dot', 'rug', 'bug'
    ];

    let currentWord = null;

    function getRandomWord() {
        return cvcWords[Math.floor(Math.random() * cvcWords.length)];
    }

    function renderGame() {
        currentWord = getRandomWord();
        wordDisplay.textContent = currentWord;

        const options = [...new Set([currentWord, ...Array(3).fill(0).map(() => getRandomWord())])].slice(0, 4);
        options.sort(() => Math.random() - 0.5);
        optionsContainer.innerHTML = '';

        options.forEach(word => {
            const wordOption = document.createElement('div');
            wordOption.classList.add('word-option');
            wordOption.textContent = word;
            wordOption.dataset.wordName = word;
            wordOption.addEventListener('click', handleOptionClick);
            optionsContainer.appendChild(wordOption);
        });
    }

    function handleOptionClick(event) {
        const selectedWord = event.currentTarget.dataset.wordName;
        const selectedOption = event.currentTarget;

        if (selectedWord === currentWord) {
            feedback.textContent = 'Correct! Well done!';
            feedback.style.color = '#4CAF50';
            selectedOption.classList.add('matched');

            setTimeout(() => {
                feedback.textContent = '';
                selectedOption.classList.remove('matched');
                renderGame();
            }, 1500);
        } else {
            feedback.textContent = 'Try again!';
            feedback.style.color = '#F44336';
            setTimeout(() => {
                feedback.textContent = '';
            }, 1000);
        }
    }

    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    renderGame();
});
