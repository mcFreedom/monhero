import React from "react"
import PropTypes from "prop-types"

export const Toggle = ({ value = false, toggle = () => {}, name = "" }) => {
  return (
    <div
      className={`ml-2 relative rounded-full w-12 h-6 transition duration-200 ease-linear ${
        value ? "bg-green-400" : "bg-gray-400"
      }`}
    >
      <label
        onClick={() => toggle()}
        htmlFor={name}
        className={`absolute left-0 bg-white border-2 mb-2 w-6 h-6 rounded-full transition transform duration-100 ease-linear cursor-pointer ${
          value
            ? "translate-x-full border-green-400"
            : "translate-x-0 border-gray-400"
        }`}
      ></label>

      <input
        type="checkbox"
        id="toggle"
        name="toggle"
        className="appearance-none w-full h-full active:outline-none focus:outline-none"
        value={value}
      />
    </div>
  )
}

Toggle.propTypes = {}
