const balance = document.getElementById("balance");
const moneyPlus = document.getElementById("money-plus");
const moneyMinus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

const localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));

let transactions = localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

/** Add transaction */
function addTransaction(e) {
  e.preventDefault();

  if(text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add a text and amount");
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value
    }

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();

    updateLocalStorage();

    text.value = "";
    amount.value = "";
  }
}

/** Generate random ID */
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

/** Add transactions to DOM list */
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  // 既に負の記号がついているため、絶対値に変換する
  item.innerHTML = `
  ${transaction.text}
  <span>${sign}${Math.abs(transaction.amount)}</span>
  <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `

  list.appendChild(item)
}

/** Update balance, income and expense */
function updateValues() {
  const amounts = transactions.map(transaction =>  transaction.amount )

  const total = amounts
                  .reduce( (acc, item) => (acc += item), 0)
                  .toFixed(2);
  const income = amounts
                  .filter(item => item > 0)
                  .reduce((acc, item) => (acc += item), 0)
                  .toFixed(2);
  const expense = amounts
                  .filter(item => item < 0)
                  // マイナスを消すため絶対値にする
                  .reduce((acc, item) => (acc += Math.abs(item)), 0)
                  .toFixed(2);

  balance.innerText = `$${total}`;
  moneyPlus.innerText = `$${income}`;
  moneyMinus.innerText = `-$${expense}`;
}

/** Remove transaction */
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage();

  init();
}

/** Update local storage transactions */
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

/** Init app */
function init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues()
}

init()
form.addEventListener("submit", addTransaction);