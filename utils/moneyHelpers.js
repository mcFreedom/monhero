import { constants } from "./constants"
const { LIABLE_CATEGORIES } = constants

const isCrypto = (currency) => {
  return !(isFIAT(currency) || isOther(currency))
}
const isFIAT = (currency) => {
  if (currency == "USD") return true
  if (currency == "EUR") return true
  if (currency == "GBP") return true
  if (currency == "SGD") return true
  return false
}
const isOther = (currency) => {
  if (currency == "XAU") return true
  if (currency == "XAG") return true
  return false
}

const formattedMoney = (value, currency) => {
  if (value === null) return ""
  if (value === "%") return `${value}%`
  if (isFIAT(currency)) {
    let formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: value > 1000 ? 0 : 2,
      // maximumSignificantDigits: 2,
    }).format(value)
    return formatted
  }
  if (isOther(currency)) {
    //metals
    return `${value} ${currency}`
  }
  //cryptos
  return `${value} ${currency}`
  // console.log({ currency, value })
}

const categoryIsLiability = (cat) => {
  return LIABLE_CATEGORIES.includes(cat)
}
const percentage = (value) => {
  return `${Number.parseFloat(value).toFixed(2)}%`
}

export const moneyHelpers = {
  isCrypto,
  formattedMoney,
  categoryIsLiability,
  percentage,
}
