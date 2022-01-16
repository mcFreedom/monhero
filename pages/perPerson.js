const PerPerson = () => {
  const maxSupply = 18000000
  const population = 8000000000
  return (
    <div className="flex-center flex-col min-h-screen">
      <h1>Coins per person</h1>
      <div>{`Given that there will only ever be ${maxSupply} BTCs.`}</div>
      <div>{`Since there are ${population} humans at the moment.`}</div>
      <div>
        {`If you have more than ${
          maxSupply / population
        }BTC, you are doing OK 🙂`}{" "}
      </div>
      <div>If you own xxxBTC</div>
      <div>You are as rich in BTC as a 0.01%er today</div>
    </div>
  )
}

export default PerPerson
