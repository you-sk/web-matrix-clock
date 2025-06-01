// --- 7セグメントのパターン ---
const segmentPatterns = {
    '0': ['a', 'b', 'c', 'd', 'e', 'f'],
    '1': ['b', 'c'],
    '2': ['a', 'b', 'g', 'e', 'd'],
    '3': ['a', 'b', 'g', 'c', 'd'],
    '4': ['f', 'g', 'b', 'c'],
    '5': ['a', 'f', 'g', 'c', 'd'],
    '6': ['a', 'f', 'g', 'e', 'c', 'd'],
    '7': ['a', 'b', 'c'],
    '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    '9': ['a', 'b', 'g', 'f', 'c', 'd']
};

// --- 7セグメント文字を生成する関数 ---
function createSegmentChar(digit) {
    const charDiv = document.createElement('div');
    charDiv.classList.add('segment-char');
    const segments = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    segments.forEach(seg => {
        const segDiv = document.createElement('div');
        segDiv.classList.add('segment', `seg-${seg}`);
        charDiv.appendChild(segDiv);
    });
    updateSegmentChar(charDiv, digit);
    return charDiv;
}

// --- 7セグメント文字を更新する関数 ---
function updateSegmentChar(charDiv, digit) {
    const pattern = segmentPatterns[digit] || [];
    const segments = charDiv.querySelectorAll('.segment');
    segments.forEach(segDiv => {
        const segIdentifier = segDiv.classList[1].split('-')[1];
        if (pattern.includes(segIdentifier)) {
            segDiv.classList.add('on');
        } else {
            segDiv.classList.remove('on');
        }
    });
}

// --- コロンを生成する関数 ---
function createColon() {
    const colonDiv = document.createElement('div');
    colonDiv.classList.add('colon');
    const dot1 = document.createElement('div');
    dot1.classList.add('colon-dot');
    const dot2 = document.createElement('div');
    dot2.classList.add('colon-dot');
    colonDiv.appendChild(dot1);
    colonDiv.appendChild(dot2);
    return colonDiv;
}

const timeDisplayArea = document.getElementById('time-display-area');
const dateDisplay = document.getElementById('date-display');
const timeChars = [];

for (let i = 0; i < 6; i++) {
    const charElement = createSegmentChar('0');
    timeChars.push(charElement);
    timeDisplayArea.appendChild(charElement);
    if (i === 1 || i === 3) {
        timeDisplayArea.appendChild(createColon());
    }
}

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = hours + minutes + seconds;

    for (let i = 0; i < timeString.length; i++) {
        if (timeChars[i]) {
            updateSegmentChar(timeChars[i], timeString[i]);
        }
    }

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    dateDisplay.textContent = `${year}/${month}/${day}`;
}
setInterval(updateClock, 1000);
updateClock();

// --- マトリックス背景機能 ---
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const matrixChars = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const charsArray = matrixChars.split('');
const fontSize = 16; // 文字サイズは変更なし
let columns = Math.floor(width / fontSize);

const drops = [];
const highlightPosition = [];

function initializeMatrixColumns() {
    columns = Math.floor(window.innerWidth / fontSize);
    drops.length = 0;
    highlightPosition.length = 0;
    for (let x = 0; x < columns; x++) {
        drops[x] = 1 + Math.floor(Math.random() * (height / fontSize));
        highlightPosition[x] = Math.floor(Math.random() * (height / fontSize));
    }
}
initializeMatrixColumns();

// アニメーション速度調整用
let lastTime = 0;
const fps = 15; // 1秒あたりのフレーム数 (数値を小さくすると遅くなる)
const interval = 1000 / fps;

function drawMatrix(timestamp) { // timestamp を引数に追加
    if (timestamp - lastTime < interval) { // 前回の描画からの時間がinterval未満なら描画しない
        requestAnimationFrame(drawMatrix);
        return;
    }
    lastTime = timestamp; // 最終描画時間を更新

    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'; // 背景のフェードアウトを少し濃くして、文字が残る時間を短く
    ctx.fillRect(0, 0, width, height);
    ctx.font = fontSize + 'px Share Tech Mono, monospace';

    for (let i = 0; i < drops.length; i++) {
        if (!drops[i]) continue;

        const text = charsArray[Math.floor(Math.random() * charsArray.length)];
        const xPos = i * fontSize;
        const yPos = drops[i] * fontSize;

        // yPos が画面外に出たら、ランダムな確率で上に戻す
        if (yPos > height && Math.random() > 0.985) { // 戻る確率を少し下げる (ゆっくり消えるように)
            drops[i] = 0;
            highlightPosition[i] = Math.floor(Math.random() * (height / fontSize));
        }
        drops[i]++;

        // ハイライト文字の輝度を調整
        if (drops[i] -1 === highlightPosition[i]) {
            ctx.fillStyle = '#88FF88'; // ハイライトの色を少し暗めに (例: 明るい緑 -> 通常の緑)
            ctx.shadowColor = '#BBFFBB'; // 影の色も調整
            ctx.shadowBlur = 5;      // 影のぼかしを少し弱く
        } else {
            // 通常文字の輝度を調整
            ctx.fillStyle = '#00AA00'; // 通常の色を少し暗めに (例: 緑 -> 暗い緑)
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        }
        ctx.fillText(text, xPos, yPos);
    }
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    // requestAnimationFrame(drawMatrix); // animateMatrix関数内で呼び出すように変更
}

window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initializeMatrixColumns();
});

function animateMatrix(timestamp) { // timestamp を引数に追加
    drawMatrix(timestamp); // drawMatrix に timestamp を渡す
    requestAnimationFrame(animateMatrix);
}
// animateMatrix(); // 最初の呼び出しは引数なしでOK (timestampはrequestAnimationFrameが自動で渡す)
requestAnimationFrame(animateMatrix); // 最初の呼び出し