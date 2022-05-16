const datetimeFormat = (datetime) => {
  // "2020-11-13T01:37:35.316Z";
  // 2013-11-04 22:23:00
  let [date, timeWithZone] = JSON.stringify(datetime)
    .replace(/['"]+/g, "")
    .split("T")
  let [time] = timeWithZone.split(".")
  return [date, time]
}

const capitalize = (string) => {
  if (!string) return ""
  return string.replace(/^\w/, (w) => w.toUpperCase())
}
const interestRateLanguage = (category) => {
  const dict = {
    crypto: "APR",
    banks: "Interest Rate",
    pensions: "APR",
    realEstate: "ROI",
    mortgage: "APR",
    commodities: "Interest Rate",
    stocks: "Yield",
    goods: "Appreciation",
    loans: "Interest Rate",
    other: "Interest Rate",
  }
  return dict[category] || "Interest"
}
const institutionLanguage = (category) => {
  const dict = {
    // holdings: "Holdings",
    // banks: "Holdings",
    realEstate: " ",
  }
  return dict[category] || "institutions"
}
const institutionLanguageInfo = (category) => {
  const dict = {
    goods:
      "Usually a place. Each location can then contain a multitude of goods.",
    stocks:
      "A trading platform or bank. Each of those then holds a many stocks.",
    commodities:
      "Usually a trading platform or bank. Each one can then contain many commodities",
    crypto:
      "An exchange, an app or hard wallet habitually. Each one can then contains many currencies",
    realEstate:
      "Usually a place. Each place then can contain a multitude of properties. Arrange according to what makes sense to you!",
  }
  return (
    dict[category] || "Usually a bank. Each bank can then contain many accounts"
  )
}
const newInstitutionLanguage = (category) => {
  const dict = {
    goods: "Add a new location where your goods are stored. ",
    stocks: "Add a new trading platform or bank.",
    commodities: "Add a new commodity storage / trading institution.",
    crypto: "Add a new crypto institution",
    realEstate: "Add a new location",
  }
  return dict[category] || "Add a new institution"
}
const newAssetLanguage = (category) => {
  const dict = {
    banks: "Add a new account for this institution.",
    goods: "Add a new item for this location.",
    stocks: "Add a new stock for this platform.",
    commodities: "Add a new commodity for this institution.",
    crypto: "Add a new crypto for this institution",
    realEstate: "Add a new property in this location",
  }
  return dict[category] || "Add a new asset for this institution"
}
const holdingsLanguage = (category) => {
  const dict = {
    holdings: "Holdings",
    banks: "Holdings",
    realEstate: "Market Value",
  }
  return dict[category] || "Holdings"
}
const institutionStyle = (inst, inverted = false) => {
  if (!inst) return {}
  const { color, backgroundColor } = inst
  return inverted
    ? {
        color: backgroundColor,
        backgroundColor: color,
      }
    : {
        color,
        backgroundColor,
      }
}

const sortByDate = (array, chronological = true) => {
  let sorted = array.sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
  return chronological ? sorted.reverse() : sorted
}
const sortById = (array, firstIdFirst = true) => {
  let sorted = array.sort((a, b) => b.id - a.id)
  return firstIdFirst ? sorted.reverse() : sorted
}

const crossMulti = (proportion, total) => {
  let number = (proportion * 100) / total
  return Number(number.toFixed(2))
}

export const retrieveLocalStorage = async (x) => {
  try {
    const value = await localStorage.getItem(x)
    if (value) {
      return JSON.parse(value)
    } else {
      return null
    }
  } catch (error) {
    return null
  }
}

const assetPlaceholders = () => {
  return {
    crypto: [
      "Bitcoin",
      interestRateLanguage("crypto"),
      "Yearly interest rate if locked up, staking, DeFi...",
    ],
    banks: [
      "Current Account",
      interestRateLanguage("banks"),
      "Yearly interest rate on this account",
    ],
    realEstate: [
      "My House",
      interestRateLanguage("realEstate"),
      "Yearly return on Investment (ie: percentage of value in income after tax)",
    ],
    pensions: [
      "Work pension",
      interestRateLanguage("pensions"),
      "Estimated yearly return",
    ],
    mortgage: [
      "My house mortgage",
      interestRateLanguage("mortgage"),
      "Yearly APR",
    ],
    loans: ["Owed for car repair", interestRateLanguage("loans"), "Yearly APR"],
    other: ["Tax debt", interestRateLanguage("other"), "Yearly interest"],
    goods: [
      "My Picassos",
      interestRateLanguage("goods"),
      "Yearly appreciation or depreciation",
    ],
    commodities: [
      "My bullions",
      interestRateLanguage("commodities"),
      "Interest rate",
    ],
    stocks: [
      "Tech stocks",
      interestRateLanguage("stocks"),
      "Yearly return from dividend / coupon",
    ],
  }
}

const removeFromArray = (array, element) => {
  return array.filter((i) => i.datetime !== element.datetime)
}

export const helpers = {
  datetimeFormat,
  interestRateLanguage,
  assetPlaceholders,
  holdingsLanguage,
  capitalize,
  institutionStyle,
  institutionLanguage,
  institutionLanguageInfo,
  newInstitutionLanguage,
  newAssetLanguage,
  sortByDate,
  sortById,
  crossMulti,
  retrieveLocalStorage,
  removeFromArray,
}
