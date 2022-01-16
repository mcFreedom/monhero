import React, { useEffect } from "react"
// import PropTypes from "prop-types"
import { FaTimes } from "react-icons/fa"

export const Toast = ({ text, shown, setShown, error = false }) => {
  useEffect(() => {
    if (shown) {
      setTimeout(() => {
        setShown(false)
      }, 2500)
    }
  }, [shown, setShown])
  const on = "right-0"
  const off = "-right-full hidden md:visible"
  return (
    <div
      className={`z-10 absolute top-20 m-5 p-5 py-3 shadow-md  flex flex-col ${
        error ? "bg-red-500" : "bg-green-500"
      } text-black rounded ton ${shown ? on : off}`}
      id="toast"
    >
      <div
        className="absolute -top-4 -right-3 rounded-full bg-white border w-8 h-8 flex-center cursor-pointer"
        onClick={() => setShown(false)}
      >
        <FaTimes alt="close-toast" className="icon text-gray-500" />
      </div>
      <div className="text-white">{text}</div>
    </div>
  )
}

Toast.propTypes = {}
