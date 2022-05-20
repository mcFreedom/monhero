import { useContext, useState, useEffect } from "react"
import {
  StoreContext,
  helpers,
  constants,
  moneyHelpers,
  assetMethods,
} from "../../utils"
import { useRouter } from "next/router"
import { useRate } from "../../utils/hooks"
import {
  AmountInput,
  HistoricalHoldings,
  Toast,
  Loading,
  Error,
} from "../../components"
import Loadable from "react-loadable"
const LoadedChart = Loadable({
  loader: () => import("../../components/charts/singleAssetChart"),
  loading: Loading,
})
import Head from "next/head"
import {
  FaEye,
  FaEyeSlash,
  FaPiggyBank,
  FaUniversity,
  FaCog,
  FaLock,
} from "react-icons/fa"

import Link from "next/link"
import ReactTooltip from "react-tooltip"

const NUMBER_OF_DAYS = 30

const { CATEGORIES } = constants
const { institutionStyle, interestRateLanguage } = helpers
const { formattedMoney } = moneyHelpers
const { seriesMakerSingle, newAssetMaker, getTimeseries } = assetMethods

export const Asset = () => {
  const router = useRouter()
  const [asset, setAsset] = useState(null)
  const [id, setId] = useState(null)
  const [institution, setInstitution] = useState(null)
  const [previousShown, setPreviousShown] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [series, setSeries] = useState([])
  const {
    rateFor,
    // percentageChangeFor,
  } = useRate()

  let { id: pageId } = router.query
  const {
    state: { assets: allAssets, institutions, currency },
    dbAction,
    loading,
    error,
  } = useContext(StoreContext)

  // const [data, setData] = useState(null)
  // useEffect(() => {
  //   if (asset) {
  //     let result = chartDataMaker(asset, currency)
  //     setData(result)
  //   }
  // }, [asset, currency])
  // const getTimeseries = useCallback(async () => {
  //   getTimeseries(asset)
  // }, [asset])
  useEffect(() => {
    if (asset) {
      var day = new Date()
      day.setDate(day.getDate() - NUMBER_OF_DAYS)
      getTimeseries(currency, asset?.currency, day)
        .then((response) => {
          const backupRate = rateFor(asset?.currency)
          const cleanData = response.data.map(([date, rate]) => {
            if (!rate) return [date, backupRate]
            return [date, rate]
          })

          const curves = seriesMakerSingle(cleanData, asset)
          if (curves[0]?.data) setSeries(curves)
        })
        .catch((error) => {
          console.error("Error fetching data: ", error)
          setSeries([])
        })
    }
  }, [asset, asset?.currency])

  useEffect(() => {
    if (allAssets.constructor.name !== "Array") return
    const a = allAssets?.find((asset) => asset.item.id === parseInt(pageId))
    // console.log({ a })
    if (a) {
      setAsset(a.item)
      setId(a.itemId)
    }
  }, [allAssets, pageId])

  useEffect(() => {
    // console.log({ asset, institutions })
    if (asset)
      setInstitution(
        institutions?.find((i) => i.item.id === asset.institution)?.item,
      )
  }, [asset, institutions])

  const setNewAssets = (
    data,
    deleteDataPoint = false,
    categoryLiability = false,
  ) => {
    setShowToast(true)
    const newAsset = newAssetMaker(
      asset,
      data,
      deleteDataPoint,
      categoryLiability,
    )
    dbAction("update", "assets", newAsset, id)
  }

  const updateTransferAsset = (transferAsset, data) => {
    const newAsset = newAssetMaker(transferAsset, data)
    console.log({ tanewasset: newAsset })
    // dbAction("update", "assets", newAsset, id)
  }

  if (loading) return <Loading fullPage />
  if (error) return <Error />

  return (
    <div className="flex-center flex-col py-40 mt-10 lg:w-2/3 xl:w-1/2 md:mx-auto glassmorphic">
      <Head>
        <title>{asset?.name || "Asset"}</title>
      </Head>

      <div className="row flex items-center mt-10 mr-auto ml-2" id="bredcrumbs">
        <div
          className="flex-center flex-col justify-end cursor-pointer"
          onClick={() => router.push(`/category/${institution?.category}`)}
        >
          <FaUniversity className="text-2xl " />
          <small>{CATEGORIES[institution?.category]}</small>
        </div>
        <span className="mx-2"> {">"} </span>
        <div
          onClick={() => router.push(`/institution/${institution?.id}`)}
          style={institutionStyle(institution)}
          className="flex-center flex-col cursor-pointer p-2 rounded"
        >
          <FaPiggyBank className="text-2xl" />
          <small className="">{institution?.name}</small>
        </div>
      </div>

      <div className="flex justify-between items-center mt-10" id="title">
        <h3 className="pb-0 text-3xl pr-3">{`${asset?.name}`}</h3>

        <Link href={`/institution/${institution?.id}`} passHref>
          <div data-for={"edit"} data-tip>
            <FaCog className="text-gray-500 text-sm cursor-pointer" />
          </div>
        </Link>
        <ReactTooltip id={"edit"}>Edit {asset?.name}</ReactTooltip>
      </div>
      {asset?.currency !== currency ? (
        <div>{formattedMoney(rateFor(asset?.currency), currency)}</div>
      ) : (
        <></>
      )}
      <div className="flex justify-between items-center">
        <strong>{formattedMoney(asset?.holdings, asset?.currency)}</strong>
        {asset?.currency !== currency ? (
          <small className="pl-4">
            {formattedMoney(
              asset?.holdings * rateFor(asset?.currency) || 0,
              currency,
            )}
          </small>
        ) : (
          <></>
        )}
      </div>
      <div className="flex justify-between items-center mb-10">
        <small>{`${asset?.interest}% ${interestRateLanguage(
          institution?.category,
        )}`}</small>
        <div>
          {asset?.locked && (
            <FaLock className="inline pl-1 text-gray-400 text-sm" />
          )}
          {asset?.hidden && (
            <FaEyeSlash className="inline pl-1 text-gray-400" />
          )}
        </div>
      </div>

      <div className="w-full mx-48">
        <div className="flex justify-start">
          <button className="btn primary mx-2">30d</button>
          <button className="btn disabled cursor-disabled mx-2">7d</button>
        </div>
        {asset && <LoadedChart currency={currency} series={series} />}
      </div>

      {asset ? (
        <div className="flex flex-col w-full md:flex-row my-10 px-2">
          <div className="flex flex-col md:mr-2 w-full">
            <AmountInput
              assetProp={asset}
              institution={institution}
              setNewAssets={setNewAssets}
              updateTransferAsset={updateTransferAsset}
            />
          </div>

          <div className="flex flex-col w-full md:ml-2 items-start">
            {/* {asset?.dataPoints?.length > 0 ? (
              <div className="bg-gray-200">
                <Chart
                  data={data}
                  layout={{ width: "200px" }}
                  config={{ scrollZoom: true, displaylogo: false }}
                />
              </div>
            ) : null} */}
            <div className="flex items-center mt-2 flex-col w-full">
              <div className="flex-center">
                <h3>Previous holdings</h3>
                <span
                  className="ml-2"
                  onClick={() => setPreviousShown(!previousShown)}
                >
                  {previousShown ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </span>
              </div>
            </div>
            {previousShown ? (
              <HistoricalHoldings asset={asset} setNewAssets={setNewAssets} />
            ) : null}
          </div>
        </div>
      ) : null}
      <Toast
        text="Holdings updated"
        shown={showToast}
        setShown={setShowToast}
      />
    </div>
  )
}

Asset.propTypes = {}

export default Asset
