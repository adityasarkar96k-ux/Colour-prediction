let timer = 30;
let countdown;
let period = 100001;

function startTimer() {
  timer = 30;
  document.getElementById("timer").innerText = timer;
  countdown = setInterval(() => {
    timer--;
    document.getElementById("timer").innerText = timer;

    if (timer <= 0) {
      clearInterval(countdown);
      showResult();
      setTimeout(startTimer, 3000); // 3 सेकंदात नवा राउंड
    }
  }, 1000);
}

function showResult() {
  let number = Math.floor(Math.random() * 10); // 0-9
  let color;

  if (number === 0 || number === 5) {
    color = "Violet";
  } else if (number % 2 === 0) {
    color = "Green";
  } else {
    color = "Red";
  }

  // Show result
  document.getElementById("result-number").innerText = number;
  document.getElementById("result-color").innerText = color;

  // Add to history
  let historyBody = document.getElementById("history-body");
  let row = document.createElement("tr");
  row.innerHTML = `
    <td>${period}</td>
    <td>${number}</td>
    <td>${color}</td>
  `;
  historyBody.prepend(row);

  // Next Period
  period++;
  document.getElementById("period").innerText = period;
}

function predict(choice) {
  alert("तुम्ही निवडलं: " + choice);
}

// सुरुवात
startTimer();
