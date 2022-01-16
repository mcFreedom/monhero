import React from "react"
import dynamic from "next/dynamic"
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

import { apexChartTools } from "../../utils"
const { chartOptions, series: seriesExample } = apexChartTools

const allAssetsChart = ({ currency, series }) => {
  return (
    <Chart
      options={chartOptions(currency)}
      series={series || seriesExample}
      type="line"
      width="100%"
      height="315px"
      style={{ minHeight: "315px" }}
    />
  )
}

export default allAssetsChart
