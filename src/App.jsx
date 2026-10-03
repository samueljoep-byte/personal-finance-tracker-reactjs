import { useState, useEffect } from "react"
import "./App.css"

import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import SummaryCard from "./components/SummaryCard"
import TransactionList from "./components/TransactionList"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts"


function App() {

  // ==============================
  // TRANSACTIONS
  // ==============================

  const [transactions, setTransactions] = useState(() => {

    const savedTransactions =
      localStorage.getItem("transactions")

    if (savedTransactions) {
      return JSON.parse(savedTransactions)
    }

    return [
      {
        id: 1,
        name: "Groceries",
        category: "Food",
        amount: 2500,
        type: "expense"
      },
      {
        id: 2,
        name: "Monthly Salary",
        category: "Salary",
        amount: 50000,
        type: "income"
      },
      {
        id: 3,
        name: "Electricity Bill",
        category: "Bills",
        amount: 1200,
        type: "expense"
      }
    ]
  })


  // ==============================
  // FORM STATE
  // ==============================

  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState("expense")
  const [category, setCategory] = useState("Food")

  const [editingId, setEditingId] = useState(null)

  const [filterType, setFilterType] = useState("all")


  // ==============================
  // LOCAL STORAGE
  // ==============================

  useEffect(() => {

    localStorage.setItem(
      "transactions",
      JSON.stringify(transactions)
    )

  }, [transactions])


  // ==============================
  // ADD / UPDATE
  // ==============================

  function addTransaction() {

    if (
      name.trim() === "" ||
      amount === ""
    ) {
      alert("Please enter transaction name and amount")
      return
    }

    if (Number(amount) <= 0) {
      alert("Amount must be greater than 0")
      return
    }


    // UPDATE

    if (editingId !== null) {

      const updatedTransactions =
        transactions.map((transaction) =>

          transaction.id === editingId
            ? {
                ...transaction,
                name: name,
                amount: Number(amount),
                type: type,
                category: category
              }
            : transaction

        )

      setTransactions(updatedTransactions)

      setEditingId(null)

      setName("")
      setAmount("")
      setType("expense")
      setCategory("Food")

      return
    }


    // CREATE

    const newTransaction = {

      id: Date.now(),

      name: name,

      category: category,

      amount: Number(amount),

      type: type
    }


    setTransactions([
      ...transactions,
      newTransaction
    ])


    setName("")
    setAmount("")
    setType("expense")
    setCategory("Food")
  }


  // ==============================
  // DELETE
  // ==============================

  function deleteTransaction(id) {

    const updatedTransactions =
      transactions.filter(
        (transaction) =>
          transaction.id !== id
      )

    setTransactions(updatedTransactions)
  }


  // ==============================
  // EDIT
  // ==============================

  function editTransaction(transaction) {

    setEditingId(transaction.id)

    setName(transaction.name)

    setAmount(transaction.amount)

    setType(transaction.type)

    setCategory(transaction.category)

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }


  // ==============================
  // TOTAL INCOME
  // ==============================

  const totalIncome =
    transactions

      .filter(
        (transaction) =>
          transaction.type === "income"
      )

      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      )


  // ==============================
  // TOTAL EXPENSES
  // ==============================

  const totalExpenses =
    transactions

      .filter(
        (transaction) =>
          transaction.type === "expense"
      )

      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      )


  // ==============================
  // BALANCE
  // ==============================

  const balance =
    totalIncome - totalExpenses


  // ==============================
  // CATEGORY TOTALS
  // ==============================

  const categoryTotals =
    transactions

      .filter(
        (transaction) =>
          transaction.type === "expense"
      )

      .reduce(
        (totals, transaction) => {

          if (!totals[transaction.category]) {
            totals[transaction.category] = 0
          }

          totals[transaction.category] +=
            transaction.amount

          return totals

        },
        {}
      )


  // ==============================
  // PIE CHART DATA
  // ==============================

  const chartData =
    Object.entries(categoryTotals).map(
      ([category, amount]) => ({
        category,
        amount
      })
    )


  // ==============================
  // BAR CHART DATA
  // ==============================

  const incomeExpenseData = [

    {
      name: "Finance",

      income: totalIncome,

      expense: totalExpenses
    }

  ]


  // ==============================
  // FILTER
  // ==============================

  const filteredTransactions =

    filterType === "all"

      ? transactions

      : transactions.filter(
          (transaction) =>
            transaction.type === filterType
        )


  // ==============================
  // COUNT
  // ==============================
 // ==============================
  // UI
  // ==============================

  return (

    <div className="app">

      <Sidebar />


      <main className="main-content">

        <Header />


        <div
          className="dashboard"
          id="dashboard"
        >


          {/* WELCOME */}

          <div className="welcome">

            <h2>
              Welcome back, Samuel 👋
            </h2>

            <p>
              Here's your financial overview.
            </p>

          </div>


          {/* SUMMARY */}

          <div className="summary-grid">

            <SummaryCard
              title="Total Income"
              amount={`₹${totalIncome}`}
              icon="💰"
            />

            <SummaryCard
              title="Total Expenses"
              amount={`₹${totalExpenses}`}
              icon="💸"
            />

            <SummaryCard
              title="Current Balance"
              amount={`₹${balance}`}
              icon="🏦"
            />

          </div>


          {/* ADD / UPDATE FORM */}

          <div className="transaction-form">

            <h2>

              {editingId !== null
                ? "Edit Transaction"
                : "Add Transaction"}

            </h2>


            <input
              type="text"
              placeholder="Transaction name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />


            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
            />


            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
            >

              <option value="expense">
                Expense
              </option>

              <option value="income">
                Income
              </option>

            </select>


            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >

              <option value="Food">Food</option>
              <option value="Bills">Bills</option>
              <option value="Salary">Salary</option>
              <option value="Shopping">Shopping</option>
              <option value="Transport">Transport</option>
              <option value="Other">Other</option>

            </select>


            <button
              onClick={addTransaction}
              disabled={
                name.trim() === "" ||
                amount === "" ||
                Number(amount) <= 0
              }
            >

              {editingId !== null
                ? "Update Transaction"
                : "Add Transaction"}

            </button>

          </div>


          {/* CATEGORY CHART */}

          <div
            className="chart-container"
            id="categories"
          >

            <h2>
              Expenses by Category
            </h2>


            {chartData.length === 0 ? (

              <p className="empty-message">
                No expense data available.
              </p>

            ) : (

              <div className="chart-wrapper">

                <PieChart
                  width={400}
                  height={300}
                >

                  <Pie
                    data={chartData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >

                    {chartData.map(
                      (entry, index) => (

                        <Cell
                          key={`cell-${index}`}
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </div>

            )}

          </div>


          {/* REPORT CHART */}

          <div
            className="chart-container"
            id="reports"
          >

            <h2>
              Income vs Expenses
            </h2>


            <div className="chart-wrapper">

              <BarChart
                width={500}
                height={300}
                data={incomeExpenseData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="income"
                  name="Income"
                />

                <Bar
                  dataKey="expense"
                  name="Expense"
                />

              </BarChart>

            </div>

          </div>


          {/* FILTER */}

          <div className="transaction-filters">

            <button
              onClick={() =>
                setFilterType("all")
              }
              className={
                filterType === "all"
                  ? "active-filter"
                  : ""
              }
            >
              All
            </button>


            <button
              onClick={() =>
                setFilterType("income")
              }
              className={
                filterType === "income"
                  ? "active-filter"
                  : ""
              }
            >
              Income
            </button>


            <button
              onClick={() =>
                setFilterType("expense")
              }
              className={
                filterType === "expense"
                  ? "active-filter"
                  : ""
              }
            >
              Expenses
            </button>

          </div>


          {/* TRANSACTIONS */}

          <div id="transactions">

            <TransactionList
              transactions={filteredTransactions}
              deleteTransaction={deleteTransaction}
              editTransaction={editTransaction}
            />

          </div>


          {/* SETTINGS */}

          <div
            id="settings"
            className="settings-section"
          >

            <h2>
              ⚙️ Settings
            </h2>

            <p>
              Finance Tracker settings will be available here.
            </p>

          </div>


        </div>

      </main>

    </div>
  )
}


export default App