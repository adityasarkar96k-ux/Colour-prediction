/* Demo frontend logic — localStorage only. No real money. */

// Elements
const walletEl = document.getElementById('walletAmount');
const activeEl = document.getElementById('activeCount');
const tickerEl = document.getElementById('lastTicker');
const timerEl = document.getElementById('timer');
const resultBox = document.getElementById('resultBox');
const miniHistory = document.getElementById('miniHistory');
const historyTable = document.getElementById('historyTable');
const winnersList = document.getElementById('winnersList');

const optionCards = document.querySelectorAll('.option-card');

let selected = null;
let autoSpin = false;
let roundSeconds = 20; // each round length
let countdown = roundSeconds;
let roundInterval = null;

// Init wallet
function initWallet(){
  let w = localStorage.getItem('demo_wallet');
  if(!w){ localStorage.setItem('demo_wallet', JSON.stringify(500)); return 500; }
  return Number(JSON.parse(localStorage.getItem('demo_wallet')));
}
function setWallet(val){
  localStorage.setItem('demo_wallet', JSON.stringify(val));
  walletEl.innerText = val;
}

// Active users random
function updateActive(){
  const n = Math.floor(Math.random()*700) + 30;
  activeEl.innerText = n;
}
setInterval(updateActive, 4000);
updateActive();

// Click option select
optionCards.forEach(card=>{
  card.addEventListener('click', ()=>{
    optionCards.forEach(c=>c.style.outline='none');
    card.style.outline='3px solid rgba(255,255,255,0.06)';
    selected = card.getAttribute('data-color');
  });
});

// round countdown
function startRoundTimer(){
  clearInterval(roundInterval);
  countdown = roundSeconds;
  timerEl.innerText = `00:${countdown.toString().padStart(2,'0')}`;

  roundInterval = setInterval(()=>{
    countdown--;
    timerEl.innerText = `00:${countdown.toString().padStart(2,'0')}`;
    if(countdown<=0){
      clearInterval(roundInterval);
      runRound();
      setTimeout(startRoundTimer, 1500);
    }
  }, 1000);
}

// run round logic
function runRound(betPlaced){
  // generate outcome
  const colors = ['Red','Green','Blue'];
  const outcome = colors[Math.floor(Math.random() * colors.length)];

  // show in ticker & mini history
  tickerEl.innerText = outcome;
  addMiniHistory(outcome);

  // evaluate bet if placed
  const betData = JSON.parse(localStorage.getItem('current_bet') || 'null');
  if(betData){
    let wallet = initWallet();
    if(betData.choice === outcome){
      const win = betData.amount * 2;
      wallet += win;
      resultBox.innerHTML = `🎉 WIN! Outcome: ${outcome} — +₹${win}`;
      resultBox.style.color = 'lightgreen';
      addHistory(betData.choice, `WIN +₹${win}`);
      addWinner(`You`, `+₹${win}`); // demo puts 'You' as winner
    } else {
      wallet -= betData.amount;
      resultBox.innerHTML = `😢 LOST. Outcome: ${outcome} — -₹${betData.amount}`;
      resultBox.style.color = 'salmon';
      addHistory(betData.choice, `LOSE -₹${betData.amount}`);
    }
    setWallet(wallet);
    localStorage.removeItem('current_bet');
  } else {
    resultBox.innerHTML = `Round Result: ${outcome}`;
    resultBox.style.color = '#fff';
  }
}

// add mini history chip
function addMiniHistory(outcome){
  const chip = document.createElement('div'); chip.className='chip'; chip.innerText = outcome;
  miniHistory.prepend(chip);
  if(miniHistory.children.length>10) miniHistory.removeChild(miniHistory.lastChild);
}

// history table
function addHistory(choice, result){
  const time = new Date().toLocaleString();
  const tr = document.createElement('tr');
  tr.innerHTML = `<td>${time}</td><td>${choice}</td><td>${result}</td>`;
  historyTable.prepend(tr);

  // persist small history
  let arr = JSON.parse(localStorage.getItem('demo_history')||'[]');
  arr.unshift({time,choice,result});
  if(arr.length>200) arr.pop();
  localStorage.setItem('demo_history', JSON.stringify(arr));
}

// render saved history
function renderSavedHistory(){
  const arr = JSON.parse(localStorage.getItem('demo_history')||'[]');
  historyTable.innerHTML='';
  arr.forEach(it=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${it.time}</td><td>${it.choice}</td><td>${it.result}</td>`;
    historyTable.appendChild(tr);
  });
}
renderSavedHistory();

// winners
function addWinner(name, amt){
  const li = document.createElement('li');
  li.innerHTML = `<span>${name}</span><strong style="color:lightgreen">${amt}</strong>`;
  winnersList.prepend(li);
  if(winnersList.children.length>8) winnersList.removeChild(winnersList.lastChild);
}

// Place Bet button
document.getElementById('placeBetBtn').addEventListener('click', ()=>{
  const betAmt = Number(document.getElementById('betInput').value);
  if(!selected){ alert('Select a colour first'); return; }
  if(!betAmt || betAmt<=0){ alert('Enter valid bet amount'); return; }
  let wallet = initWallet();
  if(betAmt > wallet){ alert('Not enough demo wallet'); return; }

  // store current bet to be resolved when round ends
  localStorage.setItem('current_bet', JSON.stringify({choice:selected, amount:betAmt}));
  resultBox.innerHTML = `Bet Placed: ${selected} — ₹${betAmt} (will settle next round)`;
  resultBox.style.color = '#ffd';
});

// top-up and reset
document.getElementById('topupBtn').addEventListener('click', ()=>{
  const a = Number(document.getElementById('quickTopup').value);
  if(!a || a<1){ alert('Enter amount'); return; }
  const w = initWallet() + a;
  setWallet(w);
  document.getElementById('quickTopup').value='';
});
document.getElementById('clearBtn').addEventListener('click', ()=>{
  if(confirm('Reset demo wallet & history?')){
    localStorage.removeItem('demo_wallet');
    localStorage.removeItem('demo_history');
    localStorage.removeItem('current_bet');
    setWallet(initWallet());
    renderSavedHistory();
    resultBox.innerText='Reset done';
  }
});

// init UI
setWallet(initWallet());
startRoundTimer();

// load any saved history into winners (demo)
(function loadDemoWinners(){
  addWinner('PlayerX', '+₹1200');
  addWinner('PlayerY', '+₹560');
  addWinner('PlayerZ', '+₹320');
})();
let timer = 30;
let countdown;

function startTimer() {
  timer = 30;
  document.getElementById("timer").innerText = `Time Left: ${timer}s`;
  countdown = setInterval(() => {
    timer--;
    document.getElementById("timer").innerText = `Time Left: ${timer}s`;

    if (timer <= 0) {
      clearInterval(countdown);
      showResult();
      setTimeout(startTimer, 3000); // 3 सेकंदानंतर नवा राउंड सुरू
    }
  }, 1000);
}

function showResult() {
  let number = Math.floor(Math.random() * 10); // 0 ते 9 random
  let color;

  if (number % 2 === 0) {
    color = "Green";
  } else {
    color = "Red";
  }

  document.getElementById("result-number").innerText = number;
  document.getElementById("result-color").innerText = color;

  let historyItem = document.createElement("li");
  historyItem.innerText = `${number} - ${color}`;
  document.getElementById("history-list").prepend(historyItem);
}

function predict(choice) {
  alert("तू निवडलंय: " + choice);
}

// सुरुवात
startTimer();

