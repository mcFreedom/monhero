import dynamic from "next/dynamic"
import PropTypes from "prop-types"

const L = () => <div className="flex-center">Loading</div>

const DynamicPlot = dynamic(import("./StaticPlot"), {
  ssr: false,
  loading: L,
})

export const Chart = ({ data, layout }) => {
  return <DynamicPlot data={data} layout={layout} />
}

Chart.propTypes = {
  data: PropTypes.array,
  layout: PropTypes.object,
}
