import React from "react"
import PropTypes from "prop-types"
import { moneyHelpers } from "../../utils"
import styles from "../../styles/Category.module.css"
import { FaExchangeAlt, FaCog, FaLock } from "react-icons/fa"
import Link from "next/link"

export const RealEstateHeader = (props) => {
  return (
    <tr>
      <td className={styles.leftColumn}></td>
      <td className={styles.tdLeft}>Asset</td>
      <td className={styles.tdRightAlign}>Price</td>
      <td className={styles.tdRightAlign}>Holdings</td>
      <td className={styles.tdRightAlign}>1y</td>
      <td className={styles.tdRightAlign}>10y</td>
      <td className={styles.tdRightAlign}>Interest</td>
      <td className={styles.tdRightAlign}>Profit/Loss</td>
      <td className={styles.tdPaddingRight}>Actions</td>
    </tr>
  )
}

export const RealEstateRow = ({
  asset,
  total = false,
  categoryTotal = false,
  title = null,
  leftColumnStyle = {},
  children = {},
}) => {
  const currency = "USD"
  const { percentage, formattedMoney } = moneyHelpers
  let {
    tr,
    totalRow,
    categoryTotalRow,
    tdLeft,
    tdRightAlign,
    tdPaddingRight,
    leftColumn,
    green,
    red,
  } = styles

  let style = tr
  if (total) style = totalRow
  if (categoryTotal) style = categoryTotalRow
  return (
    <tr className={style}>
      <td className={leftColumn} style={leftColumnStyle}>
        {children}
      </td>
      <td className={tdLeft}>
        <div className="flex items-center">
          {asset.locked ? <FaLock /> : ""} {`${asset.name}`}
        </div>
      </td>
      <td className={tdRightAlign}>{formattedMoney(asset.value, currency)}</td>
      <td className={tdRightAlign}>
        <div>{formattedMoney(asset.holdings * asset.value || 0, currency)}</div>
        <div className="text-gray-600">
          {formattedMoney(asset.holdings || 0, asset.name)}
        </div>
      </td>
      <td className={asset.sevenD < 0 ? red : green}>
        {percentage(asset.sevenD || 0)}
      </td>
      <td className={asset.oneYear < 0 ? red : green}>
        {percentage(asset.oneYear || 2)}
      </td>
      <td className={tdRightAlign}>{percentage(asset.interest || 0)}</td>
      <td className={tdRightAlign}>
        <div>{formattedMoney(asset.profit || 1000, currency)}</div>
        <div className="text-gray-600">
          {percentage(asset.profitPercentage || 10)}
        </div>
      </td>
      <td className={tdPaddingRight}>
        <div className="flex-center">
          <Link
            title="Manage transactions"
            href={`/asset/${asset.id}`}
            onClick={() => {}}
          >
            <FaExchangeAlt className="text-gray-500 mr-2" />
          </Link>
        </div>
      </td>
    </tr>
  )
}
