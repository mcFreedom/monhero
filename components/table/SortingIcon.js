import React from "react"
import {
  FaSortAlphaDown,
  FaSortAlphaDownAlt,
  FaSortAmountDown,
  FaSortAmountDownAlt,
} from "react-icons/fa"

export const SortingIcon = ({ sortBy, thisId, type = "amount" }) => {
  let icon = null
  const color =
    Math.abs(sortBy) === thisId
      ? "text-grey-600 md:text-black pr-1"
      : "text-gray-400 pr-1"
  if (type === "alpha") {
    icon =
      sortBy < 0 ? (
        <FaSortAlphaDownAlt className={color} />
      ) : (
        <FaSortAlphaDown className={color} />
      )
  } else {
    icon =
      sortBy < 0 ? (
        <FaSortAmountDownAlt className={color} />
      ) : (
        <FaSortAmountDown className={color} />
      )
  }

  return icon
}
