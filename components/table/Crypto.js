import React, { useContext, useEffect, useState } from "react"
import Link from "next/link"
import { Tr, Td, Th } from "react-super-responsive-table"
import {
  moneyHelpers,
  // constants,
  useVisibility,
  StoreContext,
  helpers,
} from "../../utils"
import { FaLink } from "react-icons/fa"
import { SortingIcon } from "."
import { Sparklines, SparklinesLine } from "react-sparklines"
import Image from "next/image"

// const { CATEGORIES } = constants
const { formattedMoney, percentage } = moneyHelpers
const { institutionStyle, capitalize } = helpers

export const CryptoHeader = ({ setSortBy, sortBy }) => {
  return (
    <Tr>
      <Th className="text-sm">
        <div
          onClick={() => setSortBy(sortBy === 1 ? -1 : 1)}
          className="w-full md:flex-center cursor-pointer hover:underline"
        >
          <SortingIcon sortBy={sortBy} thisId={1} type="alpha" />
          Institution
        </div>
      </Th>
      <Th>
        <div
          onClick={() => setSortBy(sortBy === 2 ? -2 : 2)}
          className="w-full md:flex-center cursor-pointer hover:underline"
        >
          <SortingIcon sortBy={sortBy} thisId={2} type="alpha" />
          Asset
        </div>
      </Th>
      <Th>
        <div
          onClick={() => setSortBy(sortBy === 2.5 ? -2.5 : 2.5)}
          className="w-full md:flex-center cursor-pointer hover:underline"
        >
          <SortingIcon sortBy={sortBy} thisId={2.5} />#
        </div>
      </Th>
      <Th>
        <div
          onClick={() => setSortBy(sortBy === 3 ? -3 : 3)}
          className="w-full md:flex-center cursor-pointer hover:underline"
        >
          <SortingIcon sortBy={sortBy} thisId={3} />
          Price
        </div>
      </Th>
      <Th>
        <div
          onClick={() => setSortBy(sortBy === 4 ? -4 : 4)}
          className="w-full md:flex-center cursor-pointer hover:underline"
        >
          <SortingIcon sortBy={sortBy} thisId={4} />
          Holdings
        </div>
      </Th>
      <Th>
        <div
          onClick={() => setSortBy(sortBy === 5 ? -5 : 5)}
          className="w-full md:flex-center cursor-pointer hover:underline"
        >
          <SortingIcon sortBy={sortBy} thisId={5} />
          24h%
        </div>
      </Th>
      <Th>
        <div
          onClick={() => setSortBy(sortBy === 5 ? -5 : 5)}
          className="w-full md:flex-center cursor-pointer hover:underline"
        >
          <SortingIcon sortBy={sortBy} thisId={5} />
          7d%
        </div>
      </Th>
      <Th>
        <div className="w-full md:flex-center">7d evolution</div>
      </Th>
      <Th>
        <div
          onClick={() => setSortBy(sortBy === 5 ? -5 : 5)}
          className="w-full md:flex-center cursor-pointer hover:underline"
        >
          <SortingIcon sortBy={sortBy} thisId={5} />1 y%
        </div>
      </Th>
      <Th>
        <div
          onClick={() => setSortBy(sortBy === 6 ? -6 : 6)}
          className="w-full md:flex-center cursor-pointer hover:underline"
        >
          <SortingIcon sortBy={sortBy} thisId={6} />
          APR
        </div>
      </Th>
      <Th>
        <div
          onClick={() => setSortBy(sortBy === 7 ? -7 : 7)}
          className="w-full md:flex-center cursor-pointer hover:underline"
        >
          <SortingIcon sortBy={sortBy} thisId={7} />
          Asset %
        </div>
      </Th>
      {/* <Th className="hidden md:table-cell">Include in percentage bar?</Th> */}
    </Tr>
  )
}
export const CryptoRow = ({ i, item }) => {
  const { totalDisplayed } = useVisibility()
  const {
    state: { currency, institutions },
  } = useContext(StoreContext)
  const [institution, setInstitution] = useState(null)
  const sparkColour = (d7) => {
    if (d7 < -5) return "red"
    if (d7 > 5) return "green"
    return "blue"
  }
  useEffect(() => {
    const x = institutions.find((i) => i.item.id === item.institution)
    setInstitution(x.item)
  }, [i])

  return (
    <Tr key={i} className="md:h-20">
      <Td
        className={"cursor-pointer hover:underline"}
        style={institutionStyle(institution)}
        key={`mem${i}`}
      >
        <Link href={`/institution/${institution?.id}`}>
          <div
            className="flex items-cente text-sm"
            data-for={"institution-total"}
            data-tip
          >
            {capitalize(institution?.name)}
            <FaLink className="md:hidden ml-1" />
          </div>
        </Link>
      </Td>
      <Td className="">
        <div className="flex items-center justify-between">
          {item.currency !== currency && item.image ? (
            <Image src={item.image} width={40} height={40} />
          ) : null}

          <Link href={`/asset/${item.id}`}>
            <div className="cursor-pointer hover:underline px-1">
              {item.name}
              <FaLink className="md:hidden ml-1" />
            </div>
          </Link>
          {item.currency !== currency ? (
            <div className="text-gray-400">{item.currency}</div>
          ) : null}
        </div>
      </Td>
      <Td>
        {/* <Image src={`${item?.image}`} width={30} height={30} /> */}

        {item.ranking}
      </Td>
      <Td>{formattedMoney(item.rate, currency)}</Td>
      <Td>
        <div className="flex flex-col">
          <div>
            {!totalDisplayed
              ? `****${currency}`
              : formattedMoney(item.amount, currency)}
          </div>
          <div className="text-gray-400">
            {!totalDisplayed
              ? `****${currency}`
              : formattedMoney(item.holdings, item.currency)}
          </div>
        </div>
      </Td>
      <Td className={item.d1 < 0 ? "red" : "green"}>
        {percentage(item.d1 || 0)}
      </Td>
      <Td className={item.d7 < 0 ? "red" : "green"}>
        {percentage(item.d7 || 0)}
      </Td>
      <Td className="hidden md:table-cell">
        {item.sparkline ? (
          <Sparklines data={item.sparkline}>
            <SparklinesLine color={sparkColour(item.d7)} />
          </Sparklines>
        ) : null}
      </Td>
      <Td className={item.y1 < 0 ? "red" : "green"}>
        {percentage(item.y1 || 0)}
      </Td>
      <Td>{item.interest}</Td>
      <Td>{percentage(item.split)}</Td>
    </Tr>
  )
}
