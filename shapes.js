document.addEventListener('DOMContentLoaded', () => {
    const shapeDisplay = document.getElementById('shape-display');
    const optionsContainer = document.getElementById('options-container');
    const feedback = document.getElementById('feedback');
    const backBtn = document.getElementById('backBtn');

    const shapes = [
        { name: 'circle', svg: '<svg viewBox="0 0 150 150"><circle cx="75" cy="75" r="70" fill="#FFC107" /></svg>' },
        { name: 'square', svg: '<svg viewBox="0 0 150 150"><rect x="5" y="5" width="140" height="140" fill="#4CAF50" /></svg>' },
        { name: 'triangle', svg: '<svg viewBox="0 0 150 150"><polygon points="75,5 145,145 5,145" fill="#F44336" /></svg>' },
        { name: 'rectangle', svg: '<svg viewBox="0 0 150 150"><rect x="5" y="35" width="140" height="80" fill="#2196F3" /></svg>' },
        { name: 'star', svg: '<svg viewBox="0 0 150 150"><polygon points="75,10 95,60 145,60 105,95 120,145 75,115 30,145 45,95 5,60 55,60" fill="#FF9800" /></svg>' },
        { name: 'heart', svg: '<svg viewBox="0 0 150 150"><path d="M75,40 C25,10 0,50 0,75 C0,125 75,150 75,150 C75,150 150,125 150,75 C150,50 125,10 75,40" fill="#E91E63" /></svg>' },
        { name: 'oval', svg: '<svg viewBox="0 0 150 150"><ellipse cx="75" cy="75" rx="70" ry="45" fill="#9C27B0" /></svg>' }
    ];

    let currentShape = null;

    function getRandomShape() {
        return shapes[Math.floor(Math.random() * shapes.length)];
    }

    function renderGame() {
        currentShape = getRandomShape();
        shapeDisplay.innerHTML = currentShape.svg;

        const options = [...shapes].sort(() => Math.random() - 0.5);
        optionsContainer.innerHTML = '';

        options.forEach(shape => {
            const shapeOption = document.createElement('div');
            shapeOption.classList.add('shape-option');
            shapeOption.innerHTML = shape.svg;
            shapeOption.dataset.shapeName = shape.name;
            shapeOption.addEventListener('click', handleOptionClick);
            optionsContainer.appendChild(shapeOption);
        });
    }

    function handleOptionClick(event) {
        const selectedShapeName = event.currentTarget.dataset.shapeName;
        const selectedOption = event.currentTarget;

        if (selectedShapeName === currentShape.name) {
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