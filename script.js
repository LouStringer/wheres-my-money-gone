const budgetController = (() => {
  const budget = {
    total: 0,
    income: 0,
    expenses: 0,
  }

  const DOMStrings = {
    month: ".currentMonth",
    total: ".currentTotal",
    income: ".currentIncome",
    expenses: ".currentExpenses",
  }

  const updateBudget = () => {

  }
})();

const uiController = (() => {
  const DOMStrings = {
    addType: ".addType",
    addDescription: ".addDescription",
    addValue: ".addValue",
  }

  const getInput = () => {
    return {
      type: document.querySelector(DOMStrings.addType).value,
      description: document.querySelector(DOMStrings.addDescription).value,
      value: document.querySelector(DOMStrings.addValue).value,
    }
  }

  return {
    getInput
  }
})();

const controller = ((budgetCtrl, uiCtrl) => {
  const setUpEventListeners = () => {
    const addItemButton = document.querySelector(".addItem");
    addItemButton.addEventListener("click", addItem);
  }

  const addItem = () => {
    // get info from form inputs
    const input = uiCtrl.getInput();
    // add amount to currentTotal & currentIncome/currentOutgoings

    // update UI:
    //   change numbers in header
    //   add item to relevant UL
    console.log(input)
  }

  const init = () => {
    setUpEventListeners();
  }

  return {
    init,
  }


})(budgetController, uiController);

controller.init();
