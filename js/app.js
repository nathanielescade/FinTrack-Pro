// Main app logic
document.addEventListener('DOMContentLoaded', () => {
  // Initialize personalization
  initializeProfile();
  initializeReminders();
  
  // Data storage key
  const STORAGE_KEY = "fintrackpro_data";
  
  // Default data for a Ghanaian user
  const defaultData = {
    userName: "Kwame Asante",
    location: "Accra, Ghana",
    currency: "GHS",
    theme: "dark",
    notifications: true,
    monthlyReport: true,
    transactions: [
      { id: 1, date: "2024-05-25", description: "Monthly Salary", category: "Salary", amount: 3500, type: "income" },
      { id: 2, date: "2024-05-22", description: "Grocery Shopping at Shoprite", category: "Groceries", amount: 450.75, type: "expense" },
      { id: 3, date: "2024-05-20", description: "ECG Electricity Bill", category: "Utilities", amount: 320.50, type: "expense" },
      { id: 4, date: "2024-05-18", description: "Freelance Web Design", category: "Salary", amount: 1200, type: "income" },
      { id: 5, date: "2024-05-15", description: "MTN Mobile Top-up", category: "Utilities", amount: 50, type: "expense" },
      { id: 6, date: "2024-05-12", description: "Transportation (Trotro)", category: "Transport", amount: 120, type: "expense" },
      { id: 7, date: "2024-05-10", description: "Ghana Water Bill", category: "Utilities", amount: 85.00, type: "expense" },
      { id: 8, date: "2024-05-08", description: "Dinner at KFC Accra", category: "Dining", amount: 85.50, type: "expense" },
      { id: 9, date: "2024-05-05", description: "Rent Payment (East Legon)", category: "Utilities", amount: 1500, type: "expense" },
      { id: 10, date: "2024-05-01", description: "Consulting Work", category: "Salary", amount: 800, type: "income" }
    ],
    savingsGoal: 10000,
    savingsCurrent: 3500,
    financialGoals: {
      "Emergency Fund": { goal: 15000, current: 5500, deadline: "2025-12-31" },
      "Vacation (Cape Coast)": { goal: 3000, current: 1200, deadline: "2024-12-15" },
      "New Laptop": { goal: 8000, current: 2500, deadline: "2024-10-31" },
      "Land Investment": { goal: 25000, current: 5000, deadline: "2026-06-30" }
    },
  };

  // Load data or default
  let data = loadData(STORAGE_KEY, defaultData);
  
  // Save data
  const saveAppData = () => {
    saveData(STORAGE_KEY, data);
  };

  // Update user name display
  const updateUserName = () => {
    document.getElementById("user-name").textContent = data.userName;
    document.getElementById("username").value = data.userName;
    
    // Add location if element exists
    const userLocation = document.getElementById("user-location");
    if (userLocation) {
      userLocation.textContent = data.location;
    }
  };

  // Update summary cards
  const updateSummary = () => {
    const balance = data.transactions.reduce((acc, t) => {
      return t.type === "income" ? acc + t.amount : acc - t.amount;
    }, 0);
    document.getElementById("current-balance").textContent = formatCurrency(balance, data.currency);

    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const monthlyIncome = data.transactions
      .filter((t) => t.type === "income" && new Date(t.date) >= last30Days)
      .reduce((acc, t) => acc + t.amount, 0);
    const monthlyExpenses = data.transactions
      .filter((t) => t.type === "expense" && new Date(t.date) >= last30Days)
      .reduce((acc, t) => acc + t.amount, 0);
    document.getElementById("monthly-income").textContent = formatCurrency(monthlyIncome, data.currency);
    document.getElementById("monthly-expenses").textContent = formatCurrency(monthlyExpenses, data.currency);

    // Previous 30 days for comparison
    const prev30DaysStart = new Date(last30Days.getTime() - 30 * 24 * 60 * 60 * 1000);
    const prev30DaysEnd = last30Days;
    const prevMonthlyIncome = data.transactions
      .filter(
        (t) =>
          t.type === "income" &&
          new Date(t.date) >= prev30DaysStart &&
          new Date(t.date) < prev30DaysEnd
      )
      .reduce((acc, t) => acc + t.amount, 0);
    const prevMonthlyExpenses = data.transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          new Date(t.date) >= prev30DaysStart &&
          new Date(t.date) < prev30DaysEnd
      )
      .reduce((acc, t) => acc + t.amount, 0);
    const prevBalance = prevMonthlyIncome - prevMonthlyExpenses;
    const balanceChange = balance - prevBalance;
    const incomeChange = monthlyIncome - prevMonthlyIncome;
    const expensesChange = monthlyExpenses - prevMonthlyExpenses;

    // Update balance change
    const balanceUpIcon = document.getElementById("balance-up-icon");
    const balanceDownIcon = document.getElementById("balance-down-icon");
    const balanceChangeText = document.getElementById("balance-change-text");
    if (balanceChange > 0) {
      balanceUpIcon.classList.remove("hidden");
      balanceDownIcon.classList.add("hidden");
      balanceChangeText.textContent = `+${formatCurrency(balanceChange, data.currency)} since last month`;
    } else if (balanceChange < 0) {
      balanceUpIcon.classList.add("hidden");
      balanceDownIcon.classList.remove("hidden");
      balanceChangeText.textContent = `${formatCurrency(balanceChange, data.currency)} since last month`;
    } else {
      balanceUpIcon.classList.add("hidden");
      balanceDownIcon.classList.add("hidden");
      balanceChangeText.textContent = "No change since last month";
    }

    // Update income change
    const incomeUpIcon = document.getElementById("income-up-icon");
    const incomeDownIcon = document.getElementById("income-down-icon");
    const incomeChangeText = document.getElementById("income-change-text");
    if (incomeChange > 0) {
      incomeUpIcon.classList.remove("hidden");
      incomeDownIcon.classList.add("hidden");
      incomeChangeText.textContent = `+${formatCurrency(incomeChange, data.currency)} since last month`;
    } else if (incomeChange < 0) {
      incomeUpIcon.classList.add("hidden");
      incomeDownIcon.classList.remove("hidden");
      incomeChangeText.textContent = `${formatCurrency(incomeChange, data.currency)} since last month`;
    } else {
      incomeUpIcon.classList.add("hidden");
      incomeDownIcon.classList.add("hidden");
      incomeChangeText.textContent = "No change since last month";
    }

    // Update expenses change
    const expensesUpIcon = document.getElementById("expenses-up-icon");
    const expensesDownIcon = document.getElementById("expenses-down-icon");
    const expensesChangeText = document.getElementById("expenses-change-text");
    if (expensesChange > 0) {
      expensesUpIcon.classList.remove("hidden");
      expensesDownIcon.classList.add("hidden");
      expensesChangeText.textContent = `+${formatCurrency(expensesChange, data.currency)} since last month`;
    } else if (expensesChange < 0) {
      expensesUpIcon.classList.add("hidden");
      expensesDownIcon.classList.remove("hidden");
      expensesChangeText.textContent = `${formatCurrency(expensesChange, data.currency)} since last month`;
    } else {
      expensesUpIcon.classList.add("hidden");
      expensesDownIcon.classList.add("hidden");
      expensesChangeText.textContent = "No change since last month";
    }

    // Savings goal & progress
    document.getElementById("savings-goal").textContent = formatCurrency(data.savingsGoal, data.currency);
    const savingsPercent =
      data.savingsGoal > 0 ? Math.min(100, (data.savingsCurrent / data.savingsGoal) * 100) : 0;
    document.getElementById("savings-percent").textContent = `${savingsPercent.toFixed(0)}% achieved`;

    // Update circular savings progress
    const circle = document.getElementById("savings-progress-circle");
    const circumference = 2 * Math.PI * 54;
    circle.style.strokeDashoffset = circumference * (1 - savingsPercent / 100);
    document.getElementById("savings-percent-circle").textContent = `${savingsPercent.toFixed(0)}%`;
    document.getElementById("savings-goal-circle-text").textContent = `of ${formatCurrency(data.savingsGoal, data.currency)} goal`;
  };

  // Render transactions table (paginated)
  let transactionsPage = 1;
  const transactionsPerPage = 10;
  const transactionsTbody = document.getElementById("transactions-tbody");
  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");
  const transactionCount = document.getElementById("transaction-count");
  const transactionSearch = document.getElementById("transaction-search");
  const transactionFilter = document.getElementById("transaction-filter");

  const renderTransactions = (page = 1, searchTerm = "", filterType = "all") => {
    // Filter transactions based on search and type
    let filteredTransactions = data.transactions
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredTransactions = filteredTransactions.filter(t => 
        t.description.toLowerCase().includes(term) || 
        t.category.toLowerCase().includes(term)
      );
    }

    if (filterType !== "all") {
      filteredTransactions = filteredTransactions.filter(t => t.type === filterType);
    }

    // Pagination
    const start = (page - 1) * transactionsPerPage;
    const end = page * transactionsPerPage;
    const transactionsToShow = filteredTransactions.slice(start, end);
    
    // Clear existing rows
    transactionsTbody.innerHTML = "";
    
    // Render transactions
    transactionsToShow.forEach((t) => {
      const tr = document.createElement("tr");
      tr.classList.add("hover:bg-indigo-700", "cursor-pointer", "transition-colors");
      tr.innerHTML = `
        <td class="px-6 py-3 whitespace-nowrap text-sm text-indigo-200">${formatDate(t.date)}</td>
        <td class="px-6 py-3 whitespace-nowrap text-sm text-indigo-100 font-semibold">${t.description}</td>
        <td class="px-6 py-3 whitespace-nowrap text-sm text-indigo-300">${t.category}</td>
        <td class="px-6 py-3 whitespace-nowrap text-sm text-right ${t.type === "income" ? "text-green-400" : "text-red-400"}">${t.type === "income" ? "+" : "-"}${formatCurrency(t.amount, data.currency)}</td>
        <td class="px-6 py-3 whitespace-nowrap text-sm text-center">
          <span class="inline-block px-2 py-1 rounded-full text-xs font-semibold ${t.type === "income" ? "bg-green-600 text-green-100" : "bg-red-600 text-red-100"}">${t.type.charAt(0).toUpperCase() + t.type.slice(1)}</span>
        </td>
        <td class="px-6 py-3 whitespace-nowrap text-sm text-center">
          <button class="text-indigo-400 hover:text-white transition mr-2" onclick="editTransaction(${t.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="text-red-400 hover:text-red-300 transition" onclick="deleteTransaction(${t.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      transactionsTbody.appendChild(tr);
    });

    // Update pagination controls
    const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
    prevPageBtn.disabled = page <= 1;
    nextPageBtn.disabled = page >= totalPages;
    
    // Update transaction count
    transactionCount.textContent = `Showing ${start + 1}-${Math.min(end, filteredTransactions.length)} of ${filteredTransactions.length} transactions`;
  };

  // Pagination event listeners
  prevPageBtn.addEventListener("click", () => {
    if (transactionsPage > 1) {
      transactionsPage--;
      renderTransactions(transactionsPage, transactionSearch.value, transactionFilter.value);
    }
  });

  nextPageBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(data.transactions.length / transactionsPerPage);
    if (transactionsPage < totalPages) {
      transactionsPage++;
      renderTransactions(transactionsPage, transactionSearch.value, transactionFilter.value);
    }
  });

  // Search and filter event listeners
  transactionSearch.addEventListener("input", () => {
    transactionsPage = 1;
    renderTransactions(transactionsPage, transactionSearch.value, transactionFilter.value);
  });

  transactionFilter.addEventListener("change", () => {
    transactionsPage = 1;
    renderTransactions(transactionsPage, transactionSearch.value, transactionFilter.value);
  });

  // Clear and reload transactions
  const resetTransactions = () => {
    transactionsPage = 1;
    renderTransactions(transactionsPage, transactionSearch.value, transactionFilter.value);
  };

  // Chart.js charts
  let incomeExpensesChart;
  let categoryBreakdownChart;

  const createIncomeExpensesChart = (rangeDays = 30) => {
    const now = new Date();
    const startDate = new Date(now.getTime() - rangeDays * 24 * 60 * 60 * 1000);
    
    // Prepare daily sums
    const days = [];
    for (let i = 0; i < rangeDays; i++) {
      const day = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      days.push(day);
    }
    
    const incomeData = days.map((day) => {
      const dayStr = day.toISOString().slice(0, 10);
      return data.transactions
        .filter((t) => t.type === "income" && t.date === dayStr)
        .reduce((acc, t) => acc + t.amount, 0);
    });
    
    const expensesData = days.map((day) => {
      const dayStr = day.toISOString().slice(0, 10);
      return data.transactions
        .filter((t) => t.type === "expense" && t.date === dayStr)
        .reduce((acc, t) => acc + t.amount, 0);
    });
    
    const labels = days.map((d) =>
      d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    );
    
    if (incomeExpensesChart) {
      incomeExpensesChart.data.labels = labels;
      incomeExpensesChart.data.datasets[0].data = incomeData;
      incomeExpensesChart.data.datasets[1].data = expensesData;
      incomeExpensesChart.update();
    } else {
      const ctx = document.getElementById("income-expenses-chart").getContext("2d");
      incomeExpensesChart = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Income",
              data: incomeData,
              borderColor: "#34d399",
              backgroundColor: "rgba(52, 211, 153, 0.3)",
              fill: true,
              tension: 0.3,
              pointRadius: 3,
              pointHoverRadius: 6,
            },
            {
              label: "Expenses",
              data: expensesData,
              borderColor: "#f87171",
              backgroundColor: "rgba(248, 113, 113, 0.3)",
              fill: true,
              tension: 0.3,
              pointRadius: 3,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          interaction: {
            mode: "nearest",
            intersect: false,
          },
          plugins: {
            legend: {
              labels: {
                color: "#c7d2fe",
                font: { weight: "600" },
              },
            },
            tooltip: {
              enabled: true,
              backgroundColor: "#1e40af",
              titleColor: "#a5b4fc",
              bodyColor: "#e0e7ff",
              cornerRadius: 6,
              displayColors: false,
              callbacks: {
                label: (ctx) => formatCurrency(ctx.parsed.y, data.currency),
              },
            },
          },
          scales: {
            x: {
              ticks: { color: "#a5b4fc" },
              grid: { color: "rgba(147, 197, 253, 0.1)" },
            },
            y: {
              ticks: {
                color: "#a5b4fc",
                callback: (val) => formatCurrency(val, data.currency),
              },
              grid: { color: "rgba(147, 197, 253, 0.1)" },
              beginAtZero: true,
            },
          },
        },
      });
    }
  };

  const createCategoryBreakdownChart = () => {
    // Aggregate expenses by category
    const categorySums = {};
    data.transactions.forEach((t) => {
      if (t.type === "expense") {
        categorySums[t.category] = (categorySums[t.category] || 0) + t.amount;
      }
    });
    
    const categories = Object.keys(categorySums);
    const amounts = Object.values(categorySums);
    
    // Generate pastel colors for each category
    const colors = categories.map((_, i) => {
      const hue = (i * 360) / categories.length;
      return `hsl(${hue}, 70%, 70%)`;
    });
    
    if (categoryBreakdownChart) {
      categoryBreakdownChart.data.labels = categories;
      categoryBreakdownChart.data.datasets[0].data = amounts;
      categoryBreakdownChart.data.datasets[0].backgroundColor = colors;
      categoryBreakdownChart.update();
    } else {
      const ctx = document.getElementById("category-breakdown-chart").getContext("2d");
      categoryBreakdownChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: categories,
          datasets: [
            {
              data: amounts,
              backgroundColor: colors,
              borderColor: "#1e40af",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
              backgroundColor: "#1e40af",
              titleColor: "#a5b4fc",
              bodyColor: "#e0e7ff",
              cornerRadius: 6,
              callbacks: {
                label: (ctx) => {
                  const label = ctx.label || "";
                  const value = ctx.parsed || 0;
                  const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                  const percent = total ? ((value / total) * 100).toFixed(1) : 0;
                  return `${label}: ${formatCurrency(value, data.currency)} (${percent}%)`;
                },
              },
            },
          },
        },
      });
    }
    
    // Render legend
    const legendContainer = document.getElementById("category-legend");
    legendContainer.innerHTML = "";
    categories.forEach((cat, i) => {
      const li = document.createElement("li");
      li.className = "flex items-center space-x-2 cursor-pointer hover:underline";
      li.innerHTML = `
        <span class="w-5 h-5 rounded-full" style="background-color: ${colors[i]}"></span>
        <span>${cat}</span>
      `;
      legendContainer.appendChild(li);
    });
  };

  // Interactive filters for income-expenses chart
  document.querySelectorAll(".income-expenses-filter").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const range = parseInt(e.target.dataset.range);
      createIncomeExpensesChart(range);
      
      // Highlight active button and update aria-pressed
      document.querySelectorAll(".income-expenses-filter").forEach((b) => {
        b.classList.remove("bg-indigo-800");
        b.setAttribute("aria-pressed", "false");
      });
      e.target.classList.add("bg-indigo-800");
      e.target.setAttribute("aria-pressed", "true");
    });
  });

  // Initialize with 30 days range active
  const defaultFilterBtn = document.querySelector('.income-expenses-filter[data-range="30"]');
  if (defaultFilterBtn) {
    defaultFilterBtn.classList.add("bg-indigo-800");
    defaultFilterBtn.setAttribute("aria-pressed", "true");
  }

  // Add Transaction Modal Logic
  const addTransactionBtn = document.getElementById("add-transaction-btn");
  const addTransactionModal = document.getElementById("add-transaction-modal");
  const cancelAddTransactionBtn = document.getElementById("cancel-add-transaction");
  const addTransactionForm = document.getElementById("add-transaction-form");

  addTransactionBtn.addEventListener("click", () => {
    addTransactionModal.classList.remove("hidden");
    addTransactionForm.reset();
    addTransactionForm["transaction-date"].valueAsDate = new Date();
  });

  cancelAddTransactionBtn.addEventListener("click", () => {
    addTransactionModal.classList.add("hidden");
  });

  addTransactionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(addTransactionForm);
    const newTransaction = {
      id: Date.now(),
      date: formData.get("date"),
      description: formData.get("description"),
      category: formData.get("category"),
      amount: parseFloat(formData.get("amount")),
      type: formData.get("type"),
    };
    data.transactions.push(newTransaction);
    saveAppData();
    updateSummary();
    resetTransactions();
    createIncomeExpensesChart(30);
    createCategoryBreakdownChart();
    addTransactionModal.classList.add("hidden");
    showNotification("Transaction added successfully!");
  });

  // Edit Transaction Function
  window.editTransaction = (id) => {
    const transaction = data.transactions.find(t => t.id === id);
    if (transaction) {
      // Populate form with transaction data
      addTransactionForm["transaction-date"].value = transaction.date;
      addTransactionForm["transaction-description"].value = transaction.description;
      addTransactionForm["transaction-category"].value = transaction.category;
      addTransactionForm["transaction-amount"].value = transaction.amount;
      addTransactionForm.querySelector(`input[name="type"][value="${transaction.type}"]`).checked = true;
      
      // Change modal title and button text
      document.getElementById("add-transaction-title").textContent = "Edit Transaction";
      addTransactionForm.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i><span>Save Changes</span>';
      
      // Show modal
      addTransactionModal.classList.remove("hidden");
      
      // Store transaction ID for update
      addTransactionForm.dataset.editId = id;
    }
  };

  // Delete Transaction Function
  window.deleteTransaction = (id) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      data.transactions = data.transactions.filter(t => t.id !== id);
      saveAppData();
      updateSummary();
      resetTransactions();
      createIncomeExpensesChart(30);
      createCategoryBreakdownChart();
      showNotification("Transaction deleted successfully!");
    }
  };

  // Update transaction form submission to handle both add and edit
  addTransactionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(addTransactionForm);
    const editId = addTransactionForm.dataset.editId;
    
    if (editId) {
      // Update existing transaction
      const transactionIndex = data.transactions.findIndex(t => t.id == editId);
      if (transactionIndex !== -1) {
        data.transactions[transactionIndex] = {
          id: parseInt(editId),
          date: formData.get("date"),
          description: formData.get("description"),
          category: formData.get("category"),
          amount: parseFloat(formData.get("amount")),
          type: formData.get("type"),
        };
      }
      // Reset edit mode
      delete addTransactionForm.dataset.editId;
      document.getElementById("add-transaction-title").textContent = "Add New Transaction";
      addTransactionForm.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-check"></i><span>Add</span>';
    } else {
      // Add new transaction
      const newTransaction = {
        id: Date.now(),
        date: formData.get("date"),
        description: formData.get("description"),
        category: formData.get("category"),
        amount: parseFloat(formData.get("amount")),
        type: formData.get("type"),
      };
      data.transactions.push(newTransaction);
    }
    
    saveAppData();
    updateSummary();
    resetTransactions();
    createIncomeExpensesChart(30);
    createCategoryBreakdownChart();
    addTransactionModal.classList.add("hidden");
    showNotification("Transaction saved successfully!");
  });

  // Add Funds Modal Logic
  const addFundsModal = document.getElementById("add-funds-modal");
  const addFundsForm = document.getElementById("add-funds-form");
  const cancelAddFundsBtn = document.getElementById("cancel-add-funds");

  // Buttons that open add funds modal (savings and goals)
  const increaseSavingsBtn = document.getElementById("increase-savings-btn");

  const openAddFundsModal = (goalName = "") => {
    addFundsForm.reset();
    if (goalName) {
      addFundsForm["goal"].value = goalName;
    }
    addFundsModal.classList.remove("hidden");
  };

  increaseSavingsBtn.addEventListener("click", () => openAddFundsModal("Savings"));

  cancelAddFundsBtn.addEventListener("click", () => {
    addFundsModal.classList.add("hidden");
  });

  addFundsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(addFundsForm);
    const goal = formData.get("goal");
    const amount = parseFloat(formData.get("amount"));
    
    if (goal === "Savings") {
      data.savingsCurrent += amount;
      if (data.savingsCurrent > data.savingsGoal) data.savingsCurrent = data.savingsGoal;
    } else if (data.financialGoals[goal]) {
      data.financialGoals[goal].current += amount;
      if (data.financialGoals[goal].current > data.financialGoals[goal].goal) {
        data.financialGoals[goal].current = data.financialGoals[goal].goal;
      }
    }
    
    saveAppData();
    updateSummary();
    updateFinancialGoals();
    addFundsModal.classList.add("hidden");
    showNotification(`Funds added to ${goal} successfully!`);
  });

  // Add Goal Modal Logic
  const addGoalBtn = document.getElementById("add-goal-btn");
  const addGoalModal = document.getElementById("add-goal-modal");
  const cancelAddGoalBtn = document.getElementById("cancel-add-goal");
  const addGoalForm = document.getElementById("add-goal-form");

  addGoalBtn.addEventListener("click", () => {
    addGoalModal.classList.remove("hidden");
    addGoalForm.reset();
  });

  cancelAddGoalBtn.addEventListener("click", () => {
    addGoalModal.classList.add("hidden");
  });

  addGoalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(addGoalForm);
    const goalName = formData.get("name");
    
    data.financialGoals[goalName] = {
      goal: parseFloat(formData.get("amount")),
      current: 0,
      deadline: formData.get("deadline")
    };
    
    saveAppData();
    renderGoals();
    addGoalModal.classList.add("hidden");
    showNotification("Goal added successfully!");
  });

  // Edit Goal Modal Logic
  const editGoalModal = document.getElementById("edit-goal-modal");
  const cancelEditGoalBtn = document.getElementById("cancel-edit-goal");
  const editGoalForm = document.getElementById("edit-goal-form");

  const openEditGoalModal = (goalName) => {
    const goal = data.financialGoals[goalName];
    if (goal) {
      editGoalForm["edit-goal-id"].value = goalName;
      editGoalForm["edit-goal-name"].value = goalName;
      editGoalForm["edit-goal-amount"].value = goal.goal;
      editGoalForm["edit-goal-current"].value = goal.current;
      editGoalForm["edit-goal-deadline"].value = goal.deadline;
      
      editGoalModal.classList.remove("hidden");
    }
  };

  cancelEditGoalBtn.addEventListener("click", () => {
    editGoalModal.classList.add("hidden");
  });

  editGoalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(editGoalForm);
    const originalName = formData.get("id");
    const newName = formData.get("name");
    
    // If name changed, we need to update the object key
    if (originalName !== newName) {
      data.financialGoals[newName] = data.financialGoals[originalName];
      delete data.financialGoals[originalName];
    }
    
    data.financialGoals[newName] = {
      goal: parseFloat(formData.get("amount")),
      current: parseFloat(formData.get("current")),
      deadline: formData.get("deadline")
    };
    
    saveAppData();
    renderGoals();
    editGoalModal.classList.add("hidden");
    showNotification("Goal updated successfully!");
  });

  // Update financial goals progress bars and texts
  const updateFinancialGoals = () => {
    Object.entries(data.financialGoals).forEach(([goal, { goal: goalAmount, current }]) => {
      const percent = goalAmount > 0 ? Math.min(100, (current / goalAmount) * 100) : 0;
      const progressBar = document.getElementById(`${goal.toLowerCase().replace(/\s/g, "-")}-progress`);
      const percentText = document.getElementById(`${goal.toLowerCase().replace(/\s/g, "-")}-percent`);
      const goalText = document.getElementById(`${goal.toLowerCase().replace(/\s/g, "-")}-goal-text`);
      
      if (progressBar) {
        progressBar.style.width = `${percent}%`;
      }
      if (percentText) {
        percentText.textContent = `${percent.toFixed(0)}% completed`;
      }
      if (goalText) {
        goalText.textContent = `Goal: ${formatCurrency(goalAmount, data.currency)}`;
      }
    });
  };

  // Render goals dynamically
  const renderGoals = () => {
    const goalsContainer = document.getElementById("goals-container");
    goalsContainer.innerHTML = "";
    
    Object.entries(data.financialGoals).forEach(([goalName, goalData]) => {
      const percent = goalData.goal > 0 ? Math.min(100, (goalData.current / goalData.goal) * 100) : 0;
      const goalId = goalName.toLowerCase().replace(/\s/g, "-");
      
      // Determine progress bar color based on goal
      let progressBarColor = "from-indigo-500 to-purple-500";
      if (goalName === "Emergency Fund") progressBarColor = "from-green-500 to-emerald-500";
      else if (goalName === "Vacation (Cape Coast)") progressBarColor = "from-blue-500 to-cyan-500";
      else if (goalName === "New Laptop") progressBarColor = "from-purple-500 to-fuchsia-500";
      else if (goalName === "Land Investment") progressBarColor = "from-amber-500 to-yellow-500";
      
      const goalCard = document.createElement("div");
      goalCard.className = "bg-indigo-800 rounded-xl p-6 shadow-lg flex flex-col card-hover";
      goalCard.setAttribute("aria-label", goalName + " Goal");
      goalCard.setAttribute("role", "region");
      goalCard.setAttribute("tabindex", "0");
      
      goalCard.innerHTML = `
        <div class="flex justify-between items-start">
          <h4 class="text-indigo-300 font-semibold mb-2">${goalName}</h4>
          <button class="text-indigo-400 hover:text-white transition edit-goal-btn" data-goal="${goalName}">
            <i class="fas fa-edit"></i>
          </button>
        </div>
        <p class="text-indigo-400 mb-4" id="${goalId}-goal-text">Goal: ${formatCurrency(goalData.goal, data.currency)}</p>
        <div aria-hidden="true" class="w-full bg-indigo-900 rounded-full h-6 overflow-hidden mb-2">
          <div class="bg-gradient-to-r ${progressBarColor} h-6 rounded-full transition-all duration-1000" id="${goalId}-progress" style="width: ${percent}%"></div>
        </div>
        <p class="mt-2 text-indigo-300 font-semibold" id="${goalId}-percent">${percent.toFixed(0)}% completed</p>
        <p class="mt-2 text-indigo-400 text-sm">Target: ${formatDate(goalData.deadline)}</p>
        <button class="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-lg transition self-start flex items-center space-x-2 add-funds-btn" data-goal="${goalName}" type="button">
          <i class="fas fa-plus"></i>
          <span>Add Funds</span>
        </button>
      `;
      
      goalsContainer.appendChild(goalCard);
    });
    
    // Add event listeners to dynamically created buttons
    document.querySelectorAll(".edit-goal-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const goalName = e.currentTarget.dataset.goal;
        openEditGoalModal(goalName);
      });
    });
    
    document.querySelectorAll(".add-funds-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const goalName = e.currentTarget.dataset.goal;
        openAddFundsModal(goalName);
      });
    });
  };

  // Settings form logic
  const settingsForm = document.getElementById("settings-form");
  settingsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(settingsForm);
    data.userName = formData.get("username");
    data.currency = formData.get("currency");
    data.theme = formData.get("theme");
    data.notifications = formData.get("notifications") === "on";
    data.monthlyReport = formData.get("monthly-report") === "on";
    
    // Save reminder preferences
    const billReminder = document.getElementById("bill-reminder").checked;
    const savingsReminder = document.getElementById("savings-reminder").checked;
    localStorage.setItem("billReminder", billReminder);
    localStorage.setItem("savingsReminder", savingsReminder);
    
    saveAppData();
    updateUserName();
    updateSummary();
    
    showNotification("Settings saved successfully!");
  });

  // Refresh data button (simulate refresh)
  const refreshDataBtn = document.getElementById("refresh-data-btn");
  refreshDataBtn.addEventListener("click", () => {
    const icon = refreshDataBtn.querySelector("i");
    icon.classList.add("animate-spin-slow");
    
    // Simulate data refresh
    setTimeout(() => {
      icon.classList.remove("animate-spin-slow");
      showNotification("Data refreshed successfully!");
    }, 1500);
  });

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  // Initialize all
  const init = () => {
    // Load user preferences
    const savedUserName = localStorage.getItem('userName');
    if (savedUserName) {
      data.userName = savedUserName;
    }
    
    const savedLocation = localStorage.getItem('location');
    if (savedLocation) {
      data.location = savedLocation;
    }
    
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency) {
      data.currency = savedCurrency;
    }
    
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      data.notifications = savedNotifications === 'true';
    }
    
    const savedMonthlyReport = localStorage.getItem('monthlyReport');
    if (savedMonthlyReport) {
      data.monthlyReport = savedMonthlyReport === 'true';
    }
    
    // Set profile picture
    const profilePic = localStorage.getItem('profilePic');
    if (profilePic) {
      document.getElementById('profile-pic-btn').src = profilePic;
    }
    
    // Set reminder preferences
    const billReminder = localStorage.getItem('billReminder') === 'true';
    const savingsReminder = localStorage.getItem('savingsReminder') === 'true';
    document.getElementById('bill-reminder').checked = billReminder;
    document.getElementById('savings-reminder').checked = savingsReminder;
    
    updateUserName();
    updateSummary();
    resetTransactions();
    createIncomeExpensesChart(30);
    createCategoryBreakdownChart();
    renderGoals();
    
    // Load settings
    document.getElementById("username").value = data.userName;
    document.getElementById("currency").value = data.currency;
    document.getElementById("theme").value = data.theme;
    document.getElementById("notifications").checked = data.notifications;
    document.getElementById("monthly-report").checked = data.monthlyReport;
  };

  init();
});