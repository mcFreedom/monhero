import React, { useContext } from "react"
import Link from "next/link"
import { Tr, Td } from "react-super-responsive-table"
import { Toggle } from ".."
import {
  moneyHelpers,
  constants,
  useVisibility,
  StoreContext,
} from "../../utils"
const { CATEGORIES } = constants
import { FaLink } from "react-icons/fa"
const { formattedMoney } = moneyHelpers

export const CategoryRow = ({ i, item, passedFunction }) => {
  const { totalDisplayed } = useVisibility()
  const {
    state: { currency },
  } = useContext(StoreContext)
  return (
    <Tr key={i}>
      <Td className="cursor-pointer hover:underline">
        <Link href={`/portfolio/${item.name}`}>
          <div className="flex items-center">
            {CATEGORIES[item.name]}
            <FaLink className="md:hidden ml-1" />
          </div>
        </Link>
      </Td>
      <Td>{item.split}</Td>
      <Td>
        {!totalDisplayed
          ? `****${currency}`
          : formattedMoney(item.amount, currency)}
      </Td>
      <Td>{"Coming Soon"}</Td>
      <Td>{"Coming Soon"}</Td>
      <Td className="hidden md:table-cell">
        <div className="flex justify-center">
          <Toggle
            value={item?.percentage}
            toggle={() => passedFunction(item.name)}
          />
        </div>
      </Td>
    </Tr>
  )
}
