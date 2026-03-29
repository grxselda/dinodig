const DECK = [
    ...Array(4).fill('skull'),
    ...Array(6).fill('body'),
    ...Array(7).fill('legs'),
    ...Array(7).fill('arms'),
    ...Array(13).fill('trace')
];

let state = {
    currentPlayer: 1,
    scores: [0, 0],
    tempCollection: [],
    tracesFound: 0,
    isExpeditionActive: true
};

function init() {
    const grid = document.getElementById('hex-grid');
    const shuffled = DECK.sort(() => Math.random() - 0.5);

    shuffled.forEach((type, i) => {
        const hex = document.createElement('div');
        hex.className = 'hex';
        hex.dataset.type = type;
        hex.onclick = () => reveal(hex);
        grid.appendChild(hex);
    });
    updateUI();
}

function reveal(el) {
    if (!state.isExpeditionActive || el.classList.contains('revealed')) return;

    const type = el.dataset.type;
    el.classList.add('revealed');
    
    // Ganti ekstensi file ke .png
    el.style.backgroundImage = `url('assets/hex_front_${type}.png')`;

    if (type === 'trace') {
        state.tracesFound++;
        document.getElementById('trace-count').innerText = state.tracesFound;
        if (state.tracesFound >= 2) {
            alert("T-REX DETECTED! Sesi gagal, semua galian hancur.");
            endTurn(true);
        }
    } else {
        state.tempCollection.push(type);
    }
}

function stopExpedition() {
    const dice = Math.floor(Math.random() * 6) + 1;
    document.getElementById('dice-value').innerText = dice;

    let turnPoints = calculateExpeditionPoints(state.tempCollection);
    
    if (dice >= 4) {
        turnPoints += 5; 
        alert(`Eskavasi Sukses! Dadu: ${dice}. Bonus +5 Poin.`);
    }

    state.scores[state.currentPlayer - 1] += turnPoints;
    endTurn(false);
}

function calculateExpeditionPoints(items) {
    let total = 0;
    const counts = { skull: 0, body: 0, legs: 0, arms: 0 };
    items.forEach(i => counts[i]++);

    // Cek FINAL FORM (Set Lengkap)
    while (counts.skull > 0 && counts.body > 0 && counts.legs > 0 && counts.arms > 0) {
        total += 50; // Poin Final Form
        counts.skull--; counts.body--; counts.legs--; counts.arms--;
        alert("FINAL FORM ACHIEVED! +50 Poin!");
    }

    // Poin Eceran Sisa
    total += (counts.skull * 5) + (counts.body * 3) + (counts.legs * 2) + (counts.arms * 2);
    return total;
}

function endTurn(isBusted) {
    state.tempCollection = [];
    state.tracesFound = 0;
    state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
    updateUI();
}

function updateUI() {
    document.getElementById('p1-score').innerText = state.scores[0];
    document.getElementById('p2-score').innerText = state.scores[1];
    document.getElementById('current-player').innerText = `Giliran: Pemain ${state.currentPlayer}`;
    document.getElementById('trace-count').innerText = "0";
    document.getElementById('p1-card').className = state.currentPlayer === 1 ? 'player-card active' : 'player-card';
    document.getElementById('p2-card').className = state.currentPlayer === 2 ? 'player-card active' : 'player-card';
}

init();
