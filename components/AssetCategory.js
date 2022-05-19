import { useContext, useState, useEffect } from "react"
import {
  StoreContext,
  constants,
  useTotalAmounts,
  assetMethods,
  helpers,
  useRate,
} from "../utils"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { useVisibility } from "../utils/hooks"
import { SimpleView } from "./"
import { Loading } from "./Loading"
import Loadable from "react-loadable"
import { TableManager } from "./table"
import Head from "next/head"
import { FaPlus } from "react-icons/fa"
import Link from "next/link"
import ReactTooltip from "react-tooltip"

const { assetsForCategory, tableStatsMaker, portfolioDonutStatsMaker } =
  assetMethods
const { newInstitutionLanguage } = helpers

const { CATEGORIES } = constants

const LoadedDonut = Loadable({
  loader: () => import("./charts/percentages"),
  loading: Loading,
})
export const AssetCategory = ({ category = "crypto", assets }) => {
  const { totalDisplayed, toggleTotal } = useVisibility()
  const [thisCategory, setThisCategory] = useState(null)
  const [total, setTotal] = useState("")
  const [table, setTable] = useState(true)
  const [donutAssets, setDonutAssets] = useState({})
  const [assetsFormatted, setAssetsFormatted] = useState([])
  const { rateFor, percentageChangeFor } = useRate()
  const numberOfTopAssets = 5

  const {
    state: { categories, institutions, currency },
    // loading,
  } = useContext(StoreContext)

  const { totalForAssets } = useTotalAmounts()

  useEffect(() => {
    setThisCategory(categories.find((c) => c.item.name === category))
  }, [categories])
  useEffect(() => {
    setTotal(totalForAssets(assetsForCategory(assets, institutions, category)))
  }, [assets, category])

  useEffect(() => {
    setTable(category === "crypto" ? true : false)
  }, [category])

  useEffect(() => {
    if (!assets) return
    const theseAssets = assetsForCategory(assets, institutions, category)
    const a = tableStatsMaker(
      theseAssets,
      totalForAssets,
      rateFor,
      percentageChangeFor,
    )
    if (assetsFormatted !== a) setAssetsFormatted(a)
  }, [assets, category])

  useEffect(() => {
    const theseAssets = assetsForCategory(assets, institutions, category)
    const dA = portfolioDonutStatsMaker(
      theseAssets,
      rateFor,
      numberOfTopAssets,
      institutions,
    )
    // console.log(dA.locationSeries)
    setDonutAssets(dA)
  }, [assets])

  // if (loading) return <Loading fullPage />

  return (
    <div className="flex-center flex-col min-h-screen pt-20 md:mx-auto md:px-10">
      <Head>
        <title>{CATEGORIES[category] || "Portfolio"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex items-center">
        <h1 className="text-center">{`${CATEGORIES[category]}`}</h1>
        {totalDisplayed ? (
          <FaEyeSlash className="ml-1" onClick={toggleTotal} />
        ) : (
          <FaEye className="ml-1" onClick={toggleTotal} />
        )}
      </div>
      <h3>{totalDisplayed ? total : `****${currency}`}</h3>
      {category === "crypto" ? (
        <div className="my-4">
          <button
            className={`btn mr-1 ${table ? "active cursor-not-allowed" : ""}`}
            onClick={table ? () => {} : () => setTable(true)}
          >
            Table
          </button>
          <button
            className={`btn ml-1 ${table ? "" : "active cursor-not-allowed"}`}
            onClick={table ? () => setTable(false) : () => {}}
          >
            Overview
          </button>
        </div>
      ) : (
        <></>
      )}
      <div className="w-full  xl:w-4/5 overflow-x-auto">
        {/* <Category category={thisCategory?.item} id={thisCategory?.itemId} /> */}
        {thisCategory ? (
          table ? (
            <TableManager category={category} assets={assetsFormatted} />
          ) : (
            <SimpleView category={category} />
          )
        ) : null}
      </div>
      <Link href={`/category/${category}`} passHref>
        <div
          className="border m-5 cursor-pointer flex-center p-10 hover:underline rounded"
          data-for={"new-institution"}
          data-tip
        >
          <FaPlus className="" />
        </div>
      </Link>

      <ReactTooltip id={"new-institution"}>
        {newInstitutionLanguage(category)}
      </ReactTooltip>
      <div className="flex w-full flex-col md:flex-row">
        <div className="w-full md:w-1/2">
          <h3>{`${numberOfTopAssets} Largest Assets`}</h3>
          <LoadedDonut
            series={donutAssets.series}
            labels={donutAssets.labels}
            currency={currency}
          />
        </div>
        {/*
        <div className="w-full md:w-1/2 notice">
           <h3>{"Location"}</h3>
          <LoadedDonut
            // TODO: use combiend amount form each institution (see table)data from
            series={donutAssets.locationSeries}
            labels={donutAssets.locationLabels}
            currency={currency}
        </div>
          /> */}
      </div>
    </div>
  )
}
