import { useContext, useState, useEffect } from "react"
import { StoreContext, assetMethods, helpers, moneyHelpers } from "../utils"
import { Loading, ReturnBadge } from "./"
import { FaLink, FaPlus } from "react-icons/fa"
import Link from "next/link"
const { assetsForInstitution } = assetMethods
const { institutionStyle, newAssetLanguage } = helpers
const { formattedMoney } = moneyHelpers
import { useTotalAmounts } from "../utils/hooks"

import ReactTooltip from "react-tooltip"

export const SimpleView = ({ category }) => {
  const [relevantInstitutions, setRelevantInstitutions] = useState([])
  const { totalForAssets } = useTotalAmounts()

  const {
    state: { assets, institutions },
    loading,
  } = useContext(StoreContext)

  useEffect(() => {
    const i = institutions
      .filter((i) => i.item.category === category)
      .map((i) => i.item)
    setRelevantInstitutions(i)
  }, [institutions, category])

  if (loading) return <Loading fullPage />

  return (
    <div className="glassmorphic mt-10 md:px-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relevantInstitutions?.map((institution) => {
          const theseAssets = assetsForInstitution(assets, institution).map(
            (a) => a.item,
          )
          return (
            <div
              key={institution.name}
              className="border w-full flex items-center flex-col rounded"
              style={institutionStyle(institution)}
            >
              <h3 className="font-bold text-2xl mt-5">{institution.name}</h3>
              <div className="mt-5 w-full px-2">
                {theseAssets.map((asset, i) => {
                  {
                    /* const [totalReturn, ROI] = returnPercentage(
                    currentPrice,
                    purchasePrice,
                  ) */
                  }
                  return (
                    <div
                      key={i}
                      className="flex w-full justify-between rounded px-4 py-1"
                    >
                      <Link href={`/asset/${asset.id}`} passHref>
                        <div className="flex items-center cursor-pointer">
                          <a className="hover:underline">{asset.name}</a>
                          <FaLink className="md:hidden pl-1"></FaLink>
                        </div>
                      </Link>
                      <div className="flex">
                        <div className="pr-1">
                          {formattedMoney(asset.holdings, asset.currency)}
                        </div>
                        <ReturnBadge roi={0} />
                      </div>
                    </div>
                  )
                })}

                <div className="text-center font-bold">
                  {totalForAssets(theseAssets)}
                </div>
                <Link href={`/category/${category}`} passHref>
                  <div
                    className="flex w-full justify-center my-5 cursor-pointer p-5 hover:bg-blend-darken"
                    data-for={"new-asset"}
                    data-tip
                  >
                    <FaPlus />
                  </div>
                </Link>
              </div>
            </div>
          )
        })}
        <ReactTooltip id={"new-asset"}>
          {newAssetLanguage(category)}
        </ReactTooltip>
        {/* {thisCategory ? (
          <Category category={realEs?.item} id={thisCategory?.itemId} />
        ) : null} */}
      </div>
    </div>
  )
}

SimpleView.propTypes = {}
