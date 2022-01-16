import { useContext } from "react"
import { StoreContext, constants } from "../utils"
const { CURRENCIES } = constants

export const CurrencyPicker = () => {
  const {
    state: { currency },
    dispatch,
  } = useContext(StoreContext)

  const switchCurrency = (newCurrency) => {
    dispatch({
      type: "SET_CURRENCY",
      payload: newCurrency,
    })
  }

  return (
    <div className="flex">
      <select
        className="border ml-2"
        name="currency"
        onChange={(e) => switchCurrency(e.target.value)}
        value={currency || "GBP"}
      >
        {Object.keys(CURRENCIES).map((curr) => {
          return (
            <option value={curr} key={curr}>
              {CURRENCIES[curr]}
            </option>
          )
        })}
      </select>
    </div>
  )
}

CurrencyPicker.propTypes = {}
