import React, { useContext } from "react"
import { Sparklines, SparklinesLine } from "react-sparklines"
import { StoreContext, moneyHelpers } from "../../utils"
import styles from "../../styles/Category.module.css"
import { FaExchangeAlt, FaLock, FaSpinner } from "react-icons/fa"
import Link from "next/link"
import ReactTooltip from "react-tooltip"

import { useRate, useVisibility } from "../../utils/hooks"

const {
  tr,
  tdLeft,
  tdRightAlign,
  lastColumn,
  leftColumn,
  green,
  red,
  neutral,
  // totalRow,
  // categoryTotalRow,
} = styles
const { percentage, formattedMoney } = moneyHelpers

const Loader = () => {
  return (
    <div className="flex justify-end">
      <FaSpinner className="fa-spin" />
    </div>
  )
}

const returns = (percentageChange = {}, sparkline = null, loading = true) => {
  let sparkColor = "blue"
  if (percentageChange["7d"] < -5) sparkColor = "red"
  if (percentageChange["7d"] > 5) sparkColor = "green"
  return (
    <>
      <td
        className={
          loading ? neutral : percentageChange["24h"] < 0 ? red : green
        }
        id="24h"
      >
        {loading ? <Loader /> : percentage(percentageChange["24h"] || 0)}
      </td>
      <td
        className={loading ? neutral : percentageChange["7d"] < 0 ? red : green}
        id="7d"
      >
        {loading ? <Loader /> : percentage(percentageChange["7d"] || 0)}
      </td>
      <td className={tdRightAlign}>
        {sparkline ? (
          <Sparklines data={sparkline}>
            <SparklinesLine color={sparkColor} />
          </Sparklines>
        ) : null}
      </td>

      <td
        className={loading ? neutral : percentageChange["1y"] < 0 ? red : green}
        id="1y"
      >
        {loading ? <Loader /> : percentage(percentageChange["1y"] || 0)}
      </td>
    </>
  )
}
export const Row = ({
  asset = {},
  leftColumnStyle = {},
  children = {},
  categoryProp = "",
  // total = false,
  // categoryTotal = false,
}) => {
  const {
    state: { currency },
  } = useContext(StoreContext)

  const { rateFor, percentageChangeFor, loading } = useRate()
  const { totalDisplayed } = useVisibility()
  // const rate = 1
  // if (total) style = totalRow
  // if (categoryTotal) style = categoryTotalRow
  return (
    <tr className="h-10 overflow-x-auto max-w-full">
      <td className={leftColumn} style={leftColumnStyle}>
        {children}
      </td>
      <td className={tdLeft} id="assetName">
        <div className="flex items-center">
          {asset.locked ? (
            <FaLock className="inline pr-1 text-gray-400 text-sm" />
          ) : (
            ""
          )}{" "}
          {`${asset.name}`}
        </div>
      </td>
      <td className={tdRightAlign} id="price">
        {loading ? (
          <Loader />
        ) : (
          formattedMoney(rateFor(asset.currency), currency)
        )}
      </td>
      <td className={tdRightAlign} id="holdings">
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className={`${asset.liability ? "text-red-400" : ""}`}>
              {totalDisplayed
                ? formattedMoney(
                    asset.holdings * rateFor(asset.currency) || 0,
                    currency,
                  )
                : `*** ${currency}`}
            </div>
            <div
              className={`${
                asset.liability ? "text-red-300" : "text-gray-600"
              }`}
            >
              {totalDisplayed
                ? formattedMoney(asset.holdings || 0, asset.currency)
                : `*** ${asset.currency}`}
            </div>
          </>
        )}
      </td>

      {categoryProp === "crypto"
        ? returns(
            percentageChangeFor(asset?.currency),
            rateFor(asset?.currency, "sparkline"),
            loading,
          )
        : null}
      <td className={tdRightAlign} id="interest">
        {percentage(asset.interest || 0)}
      </td>
      {/* <td
        className={tdRightAlign}
        id="pnl"
        // TODO: color
      >
        <div>{formattedMoney(asset.profit || 1000, currency)}</div>
        <div className="text-gray-600">
          {percentage(asset.profitPercentage || 10)}
        </div>
      </td> */}

      <td className={lastColumn} id="actions">
        <div className="flex-center justify-end">
          <Link title="Edit holdings" href={`/asset/${asset.id}`}>
            <div
              className="cursor-pointer"
              data-for={`asset/${asset.id}`}
              data-tip
            >
              <FaExchangeAlt className="text-gray-500 mr-2" />
            </div>
          </Link>
          <ReactTooltip id={`asset/${asset.id}`}>
            Edit holdings for {asset.name}
          </ReactTooltip>
        </div>
      </td>
    </tr>
  )
}
