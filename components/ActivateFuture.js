import { useContext, useState } from "react"
import { StoreContext } from "../utils"

export const ActivateFuture = () => {
  // const {
  //   state: { inflation },
  //   dispatch,
  // } = useContext(StoreContext)
  const [future, setFuture] = useState(false)
  const toggleFuture = () => {
    setFuture((current) => !current)
    // dispatch({
    //   type: "SET_INFLATION",
    //   payload: !inflation,
    // })
  }

  return (
    <div className="flex mt-2">
      <span>See the future!</span>
      <div
        className={`ml-2 relative rounded-full w-12 h-6 transition duration-200 ease-linear ${
          future ? "bg-green-400" : "bg-gray-400"
        }`}
      >
        <label
          onClick={() => toggleFuture()}
          htmlFor="toggle"
          className={`absolute left-0 bg-white border-2 mb-2 w-6 h-6 rounded-full transition transform duration-100 ease-linear cursor-pointer ${
            future
              ? "translate-x-full border-green-400"
              : "translate-x-0 border-gray-400"
          }`}
        ></label>

        <input
          type="checkbox"
          id="toggle"
          name="toggle"
          className="appearance-none w-full h-full active:outline-none focus:outline-none"
          value={future}
        />
      </div>
      {future && (
        <span className="text-sm">Working on this feature. Bear with!</span>
      )}
    </div>
  )
}

ActivateFuture.propTypes = {}
