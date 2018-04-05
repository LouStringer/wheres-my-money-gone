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

  const createBudgetItemData = (type, description, value) => {
    let newItem, ID;
    // set ID
    if (budgetData.items[type].length > 0) {
      ID = budgetData.items[type][budgetData.items[type].length - 1].id + 1
    } else {ID = 0};
    // create new budget item
    type === "inc" ? newItem = new Income(ID, description, value) : newItem = new Expense(ID, description, value);
    // push to budgetData object
    budgetData.items[type].push(newItem);
    return {
      newItem,
    }
  }

  const deleteBudgetItemData = (type, id) => {
    const index = budgetData.items[type].findIndex(item => {
      item.id === id;
    })
    budgetData.items[type].splice(index, 1);
  }

  const calculateBudget = () => {
    budgetData.totals.income = budgetData.items.inc.reduce((total, item) => {
      return total + item.value;
    }, 0);
    budgetData.totals.expenses = budgetData.items.exp.reduce((total, item) => {
      return total - item.value;
    }, 0);
    budgetData.totals.total = budgetData.totals.income + budgetData.totals.expenses;
  }

  return {
    budgetData,
    createBudgetItemData,
    deleteBudgetItemData,
    calculateBudget,
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
    addItem: ".addItem",
    main: "main",
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

  const addListItem = (obj, type) => {
    let html = '<li class="item %incexp%" id="%incexp%-%id%"><span>%description%</span><span class="value">£%value%</span><button class="delete">x</button></li>'
    html = html.replace("%id%", obj.id);
    html = html.replace("%description%", obj.description);
    html = html.replace("%value%", obj.value);
    if (type === "inc") {
      html = html.replace(/%incexp%/gi, "income");
      document.querySelector(DOMStrings.incomeList).insertAdjacentHTML("beforeend", html);
    } else {
      html = html.replace(/%incexp%/gi, "expense");
      document.querySelector(DOMStrings.expensesList).insertAdjacentHTML("beforeend", html);
    }
  }

  const deleteListItem = (id) => {
    document.querySelector(`#${id}`).remove();
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
    deleteListItem,
    clearFields,
  }
})();

//////////
const controller = ((budgetCtrl, uiCtrl) => {
  let input, newItem;

  const setUpEventListeners = () => {
    const addItemButton = document.querySelector(uiCtrl.DOMStrings.addItem);
    addItemButton.addEventListener("click", addItem);
    window.addEventListener("keypress", (event) => {
      if (event.keyCode === 13) {
        addItem();
      }
    });
    const main = document.querySelector(uiCtrl.DOMStrings.main);
    main.addEventListener("click", deleteItem);
  }

  const updateBudget = () => {
    // calculate new budget totals
    budgetCtrl.calculateBudget();
    // update budget in UI:
    uiCtrl.updateBudgetUI(budgetCtrl.budgetData.totals.total, budgetCtrl.budgetData.totals.income, budgetCtrl.budgetData.totals.expenses);
  }

  const addItem = () => {
    // check if valid input
    if (document.querySelector(uiCtrl.DOMStrings.addDescription).value !== "" && !isNaN(document.querySelector(uiCtrl.DOMStrings.addValue).value) && document.querySelector(uiCtrl.DOMStrings.addValue).value > 0) {
      // get info from from inputs
      input = uiCtrl.getInput();
      // create new item
      newItem = budgetCtrl.createBudgetItemData(input.type, input.description, input.value);
      // add item to relevant UL
      uiCtrl.addListItem(newItem.newItem, input.type);
      // update budget totals (also in UI)
      updateBudget();
      // clear input fields
      uiCtrl.clearFields();
    }
  }

  const deleteItem = (event) => {
    let id, idType, idNumber;
    if (event.target.tagName === "BUTTON") {
      id = event.target.parentNode.id;
      idType = id.slice(0,3);
      idNumber = parseInt(id.match(/[0-9]/gi));
      budgetCtrl.deleteBudgetItemData(idType, idNumber);
      uiCtrl.deleteListItem(id);
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
