//////////
const budgetController = (() => {
  const budgetData = {
    items: {
      inc: [],
      exp: [],
    },
    totals: {
      total: 0,
      income: 0,
      expenses: 0,
    },
  }

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  const updateBudget = (type, description, value) => {
    let newItem, ID;
    // set ID
    if (budgetData.items[type].length > 0) {
      ID = budgetData.items[type][budgetData.items[type].length - 1].id + 1
    } else {ID = 0};
    // create new budget item & update totals
    if (type === "inc") {
      newItem = new Income(ID, description, value);
      budgetData.totals.income += value;
    } else {
      newItem = new Expense(ID, description, value);
      budgetData.totals.expenses -= value;
    }
    budgetData.items[type].push(newItem);
    budgetData.totals.total = budgetData.totals.income + budgetData.totals.expenses;
    return {
      newItem,
    }
  }

  return {
    budgetData,
    updateBudget,
  }
})();

////////
const uiController = (() => {
  const DOMStrings = {
    month: ".currentMonth",
    total: ".currentTotal",
    income: ".currentIncome",
    expenses: ".currentExpenses",
    addType: ".addType",
    addDescription: ".addDescription",
    addValue: ".addValue",
    incomeList: "ul.income",
    expensesList: "ul.expense",
  }

  const getMonth = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June",  "July", "August", "September", "October", "November", "December"];
    const date = new Date;
    const month = monthNames[date.getMonth()];
    document.querySelector(DOMStrings.month).innerText = month;
  }

  const getInput = () => {
    return {
      type: document.querySelector(DOMStrings.addType).value,
      description: document.querySelector(DOMStrings.addDescription).value,
      value: parseInt(document.querySelector(DOMStrings.addValue).value),
    }
  }

  const updateBudget = (total, income, expenses) => {
    document.querySelector(DOMStrings.total).innerText = `£${total}`;
    document.querySelector(DOMStrings.income).innerText = `£${income}`;
    document.querySelector(DOMStrings.expenses).innerText = `£${expenses}`;
  }

  const addListItem = (type, description, value) => {
    let html = '<li class="item %incexp%"><span>%description%</span><span>%value%</span></li>'
    html = html.replace("%description%", description);
    html = html.replace("%value%", value);
    if (type === "inc") {
      html = html.replace("%incexp%", "income");
      document.querySelector(DOMStrings.incomeList).insertAdjacentHTML("beforeend", html);
    } else {
      html = html.replace("%incexp%", "expense");
      document.querySelector(DOMStrings.expensesList).insertAdjacentHTML("beforeend", html);
    }
  }

  return {
    DOMStrings,
    getMonth,
    getInput,
    updateBudget,
    addListItem,
  }
})();

//////////
const controller = ((budgetCtrl, uiCtrl) => {
  let input, newItem, budget;

  const setUpEventListeners = () => {
    const addItemButton = document.querySelector(".addItem");
    addItemButton.addEventListener("click", addItem);
  }

  const addItem = () => {
    // get info from from inputs
    input = uiCtrl.getInput();
    // create new item & add amount to budget
    newItem = budgetCtrl.updateBudget(input.type, input.description, input.value);
    // update budget in UI:
    uiCtrl.updateBudget(budgetCtrl.budgetData.totals.total, budgetCtrl.budgetData.totals.income, budgetCtrl.budgetData.totals.expenses);
    // add item to relevant UL
    uiCtrl.addListItem(input.type, input.description, input.value);
  }

  const init = () => {
    uiCtrl.getMonth();
    setUpEventListeners();
  }

  return {
    init,
    budget
  }


})(budgetController, uiController);

controller.init();
