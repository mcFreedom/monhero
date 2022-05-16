import { useContext, useEffect, useState } from "react"

import { Percentages, Liabilities } from "./"
import { StoreContext, constants, helpers, assetMethods } from "../../utils"
import { useVisibility, useTotalAmounts, useRate } from "../../utils/hooks"
const { CATEGORIES, CATEGORIES_COLOURS } = constants
const { crossMulti } = helpers

import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa"
import Head from "next/head"
const { institutionsIdsForCategory } = assetMethods

// const percentagesExample = {
//   // crypto: ,
//   banks: { name: "banks", width: 25, colour: "#FF0000", locked: 50 },
//   realEstate: {
//     name: "realEstate",
//     width: 25,
//     colour: "#aeaeae",
//     locked: 100,
//   },
// }

export const Footer = () => {
  const { totalDisplayed, toggleTotal } = useVisibility()
  const { totalForAssets } = useTotalAmounts()
  const [assets, setAssets] = useState([])
  const [institutions, setInstitutions] = useState([])
  const [activeAssets, setActiveAssets] = useState(null)
  const [activeLiabilities, setActiveLiabilities] = useState(null)
  const [percentages, setPercentages] = useState(null)
  const [liabilities, setLiabilities] = useState(null)

  const {
    state: {
      assets: assetsProp,
      currency,
      categories,
      institutions: institutionsProp,
    },
  } = useContext(StoreContext)
  // TODO: handle error
  const { loading } = useRate()
  useEffect(() => {
    if (assetsProp) setAssets(assetsProp.map((a) => a.item))
    if (institutionsProp) setInstitutions(institutionsProp.map((a) => a.item))
  }, [assetsProp, institutionsProp])

  const groupByCategory = (institutions, category, assets) => {
    const currentInst = institutionsIdsForCategory(institutions, category.name)
    const grouped = assets.filter((asset) => {
      return currentInst.includes(asset.institution)
    })
    return grouped?.length > 0 ? grouped : null
  }

  const percentagesMaker = (assets, total, overallWidth) => {
    const institution = institutions.find((i) => i.id === assets[0].institution)
    const cat = institution.category
    let totalForCategory = totalForAssets(assets, true, false)
    let lockedForCategory = totalForAssets(assets, true, true)

    let realPercentage = Math.abs(
      Number(
        (crossMulti(totalForCategory, total) * overallWidth) / 100,
      ).toFixed(2),
    )
    let width = Math.max(realPercentage, 1)
    let locked = crossMulti(lockedForCategory, totalForCategory) || 0
    const percentage = {
      name: CATEGORIES[cat],
      colour: CATEGORIES_COLOURS[cat],
      width,
      realPercentage,
      locked,
    }
    // console.log({ percentage })
    return percentage
  }
  useEffect(() => {
    if (!activeAssets) return
    const total = totalForAssets(activeAssets.flat(), true)
    const totalLiability = totalForAssets(activeLiabilities.flat(), true)
    const assetBigger = total > totalLiability
    const assetWidth = assetBigger ? 100 : crossMulti(total, totalLiability)
    const liabilityWidth = assetBigger ? crossMulti(totalLiability, total) : 100
    // console.log({ total, totalLiability, liabilityWidth, assetWidth })
    const percentages = activeAssets.map((catAssets) => {
      return percentagesMaker(catAssets, total, assetWidth)
    })
    const liabilities = activeLiabilities.map((catAssets) => {
      return percentagesMaker(catAssets, totalLiability, liabilityWidth)
    })
    setPercentages(percentages)
    setLiabilities(liabilities)
  }, [activeAssets, activeLiabilities])

  useEffect(() => {
    if (!categories || !institutionsProp) return null
    if (assets?.length > 0) {
      let newActiveAssets = []
      let newActiveLiabilities = []
      let positives = assets.filter((a) => !a.liability)
      let liabilities = assets.filter((a) => a.liability)
      categories
        .filter((c) => c.item.percentage)
        .map((cat) => {
          newActiveAssets.push(
            groupByCategory(institutionsProp, cat.item, positives),
          )
          newActiveLiabilities.push(
            groupByCategory(institutionsProp, cat.item, liabilities),
          )
        })
      setActiveAssets(newActiveAssets.filter((a) => a))
      setActiveLiabilities(newActiveLiabilities.filter((a) => a))
    }
  }, [categories, loading, assets, institutionsProp])

  return (
    <footer className="flex-center w-screen border-top border border-gray-200 fixed flex-col md:flex-row bottom-0 left-0 bg-white">
      <Head>
        <title>
          {assets?.length > 0
            ? totalForAssets(assets, false, false, true)
            : "Secret Assets"}
        </title>
      </Head>
      <div className="w-full md:w-1/4 flex flex-col items-end pr-10 pt-2">
        <div className="text-xs text-gray-600 flex items-center">
          Total Assets
          {totalDisplayed ? (
            <FaEyeSlash className="ml-1" onClick={toggleTotal} />
          ) : (
            <FaEye className="ml-1" onClick={toggleTotal} />
          )}
        </div>

        <h2 className="font-bold text-2xl p-0">
          {loading ? (
            <FaSpinner className="fa-spin" />
          ) : totalDisplayed ? (
            `${totalForAssets(assets, false, false, true)}`
          ) : (
            `****${currency}`
          )}
        </h2>
        {/* TODO: add once income / outgoing done  */}
        {/* <span className="text-xs text-gray-500">
          {`Income Monthly: ${formattedMoney(1000 || 0, currency)}`}
        </span> */}
      </div>
      <div className="w-full md:w-1/2 py-2">
        <Percentages percentages={percentages} />
        <Liabilities liabilities={liabilities} />
      </div>
      <div className="w-full md:w-1/4 text-center pb-2">
        <div className="text-xs">
          <div>{`Copyright ${new Date().getFullYear()}`}</div>
          <span className="font-bold pr-1">NOT</span>powered by the FED
        </div>
      </div>
    </footer>
  )
}

Footer.propTypes = {}
