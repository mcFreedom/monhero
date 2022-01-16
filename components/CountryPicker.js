import { useContext } from "react"
import { StoreContext, constants } from "../utils"
const { COUNTRIES } = constants

export const CountryPicker = () => {
  const {
    state: { country },
    dispatch,
  } = useContext(StoreContext)

  const switchCountry = (newCountry) => {
    dispatch({
      type: "SET_COUNTRY",
      payload: newCountry,
    })
  }

  return (
    <div className="flex">
      <span>Your country:</span>
      <select
        className="border ml-2"
        name="country"
        onChange={(e) => switchCountry(e.target.value)}
        value={country || "US"}
      >
        {Object.keys(COUNTRIES).map((country) => {
          return (
            <option value={country} key={country}>
              {COUNTRIES[country]}
            </option>
          )
        })}
      </select>
    </div>
  )
}

CountryPicker.propTypes = {}
