import { useState, useContext, useEffect } from "react"
import { StoreContext, assetMethods, constants } from "../utils"
import { Loading } from "../components"
import { WelcomeModal } from "../components/portal"
import Head from "next/head"

import Loadable from "react-loadable"
import { FaEye, FaEyeSlash, FaInfo, FaSpinner } from "react-icons/fa"
import ReactTooltip from "react-tooltip"

const LoadedChart = Loadable({
  loader: () => import("../components/charts/allAssetsChart"),
  loading: Loading,
})
const LoadedDonut = Loadable({
  loader: () => import("../components/charts/percentages"),
  loading: Loading,
})

import { useVisibility, useTotalAmounts, useRate } from "../utils/hooks"
// const { retrieveLocalStorage } = helpers
const { donutStatsMaker } = assetMethods
const { CATEGORIES } = constants

// const { chartLayout } = constants
// const { withTotal } = helpers
// const { chartDataMaker } = chartTools

export default function Home() {
  const { totalDisplayed, toggleTotal } = useVisibility()
  const { totalForAssets } = useTotalAmounts()
  const {
    state: { currency, assets, categories, institutions },
  } = useContext(StoreContext)
  const { loading } = useRate()
  const [showModal, setShowModal] = useState(false)
  const [categoryAttributesPositives, setCategoryAttributesPositives] =
    useState([])

  // useEffect(() => {
  //   retrieveLocalStorage("tutorialAccepted").then((value) => {
  //     setShowModal(!value)
  //   })
  // }, [])
  useEffect(() => {
    const theseAssets = assets.filter((a) => !a.item.liability)
    setCategoryAttributesPositives(
      donutStatsMaker(categories, theseAssets, institutions, totalForAssets),
    )
  }, [categories])

  return (
    <container>
      <Head>
        <title>Secret Assets</title>
      </Head>
      <main className="p-0 mb-32 md:mb-20 mx-48 flex-center flex-col w-full relative">
        <div className="flex w-full mt-20 mb-20">
          <div className="flex mx-20 justify-between w-full">
            <div className="border rounded p-5">
              <div className="text-xs text-gray-600 flex items-center justify-between">
                <div className="flex items-center">
                  Total Worth
                  {totalDisplayed ? (
                    <FaEyeSlash className="ml-1" onClick={toggleTotal} />
                  ) : (
                    <FaEye className="ml-1" onClick={toggleTotal} />
                  )}
                </div>
                <FaInfo data-for={"totalWorthInfo"} data-tip />
              </div>
              <h2 className="font-bold text-2xl p-0">
                {loading ? (
                  <FaSpinner className="fa-spin" />
                ) : totalDisplayed ? (
                  `${totalForAssets(
                    assets.map((a) => a.item),
                    false,
                    false,
                    true,
                  )}`
                ) : (
                  `****${currency}`
                )}
              </h2>
            </div>
            <div className="border rounded p-5">
              <div className="text-xs text-gray-600 flex items-center justify-between">
                <div className="flex items-center">
                  Net Worth
                  {totalDisplayed ? (
                    <FaEyeSlash className="ml-1" onClick={toggleTotal} />
                  ) : (
                    <FaEye className="ml-1" onClick={toggleTotal} />
                  )}
                </div>
                <FaInfo data-for={"netWorthInfo"} data-tip />
              </div>

              <h2 className="font-bold text-2xl p-0">
                {loading ? (
                  <FaSpinner className="fa-spin" />
                ) : totalDisplayed ? (
                  `${totalForAssets(
                    assets.map((a) => a.item),
                    false,
                    false,
                    true,
                  )}`
                ) : (
                  `****${currency}`
                )}
              </h2>
            </div>
            <div className="border rounded p-5">
              <div className="text-xs text-gray-600 flex items-center justify-between">
                <div className="flex items-center">
                  Liquid assets
                  {totalDisplayed ? (
                    <FaEyeSlash className="ml-1" onClick={toggleTotal} />
                  ) : (
                    <FaEye className="ml-1" onClick={toggleTotal} />
                  )}
                </div>
                <FaInfo data-for={"liquidAssets"} data-tip />
              </div>

              <h2 className="font-bold text-2xl p-0">
                {loading ? (
                  <FaSpinner className="fa-spin" />
                ) : totalDisplayed ? (
                  `${totalForAssets(
                    assets.map((a) => !a.item.liability),
                    false,
                    true,
                    false,
                  )}`
                ) : (
                  `****${currency}`
                )}
              </h2>
            </div>
          </div>
        </div>
        <ReactTooltip id={"totalWorthInfo"}>All your assets</ReactTooltip>
        <ReactTooltip id={"netWorthInfo"}>Assets - Liabilities</ReactTooltip>
        <ReactTooltip id={"liquidAssets"}>Non locked assets</ReactTooltip>
        <div className="w-full mx-48">
          <LoadedChart currency={currency} />
        </div>
        <div className="w-full flex flex-col md:flex-row mt-10">
          <div className="w-full border  mx-10 rounded-xl relative">
            <h3 className="my-5">Daily Profits and Losses</h3>
            <div className="absolute text-center top-1/4 w-full h-full bg-white opacity-5">
              <div className="">Coming soon</div>
            </div>
          </div>
          <div className="w-full border mx-10 rounded-xl">
            <h3 className="my-5">Assets</h3>
            <LoadedDonut
              series={categoryAttributesPositives
                .filter((category) => category?.amount > 0)
                .map((category) => category?.amount)}
              labels={categoryAttributesPositives
                .filter((category) => category?.amount > 0)
                .map((category) => CATEGORIES[category?.name])}
              currency={currency}
            />
          </div>
        </div>

        <WelcomeModal shown={showModal} setIsShown={setShowModal} />
      </main>
    </container>
  )
}
