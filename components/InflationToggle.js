import { useContext } from "react"
import { StoreContext } from "../utils"

export const InflationToggle = () => {
  const {
    state: { inflation },
    dispatch,
  } = useContext(StoreContext)

  const toggleInflation = () => {
    dispatch({
      type: "SET_INFLATION",
      payload: !inflation,
    })
  }

  return (
    <div className="flex mt-2">
      <span>Show inflation</span>
      <div
        className={`ml-2 relative rounded-full w-12 h-6 transition duration-200 ease-linear ${
          inflation ? "bg-green-400" : "bg-gray-400"
        }`}
      >
        <label
          onClick={() => toggleInflation()}
          htmlFor="toggle"
          className={`absolute left-0 bg-white border-2 mb-2 w-6 h-6 rounded-full transition transform duration-100 ease-linear cursor-pointer ${
            inflation
              ? "translate-x-full border-green-400"
              : "translate-x-0 border-gray-400"
          }`}
        ></label>

        <input
          type="checkbox"
          id="toggle"
          name="toggle"
          className="appearance-none w-full h-full active:outline-none focus:outline-none"
          value={inflation}
        />
      </div>
    </div>
  )
}

InflationToggle.propTypes = {}
