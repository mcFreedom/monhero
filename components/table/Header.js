import styles from "../../styles/Category.module.css"
import PropTypes from "prop-types"
import { helpers } from "../../utils"
const { interestRateLanguage } = helpers

const headers = {
  crypto: [
    "",
    "Asset",
    "Price",
    "Holdings",
    "1d",
    "7d",
    "7d evolution",
    "1y",
    "Interest",
    // "Profit/Loss",
    "Actions",
  ],
  realEstate: [
    "",
    "Asset",
    "Exchange Rate",
    "Value",
    "Interest",
    // "Profit/Loss",
    "Actions",
  ],
  default: [
    "",
    "Asset",
    "Exchange Rate",
    "Holdings",
    "Interest",
    // "Profit/Loss",
    "Actions",
  ],
}
const defaultStyle = [
  styles.leftColumn,
  styles.tdLeft,
  styles.tdRightAlign,
  styles.tdRightAlign,
  styles.tdRightAlign,
  styles.tdRightAlign,
  // styles.tdRightAlign,
  styles.lastColumnHeader,
]
const style = {
  crypto: [
    styles.leftColumn,
    styles.tdLeft,
    styles.tdRightAlign,
    styles.tdRightAlign,
    styles.tdRightAlign,
    styles.tdRightAlign,
    styles.tdRightAlign,
    // styles.tdRightAlign,
    styles.lastColumnHeader,
  ],
  default: defaultStyle,
  realEstate: defaultStyle,
}

const pNL = () => {
  return (
    <select
      className="border mr-2"
      name="profit-period"
      onChange={() => {}}
      value={"1 year"}
    >
      {["All time", "1 year", "1 month", "1 day"].map((period) => {
        return (
          <option value={period} key={period}>
            {period}
          </option>
        )
      })}
    </select>
  )
}
export const Header = ({
  categoryProp = "default",
  totalForCategory = null,
}) => {
  let category = "default"
  if (categoryProp === "crypto") category = "crypto"
  if (categoryProp === "realEstate" || categoryProp === "mortgage")
    category = "realEstate"
  return (
    <tr>
      {headers[category].map((title, i) => {
        return (
          <td className={style[category][i]} key={i}>
            {title === "" && totalForCategory ? totalForCategory : null}
            {title === "Profit/Loss" ? pNL() : null}
            {title === "Interest" ? interestRateLanguage(categoryProp) : title}
          </td>
        )
      })}
    </tr>
  )
}

Header.propTypes = {
  categoryProp: PropTypes.string,
  totalForCategory: PropTypes.string,
}
Header.defaultProps = {
  categoryProp: "default",
  totalForCategory: null,
}
