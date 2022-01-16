import { useContext, useState } from "react"
import { StoreContext } from "../utils"

export const ShowTotal = () => {
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

  return (
    <div className="flex mt-2">
      <span>Display aggregate on chart</span>
      <div
        className={`ml-2 relative rounded-full w-12 h-6 transition duration-200 ease-linear ${
          totalDisplayed ? "bg-green-400" : "bg-gray-400"
        }`}
      >
        <label
          onClick={() => toggleTotal()}
          htmlFor="toggle"
          className={`absolute left-0 bg-white border-2 mb-2 w-6 h-6 rounded-full transition transform duration-100 ease-linear cursor-pointer ${
            totalDisplayed
              ? "translate-x-full border-green-400"
              : "translate-x-0 border-gray-400"
          }`}
        ></label>

        <input
          type="checkbox"
          id="toggle"
          name="toggle"
          className="appearance-none w-full h-full active:outline-none focus:outline-none"
          value={totalDisplayed}
        />
      </div>
    </div>
  )
}

ShowTotal.propTypes = {}
