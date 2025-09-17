// Basic demo logic — no real money, all localStorage

// util
const getEl = id => document.getElementById(id);

// init wallet (localStorage)
function initWallet(){
  let w = localStorage.getItem('demo_wallet');
  if(!w){
    localStorage.setItem('demo_wallet', JSON.stringify(100));
    return 100;
  }
  return Number(JSON.parse(localStorage.getItem('demo_wallet')));
}

function setWallet(val){
  localStorage.setItem('demo_wallet', JSON.stringify(val));
  getEl('walletAmount').innerText = val;
}

// update active users (random)
function updateActiveUsers(){
  const n = Math.floor(Math.random()*220) + 10;
  getEl('activeCount').innerText = n;
}
setInterval(updateActiveUsers, 3500);
updateActiveUsers();

// history store
function pushHistory(item){
  let arr = JSON.parse(localStorage.getItem('demo_history')||'[]');
  arr.unshift(item);
  if(arr.length>50) arr.pop();
  localStorage.setItem('demo_history', JSON.stringify(arr));
  renderHistory();
}

function renderHistory(){
  const ul = getEl('historyList');
  ul.innerHTML='';
  let arr = JSON.parse(localStorage.getItem('demo_history')||'[]');
  arr.forEach(it=>{
    const li = document.createElement('li');
    li.innerHTML = `<span>${it.time}</span><strong>${it.choice}</strong><span>${it.result}</span>`;
    ul.appendChild(li);
  });
}

// game logic
const colors = ['Red','Green','Blue'];
let selectedColor = null;

document.querySelectorAll('.color-btn').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    document.querySelectorAll('.color-btn').forEach(b=>b.style.transform='none');
    btn.style.transform='scale(1.05)';
    selectedColor = btn.dataset.color;
  });
});

getEl('betBtn').addEventListener('click', ()=>{
  const bet = Number(getEl('betAmount').value);
  if(!selectedColor){ alert('Please select a colour first'); return; }
  if(!bet || bet<=0){ alert('Enter valid bet amount'); return; }
  let wallet = initWallet();
  if(bet > wallet){ alert('Not enough demo wallet balance'); return; }

  // generate random result
  const outcome = colors[Math.floor(Math.random()*colors.length)];
  const win = (outcome === selectedColor);

  if(win){
    // simple payout: 2x
    const winAmt = bet * 2;
    wallet += winAmt;
    setWallet(wallet);
    getEl('resultBox').innerHTML = `🎉 You WON! Outcome: ${outcome} — +₹${winAmt}`;
    getEl('resultBox').style.color = 'lightgreen';
    pushHistory({time:new Date().toLocaleString(), choice:selectedColor, result:`WIN +₹${winAmt}`});
  } else {
    wallet -= bet;
    setWallet(wallet);
    getEl('resultBox').innerHTML = `😢 You LOST. Outcome: ${outcome} — -₹${bet}`;
    getEl('resultBox').style.color = 'salmon';
    pushHistory({time:new Date().toLocaleString(), choice:selectedColor, result:`LOSE -₹${bet}`});
  }
});

// wallet add/reset
getEl('addBtn').addEventListener('click', ()=>{
  const a = Number(getEl('addAmt').value);
  if(!a || a<=0){ alert('Enter amount to add (demo)'); return; }
  let w = initWallet();
  w += a;
  setWallet(w);
  getEl('addAmt').value='';
});

getEl('resetBtn').addEventListener('click', ()=>{
  if(confirm('Reset demo wallet & history?')){
    localStorage.removeItem('demo_wallet');
    localStorage.removeItem('demo_history');
    setWallet(initWallet());
    renderHistory();
    getEl('resultBox').innerText='';
  }
});

// init UI
setWallet(initWallet());
renderHistory();

