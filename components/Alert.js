import React from "react"
import { FaTimes } from "react-icons/fa"

export const Alert = ({ buttonText, message, buttonTrigger, close }) => {
  return (
    <div className="text-center py-4 lg:px-4">
      <div
        className="p-2 bg-red-500 items-center text-indigo-100 leading-none lg:rounded-full flex"
        role="alert"
      >
        <FaTimes onClick={close} className="cursor-pointer mr-2" />
        <span className="font-semibold mr-2 text-left flex-auto">
          {message}
        </span>
        <button
          className="btn small flex rounded-full uppercase px-2 py-1 text-xs font-bold mr-3 cursor-pointer"
          onClick={buttonTrigger}
        >
          {buttonText}
          <svg
            className="fill-current opacity-75 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

Alert.propTypes = {}
