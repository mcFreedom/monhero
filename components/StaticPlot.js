import Plot from "react-plotly.js"

const StaticPlot = ({ data, layout }) => {
  return <Plot data={data} layout={layout} />
}

export default StaticPlot
