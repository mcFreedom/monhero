import React from "react"
import dynamic from "next/dynamic"
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

import { apexChartTools } from "../../utils"
const { chartOptions, series: seriesExample } = apexChartTools

const allAssetsChart = ({ currency, series }) => {
  const loadedSeries = series || seriesExample
  return (
    <div className="block">
      <div className="absolute text-center top-1/4 w-full h-full">
        <h3>Asset chart</h3>
        <div>Coming soon</div>
      </div>
      <div className="bg-white opacity-5">
        <Chart
          options={chartOptions(currency)}
          series={loadedSeries}
          type="line"
          width="100%"
          height="315px"
          style={{ minHeight: "315px" }}
        />
      </div>
    </div>
  )
}

export default allAssetsChart
