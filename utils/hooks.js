import { useContext } from "react"
import { StoreContext, RateContext } from "../utils"
import { moneyHelpers } from "./moneyHelpers"
const { formattedMoney } = moneyHelpers

export function useRate() {
  const { rates, loading, error } = useContext(RateContext)

  const rateFor = (toCurrency, property = "rate") => {
    // console.log({ loading, rates, ok: rates[toCurrency?.toLowerCase()] })
    if (toCurrency && rates && rates[toCurrency?.toLowerCase()]) {
      return rates[toCurrency.toLowerCase()]?.[property]
    }
    return property === "rate" ? 1 : null
  }
  const percentageChangeFor = (toCurrency) => {
    const periods = ["24h", "7d", "1y"]
    const percentages = rates?.[toCurrency?.toLowerCase()]
    if (toCurrency && percentages) {
      const result = {}
      periods.map(
        (period) =>
          (result[period] = percentages[`price_change_percentage_${period}`]),
      )
      return result
    }
    return {}
  }
  return { rates, rateFor, percentageChangeFor, loading, error }
}

export function useVisibility() {
  const {
    state: { totalDisplayed },
    dispatch,
  } = useContext(StoreContext)

  const toggleTotal = () => {
    dispatch({
      type: "SET_TOTAL",
      payload: !totalDisplayed,
    })
  }
  return { totalDisplayed, toggleTotal }
}

// export function useLiability() {
//   const {
//     state: { totalDisplayed, currency },
//   } = useContext(StoreContext)
//   const assetIsLiability = (asset) => {}
// }

export function useTotalAmounts() {
  const { rateFor } = useRate()
  const {
    state: { totalDisplayed, currency },
  } = useContext(StoreContext)
  // const {assetIsLiability} =  useLiability()

  const totalForAssets = (
    assets = [],
    amount = false,
    locked = false,
    negatives = false,
  ) => {
    // TODO: add memoized
    let totalHoldings = 0

    const toIterate = locked ? assets.filter((a) => a.locked) : assets

    toIterate
      .filter((a) => !a.hidden)
      .map((asset) => {
        let multiplier = 1
        if (negatives && asset.liability && asset.holdings > 0) multiplier = -1
        if (asset.liability && asset.holdings < 0) multiplier = -1
        // multiplier(asset)
        if (asset.holdings && asset.currency) {
          totalHoldings += asset.holdings * rateFor(asset.currency) * multiplier
        }
      })

    if (totalDisplayed && amount) return Number(totalHoldings.toFixed(2))
    if (totalDisplayed) return formattedMoney(totalHoldings || 0, currency)
    return `*** ${currency}`
  }

  return { totalForAssets }
}
