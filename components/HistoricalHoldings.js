import moment from "moment"
import { FaTrash, FaPen } from "react-icons/fa"
import { assetMethods, helpers, moneyHelpers, useRate } from "../utils"
const { sortByDate } = helpers
const { formattedMoney } = moneyHelpers
const { returnPercentage } = assetMethods
import { ReturnBadge } from "./"

export const HistoricalHoldings = ({ asset, setNewAssets }) => {
  const removeDataPoint = (dataPoint) => {
    setNewAssets(dataPoint, true)
  }
  const editDataPoint = () => {}
  const { rateFor } = useRate()

  const differences = sortByDate([...asset.dataPoints])
    .reverse()
    .map((dp, index, array) => {
      if (index === 0) return dp.holdings
      const prevholdings = array[index - 1].holdings
      return (dp.holdings - prevholdings).toFixed(3)
    })
    .reverse()

  // console.log({ dp: asset.dataPoints })
  const directionText = (more) => {
    if (more) return "Bought"
    return "Sold"
  }

  const differenceWithDirection = (amount) => {
    const money = formattedMoney(amount, asset.currency)
    if (amount > 0) return `+${money}`
    if (amount < 0) return `${money}`
    return money
  }

  return (
    <div className="max-h-500 overscroll-y-auto w-full">
      {sortByDate([...asset.dataPoints]).map((dataPoint, index) => {
        const currentPrice =
          rateFor(asset.currency) * Math.abs(differences[index])
        if (!dataPoint.deltaAmount) return [null, null]
        const purchasePrice =
          rateFor(dataPoint.deltaCurrency) * dataPoint.deltaAmount
        const [, ROI] = returnPercentage(currentPrice, purchasePrice)
        return (
          <div
            className={`${
              index % 2 === 0 ? "" : "bg-gray-200"
            } flex-col flex items-center rounded-b-xl`}
            key={`dataPoint${index}`}
          >
            <div className="flex items-center w-full">
              <FaPen
                onClick={() => editDataPoint(dataPoint)}
                className="self-center text-gray-400  text-5xl px-2 cursor-not-allowed"
              />
              <div className="border-b border-black w-full h-1"></div>
              <div className="w-full text-center">
                {formattedMoney(dataPoint.holdings, asset.currency)}
              </div>
              <div className="border-b border-black w-full h-1"></div>
              <FaTrash
                onClick={() => removeDataPoint(dataPoint)}
                className="self-center text-red-500 cursor-pointer text-5xl px-2"
              />
            </div>
            <div className="flex items-center w-full py-1">
              <div className="w-1/2">
                <div className="flex justify-center">
                  {differenceWithDirection(differences[index])}
                </div>
                <div className="flex justify-center">
                  <ReturnBadge roi={ROI} />
                  {/* <span className={""}>
                    {formattedMoney(totalReturn, currency)}
                  </span> */}
                </div>
              </div>
              <div className={"flex-center flex-col items-center w-1/2"}>
                {dataPoint.deltaCurrency && dataPoint.deltaAmount ? (
                  <div>{`${directionText(
                    dataPoint?.deltaMore,
                  )} for ${formattedMoney(
                    dataPoint.deltaAmount,
                    dataPoint.deltaCurrency,
                  )}`}</div>
                ) : null}

                <div className="text-xs">
                  on {moment(dataPoint.datetime).format("DD/MM/YYYY HH:MM")}
                </div>
                <div className="flex flex-col mx-2">
                  <div className="text-sm text-gray-500">
                    {dataPoint?.notes}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

HistoricalHoldings.propTypes = {}
