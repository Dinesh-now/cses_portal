import React from 'react'

const Dashboard = () => {
  const statistics=[{
    title:"Total Cases",
    value:120
  },
  {
    title:"Active Cases",
    value:85
  },
  {
    title:"Pending Payments",
    value:25
  },
  {
    title:"Completed Cases",
    value:35
  }
  ]
  return (
    <div>
      <h1>Dashboard</h1>
      <p className='dashboard-text'>Welcome to Child Support Enforcement System</p>

      <div className='dashboard-cards'>
        {statistics.map((item)=>(
          <div className='card' key={item.title}>
            <h3>{item.title}</h3>
            <h2>{item.value}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard