import { helpers } from "./helpers"
import { moneyHelpers } from "./moneyHelpers"
const { sortByDate, removeFromArray } = helpers
const { percentage } = moneyHelpers
import axios from "axios"
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
// const NUMBER_OF_DAYS = 30

const getAssetCurrencies = (assets = []) => {
  let set = new Set()
  assets.map((asset) => {
    set.add(asset.currency.toLowerCase())
  })
  return [...set]
}

const institutionsIdsForCategory = (institutions, categoryName) => {
  return institutions
    .filter((i) => i.item.category === categoryName)
    .map((i) => i.item.id)
}

const assetsForCategory = (assets, institutions, categoryName) => {
  const currentInst = institutionsIdsForCategory(institutions, categoryName)
  return assets
    .filter((asset) => {
      return currentInst.includes(asset.item.institution)
    })
    .map((a) => a.item)
}

const assetAmountAt = (day, dataPoints) => {
  if (dataPoints.length === 0) return 0
  const dayObject = new Date(day)

  const filtered = dataPoints.filter(
    (data) => dayObject > new Date(data.datetime),
  )
  return filtered.length > 0
    ? filtered[0].holdings
    : dataPoints[dataPoints.length - 1].holdings
}

const sortedDatapoints = (asset) => {
  return sortByDate([...asset.dataPoints])
}

// const daysMaker = (numberOfDays = 10) => {
//   var day = new Date()
//   day.setDate(day.getDate() - numberOfDays)
//   day.setHours(0, 0, 0, 0)
//   const startOfDays = [...Array(numberOfDays)].map((_, i) => {
//     day.setDate(day.getDate() + 1)
//     return day.valueOf()
//   })
//   const now = new Date()
//   startOfDays.push(now.valueOf())
//   return startOfDays
// }
const holdingsCurve = (dates, asset) => {
  const datapoints = sortedDatapoints(asset)
  return dates.map((date) => {
    return [date, assetAmountAt(date, datapoints)]
  })
}
const holdingsValueCurve = (data, asset) => {
  const datapoints = sortedDatapoints(asset)
  return data.map(([date, rate]) => {
    return [date, assetAmountAt(date, datapoints) * rate]
  })
}

const seriesMakerSingle = (data, asset) => {
  // const rates = getRates(days, currency, asset.currency)
  const curves = [
    {
      name: `${asset.name} holdings`,
      data: holdingsCurve(
        data.map(([date]) => date),
        asset,
      ),
    },
    { name: `${asset.name} rate`, data },
    {
      name: `Value of ${asset.name} holdings`,
      data: holdingsValueCurve(data, asset),
    },
  ]
  return curves

  // const dates = daysMaker(numberOfDays)
  // console.log({ timeSeries })
  // const rates = [234, 254, 234, 260, 320, 330, 300, 340]
  // const curves = [
  //   { name: `${asset.name} holdings`, data: holdingsCurve(asset, dates) },
  //   { name: `${asset.name} rate`, data: rateCurve(dates, rates) },
  //   {
  //     name: `Value of ${asset.name} holdings`,
  //     data: holdingsValueCurve(asset, dates, rates),
  //   },
  // ]
  // return curves
}
const seriesMaker = (assets = [], days = 10) => {
  return assets.map((asset) => {
    return {
      name: asset?.name,
      data: holdingsCurve(asset, days),
    }
  })
}

const getTimeseries = async (from, to, first_date) => {
  return await axios(
    `${BACKEND_URL}/rate/timeseries?from=${from}&to=${to}&first_date=${first_date}`,
  )
  // .then((response) => {
  //   return response.data
  // })
  // .catch((error) => {
  //   console.error("Error fetching data: ", error)
  // })
}

const newAssetMaker = (
  asset,
  data,
  deleteDataPoint = false,
  categoryLiability = false,
) => {
  let newDataPoints = asset.dataPoints ? [...asset.dataPoints] : []
  let newHoldings = asset.holdings
  if (deleteDataPoint) {
    newDataPoints = removeFromArray(newDataPoints, data)
    newHoldings = newDataPoints[0] ? newDataPoints[0].holdings : 0
  } else {
    newDataPoints.push(data)
  }

  const latestAsset = sortByDate(newDataPoints)[0]
  const liability = categoryLiability || data.holdings < 0

  let newAsset = {
    ...asset,
    liability,
    dataPoints: newDataPoints,
    holdings: newHoldings,
  }
  if (data === latestAsset) newAsset.holdings = data.holdings
  return newAsset
}

const assetsForInstitution = (assets, institution) => {
  const forInst = assets.filter((asset) => {
    return asset.item.institution === institution.id
  })
  return forInst
}

const returnPercentage = (currentPrice, purchasePrice) => {
  // return a percentage growth or drop
  const totalReturn = Math.abs(currentPrice - purchasePrice).toFixed(1)
  const ROI = (totalReturn / purchasePrice).toFixed(1) * 100
  return [totalReturn, ROI]
}

const donutStatsMaker = (categories, assets, institutions, totalForAssets) => {
  const totalAmount = totalForAssets(
    assets.map((a) => a.item),
    true,
    false,
    false,
  )
  let setUp = categories.map((cat) => {
    const aForCat = assetsForCategory(assets, institutions, cat.item.name)
    const amount = totalForAssets(aForCat, true)
    if (amount === 0) return null
    const split = percentage((amount * 100) / totalAmount)
    return {
      name: cat.item.name,
      enabled: cat.item.enabled,
      percentage: cat.item.percentage,
      amount,
      split,
    }
  })
  return setUp.filter(Boolean).flat()
}

const portfolioDonutStatsMaker = (assets, rateFor, length) => {
  let currencies = {}
  // let locations = {}
  assets.map((asset) => {
    const h = asset.holdings
    const c = asset.currency
    // const i = asset.institution
    currencies[c] ? (currencies[c] += h) : (currencies[c] = h)
    // locations[i] = h
  })
  Object.keys(currencies).map((curr) => {
    const v = [currencies[curr], currencies[curr] * rateFor(curr)]
    currencies[curr] = v
  })
  const series = Object.values(currencies)
    .map((v) => v[1])
    .slice(0, length)

  // // console.log({ locations })
  // Object.keys(locations).map((loc) => {
  //   let amount = 0
  //   locations[loc].map((pair) => (amount += pair[0] * rateFor(pair[1])))
  //   locations[loc] = amount
  // })
  // console.log({ locations })
  // const locationLabels = Object.keys(locations).map((id) => {
  //   const inst = institutions.find((i) => Number.parseInt(id) == i.item.id)
  //   return inst.item.name
  // })
  // console.log({ locationLabels })

  return {
    series,
    labels: Object.keys(currencies).slice(0, length),
    // locationSeries: Object.values(locations).slice(0, length),
    // locationLabels,
    // locationSeries: [100],
  }
}
const tableStatsMaker = (
  assets,
  totalForAssets,
  rateFor,
  percentageChangeFor,
) => {
  const totalAmount = totalForAssets(assets, true)
  let setUp = assets.map((asset) => {
    const rate = rateFor(asset.currency)
    const amount = rate * asset.holdings
    const percentageChange = percentageChangeFor(asset.currency)
    const ranking = rateFor(asset.currency, "market_cap_rank")
    // console.log({ i: asset.institution })
    const image = rateFor(asset.currency, "image")
    if (amount === 0) return null
    const split = percentage((amount * 100) / totalAmount)

    return {
      name: asset.name,
      id: asset.id,
      ranking,
      institution: asset.institution,
      rate,
      image,
      amount,
      holdings: asset.holdings,
      currency: asset.currency,
      interest: asset.interest,
      hidden: asset.hidden,
      d1: percentageChange["24h"],
      d7: percentageChange["7d"],
      sparkline: rateFor(asset?.currency, "sparkline"),
      y1: percentageChange["1y"],
      split,
    }
  })
  return setUp.filter(Boolean).flat()
}

export const assetMethods = {
  getAssetCurrencies,
  institutionsIdsForCategory,
  assetsForCategory,
  assetsForInstitution,
  donutStatsMaker,
  tableStatsMaker,
  seriesMakerSingle,
  getTimeseries,
  seriesMaker,
  newAssetMaker,
  returnPercentage,
  portfolioDonutStatsMaker,
}
