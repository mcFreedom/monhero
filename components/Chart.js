import dynamic from "next/dynamic"
import PropTypes from "prop-types"

const DynamicPlot = dynamic(import("./StaticPlot"), {
  ssr: false,
  loading: () => <div className="flex-center">Loading</div>,
})

export const Chart = ({ data, layout }) => {
  return <DynamicPlot data={data} layout={layout} />
}

Chart.propTypes = {
  data: PropTypes.array,
  layout: PropTypes.object,
}
