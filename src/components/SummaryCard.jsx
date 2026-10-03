function SummaryCard({
  title,
  amount,
  icon
}) {

  return (

    <div className="summary-card">

      <div className="card-icon">
        {icon}
      </div>


      <div>

        <p>
          {title}
        </p>

        <h2>
          {amount}
        </h2>

      </div>

    </div>
  )
}

export default SummaryCard