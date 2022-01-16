import React from "react"
import PropTypes from "prop-types"

export const ReturnBadge = ({ roi }) => {
  const returnPercentageFormatted = (amount) => {
    if (amount > 0) return `+${amount}%`
    if (amount < 0) return `-${amount}%`
    return amount
  }

  return (
    <span
      className={`rounded-xl ${
        roi > 0 ? "bg-green-300" : "bg-red-300"
      } text-white text-sm font-bold px-2`}
    >
      {returnPercentageFormatted(roi)}
    </span>
  )
}

ReturnBadge.propTypes = {}
