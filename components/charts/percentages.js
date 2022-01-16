import React from "react"
import dynamic from "next/dynamic"
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

import { apexChartTools } from "../../utils"
const { donutChartOptions } = apexChartTools

const percentages = ({ series, labels, currency }) => {
  return (
    <Chart
      series={series}
      options={donutChartOptions(labels, currency)}
      type="donut"
      width="100%"
      height="auto"
      style={{ minHeight: "200px" }}
    />
  )
}

export default percentages
