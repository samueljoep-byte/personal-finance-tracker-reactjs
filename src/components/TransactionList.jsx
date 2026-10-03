function TransactionList({
  transactions,
  deleteTransaction,
  editTransaction
}) {

  return (

    <section className="transactions">

      <h2>
        Recent Transactions ({transactions.length})
      </h2>


      {transactions.length === 0 ? (

        <p className="empty-message">
          No transactions found.
        </p>

      ) : (

        transactions.map((transaction) => (

          <div
            className="transaction"
            key={transaction.id}
          >

            <div>

              <strong>
                {transaction.name}
              </strong>

              <p>
                {transaction.category}
              </p>

            </div>


            <div className="transaction-actions">

              <span className={transaction.type}>

                {transaction.type === "income"
                  ? "+"
                  : "-"}

                ₹{transaction.amount}

              </span>


              <button
                onClick={() =>
                  editTransaction(transaction)
                }
              >
                Edit
              </button>


              <button
                onClick={() =>
                  deleteTransaction(transaction.id)
                }
              >
                Delete
              </button>

            </div>

          </div>

        ))

      )}

    </section>
  )
}

export default TransactionList