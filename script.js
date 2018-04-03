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

  const createBudgetItem = (type, description, value) => {
    let newItem, ID;
    // set ID
    if (budgetData.items[type].length > 0) {
      ID = budgetData.items[type][budgetData.items[type].length - 1].id + 1
    } else {ID = 0};
    // create new budget item
    if (type === "inc") {
      newItem = new Income(ID, description, value);
    } else {
      newItem = new Expense(ID, description, value);
    }
    // push to budgetData object
    budgetData.items[type].push(newItem);
    return {
      newItem,
    }
  }

  const updateTotals = (type, value) => {
    if (type === "inc") {
      budgetData.totals.income += value;
    } else {
      budgetData.totals.expenses -= value;
    }
    budgetData.totals.total = budgetData.totals.income + budgetData.totals.expenses;
  }

  return {
    budgetData,
    createBudgetItem,
    updateTotals
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
      value: parseFloat(document.querySelector(DOMStrings.addValue).value),
    }
  }

  const updateBudgetUI = (total, income, expenses) => {
    document.querySelector(DOMStrings.total).innerText = `£${total}`;
    document.querySelector(DOMStrings.income).innerText = `£${income}`;
    document.querySelector(DOMStrings.expenses).innerText = `£${expenses}`;
  }

  const addListItem = (type, description, value) => {
    let html = '<li class="item %incexp%"><span>%description%</span><span class="value">£%value%</span><span class="delete hide">x</span></li>'
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

  const clearFields = () => {
    let fieldsArray = Array.from(document.querySelectorAll("input"));
    for (field of fieldsArray) {
       field.value = "";
    }
    fieldsArray[0].focus();
  }

  return {
    DOMStrings,
    getMonth,
    getInput,
    updateBudgetUI,
    addListItem,
    clearFields,
  }
})();

//////////
const controller = ((budgetCtrl, uiCtrl) => {
  let input, newItem;

  const setUpEventListeners = () => {
    const addItemButton = document.querySelector(".addItem");
    addItemButton.addEventListener("click", addItem);
  }

  const updateBudget = () => {
    // calculate new budget totals
    budgetCtrl.updateTotals(input.type, input.value);
    // update budget in UI:
    uiCtrl.updateBudgetUI(budgetCtrl.budgetData.totals.total, budgetCtrl.budgetData.totals.income, budgetCtrl.budgetData.totals.expenses);
  }

  const addItem = () => {
    // check if valid input
    if (document.querySelector(uiCtrl.DOMStrings.addDescription).value !== "" && !isNaN(document.querySelector(uiCtrl.DOMStrings.addValue).value) && document.querySelector(uiCtrl.DOMStrings.addValue).value > 0) {
      // get info from from inputs
      input = uiCtrl.getInput();
      // create new item
      newItem = budgetCtrl.createBudgetItem(input.type, input.description, input.value);
      // add item to relevant UL
      uiCtrl.addListItem(input.type, input.description, input.value);
      // clear input fields
      uiCtrl.clearFields();
      // update budget totals (also in UI)
      updateBudget();
    }
  }

  const init = () => {
    uiCtrl.getMonth();
    uiCtrl.clearFields();
    setUpEventListeners();
  }

  return {
    init,
  }


})(budgetController, uiController);

controller.init();
