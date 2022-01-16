import { useContext, useState, useEffect } from "react"
import {
  StoreContext,
  helpers,
  useRate,
  constants,
  moneyHelpers,
} from "../../utils"
import { AssetForm } from "../../components"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  FaCog,
  FaMagic,
  FaExchangeAlt,
  FaEyeSlash,
  FaLock,
  FaSpinner,
  FaUniversity,
} from "react-icons/fa"
const { CATEGORIES } = constants
import ReactTooltip from "react-tooltip"
import { Error } from "../../components"

const { capitalize, institutionStyle } = helpers
const { formattedMoney } = moneyHelpers

const Institution = () => {
  const router = useRouter()
  let { id: pageId } = router.query

  const [shown, setShown] = useState(false)
  const [add, setAdd] = useState(false)
  const [institution, setInstitution] = useState(null)
  const [assets, setAssets] = useState(null)
  const [asset, setAsset] = useState(null)
  const [id, setId] = useState(null)

  const {
    state: { institutions, assets: allAssets, currency },
    // dispatch,
    dbAction,
  } = useContext(StoreContext)
  const { rateFor, loading, error } = useRate()
  const newAssetId = () => {
    const sorted = [...allAssets].sort((a, b) => b.item.id - a.item.id)
    const newId =
      allAssets && allAssets.length > 0 ? sorted[0]["item"]["id"] + 1 : 1
    // console.log({ sorted, newId })
    return newId
  }

  const newAsset = (institution) => {
    return {
      id: newAssetId(),
      institution,
      name: "",
      currency,
      holdings: 0,
      interest: 0,
      locked: false,
      hidden: false,
      dataPoints: [],
    }
  }
  useEffect(() => {
    const inst = institutions?.find((inst) => inst.item.id === parseInt(pageId))
    if (inst) {
      setInstitution(inst.item)
      setAsset(newAsset(inst.item.id))
      console.log({ asset })
    }
  }, [institutions, pageId])

  useEffect(() => {
    if (allAssets.constructor.name !== "Array") return
    // DELETION for wrong things
    // allAssets.map((a) => {
    //   if (!a.item.currency) {
    //     console.log({ a })
    //     dbAction("delete", "assets", null, a.itemId)
    //   }
    // })
    const assets = allAssets?.filter(
      (asset) => asset.item.institution === parseInt(pageId),
    )
    setAssets(assets)
    if (assets?.length === 0) {
      setShown(true)
      setAdd(true)
    }
  }, [allAssets, pageId])

  const deleteAsset = (dbId) => {
    dbAction("delete", "assets", null, dbId)
    setShown(false)
    setId(null)
  }
  const addAsset = (asset, dbId) => {
    dbId
      ? dbAction("update", "assets", asset, dbId)
      : dbAction("add", "assets", asset)
    const newId = asset.id
    setShown(false)
    setId(null)
    if (!dbId) router.push(`/asset/${newId}`)
  }
  if (!institution) return <Error />

  return (
    <div className="flex-center flex-col min-h-screen mt-10 md:w-1/3 md:mx-auto">
      <Head>
        <title>{institution?.name || "Institution"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="row flex  mr-auto ml-2">
        <div
          className="flex-center flex-col justify-end cursor-pointer"
          onClick={() => router.push(`/category/${institution?.category}`)}
        >
          <FaUniversity className="text-2xl " />
          <small>{CATEGORIES[institution?.category]}</small>
        </div>
      </div>

      <div
        className="flex-center mb-5 rounded"
        style={institutionStyle(institution)}
      >
        <h1 className="rounded">
          {`${capitalize(institution?.name || "Institution")}`}
        </h1>
      </div>
      {/* <button className="btn disabled text-xs my-0" disabled>
        Connect via API
      </button> */}
      <FaMagic
        onClick={() => {}}
        className="text-gray-300 cursor-pointer text-xl"
        data-for={"api"}
        data-tip
      />
      <ReactTooltip id={"api"}>
        API<span className="notice -left-2">Coming soon</span>
      </ReactTooltip>
      <div className="my-5">
        {assets?.map((a, i) => {
          const { item: asset, itemId } = a
          return (
            <div className="flex justify-between items-center w-96" key={i}>
              <div
                className={`w-full p-3 my-2 mr-2 rounded flex-center justify-between ${
                  i % 2 === 0 ? "bg-gray-200" : "border"
                }`}
              >
                <div className="flex items-center">
                  {asset.name}
                  {asset.locked && (
                    <FaLock className="inline pl-1 text-gray-400 text-sm" />
                  )}
                  {asset.hidden && (
                    <FaEyeSlash className="inline pl-1 text-gray-400" />
                  )}
                </div>
                <div className="flex flex-col text-right" id="price">
                  {loading || error ? (
                    <FaSpinner className="fa-spin" />
                  ) : (
                    <>
                      <div>
                        {formattedMoney(
                          asset.holdings * rateFor(asset.currency),
                          currency,
                        )}
                      </div>
                      <div className="text-gray-600">
                        {formattedMoney(asset.holdings || 0, asset.currency)}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <FaCog
                  onClick={() => {
                    setAsset(asset)
                    setShown(true)
                    setAdd(false)
                    setId(itemId)
                  }}
                  className="text-gray-400 mr-2 cursor-pointer text-xl"
                  data-for={`edit${asset.id}`}
                  data-tip
                />
                <ReactTooltip id={`edit${asset.id}`}>
                  Edit {asset.name}
                </ReactTooltip>
                <div data-for={`asset${asset.id}`} data-tip>
                  <Link href={`/asset/${asset.id}`}>
                    <FaExchangeAlt className="text-gray-400 mr-2 cursor-pointer text-xl ml-2" />
                  </Link>
                </div>
                <ReactTooltip id={`asset${asset.id}`}>Holdings</ReactTooltip>
              </div>
            </div>
          )
        })}
      </div>

      {shown ? (
        <AssetForm
          assetProp={asset}
          add={add}
          submit={addAsset}
          deleteIt={deleteAsset}
          id={id}
          category={institution?.category}
        />
      ) : null}
      {shown && add ? null : (
        <button
          className="btn mb-5 mt-5"
          onClick={() => {
            setAsset(newAsset(institution.id))
            setShown(true)
            setAdd(true)
            setId(null)
          }}
        >
          + Add an asset
        </button>
      )}
    </div>
  )
}

Institution.propTypes = {}

export default Institution
