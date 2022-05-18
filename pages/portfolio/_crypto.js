import { useContext, useState, useEffect } from "react"
import {
  StoreContext,
  constants,
  useTotalAmounts,
  assetMethods,
  helpers,
  moneyHelpers,
} from "../../utils"
import { Loading, ReturnBadge } from "../../components"
import Head from "next/head"
import { FaArrowLeft, FaLink, FaPlus } from "react-icons/fa"
import Link from "next/link"
const { assetsForCategory, assetsForInstitution } = assetMethods
const { institutionLanguage, institutionStyle } = helpers
const { formattedMoney } = moneyHelpers

import ReactTooltip from "react-tooltip"

const { CATEGORIES } = constants

const PortfolioCrypto = () => {
  const category = "crypto"
  const [total, setTotal] = useState("")
  const [relevantInstitutions, setRelevantInstitutions] = useState([])

  const {
    state: { assets, institutions },
    loading,
  } = useContext(StoreContext)

  const { totalForAssets } = useTotalAmounts()
  useEffect(() => {
    setTotal(totalForAssets(assetsForCategory(assets, institutions, category)))
  }, [assets, institutions])

  useEffect(() => {
    const i = institutions
      .filter((i) => i.item.category === category)
      .map((i) => i.item)
    setRelevantInstitutions(i)
  }, [institutions])

  if (loading) return <Loading fullPage />

  return (
    <div className="flex-center flex-col min-h-screen mt-10 md:mx-auto md:px-10">
      <Link href="/portfolio" passHref>
        <div>
          <FaArrowLeft className="cursor-pointer my-10" />
        </div>
      </Link>
      <Head>
        <title>{CATEGORIES[category] || "Portfolio"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>{`${CATEGORIES[category]} ${institutionLanguage(category)}`}</h1>
      <h3>{total}</h3>
      <div className="w-full mx-4 md:w-2/3 md:mx-20 flex justify-between flex-wrap lg:flex-nowrap">
        {relevantInstitutions?.map((institution) => {
          return (
            <div
              key={institution.name}
              className="border m-5 w-full flex items-center flex-col rounded"
              style={institutionStyle(institution)}
            >
              <h3 className="font-bold text-2xl mt-5">{institution.name}</h3>
              <div className="mt-5 w-full px-2">
                {assetsForInstitution(assets, institution).map((a, i) => {
                  const asset = a.item
                  {
                    /* console.log({ dp: asset.dataPoints }) */
                  }
                  {
                    /* const [totalReturn, ROI] = returnPercentage(
                    currentPrice,
                    purchasePrice,
                  ) */
                  }
                  return (
                    <div
                      key={i}
                      className="flex w-full justify-between rounded px-4"
                    >
                      <Link href={`/asset/${asset.id}`} passHref>
                        <div className="flex items-center cursor-pointer">
                          <a className="hover:underline">{asset.name}</a>
                          <FaLink className="md:hidden pl-1"></FaLink>
                        </div>
                      </Link>
                      <div>
                        {formattedMoney(asset.holdings, asset.currency)}
                      </div>
                      <div>
                        <ReturnBadge roi={0} />
                      </div>
                    </div>
                  )
                })}
                <div
                  className="flex w-full justify-center my-5 cursor-pointer p-5"
                  data-for={"new-asset"}
                  data-tip
                >
                  <FaPlus />
                </div>
              </div>
            </div>
          )
        })}
        <Link href="">
          <div
            className="border m-5 cursor-pointer w-full flex-center p-10 hover:underline"
            data-for={"new-institution"}
            data-tip
          >
            <FaPlus className="" />
          </div>
        </Link>
        <ReactTooltip id={"new-institution"}>
          Add a new institution
        </ReactTooltip>
        <ReactTooltip id={"new-asset"}>
          Add a new asset for this institution
        </ReactTooltip>
        {/* {thisCategory ? (
          <Category category={realEs?.item} id={thisCategory?.itemId} />
        ) : null} */}
      </div>
    </div>
  )
}

PortfolioCrypto.propTypes = {}

export default PortfolioCrypto
