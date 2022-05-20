import { useState, useEffect, Fragment, useContext } from "react"
import { AssetCategory, IconForCategory } from "./"
import {
  useVisibility,
  StoreContext,
  assetMethods,
  moneyHelpers,
  constants,
  useTotalAmounts,
} from "../utils"
const { donutStatsMaker } = assetMethods
const { formattedMoney } = moneyHelpers
const { CATEGORIES } = constants
import Link from "next/link"
import { FaPlus } from "react-icons/fa"
import { useRouter } from "next/router"

export const AssetPage = ({ categoryProp, liabilities = false }) => {
  // TODO: FIX THIS . Needs to be an active actegory if not picked by router
  const [category, setCategory] = useState(categoryProp)
  const [theseAssets, setTheseAssets] = useState([])
  const [assetsFormatted, setAssetsFormatted] = useState([])

  const { totalDisplayed } = useVisibility()
  const { totalForAssets } = useTotalAmounts()

  const router = useRouter()

  const {
    state: { assets, institutions, currency, categories },
  } = useContext(StoreContext)

  useEffect(() => {
    if (assets && assets.length == 0) router.push("/new-asset")
    const a = liabilities ? assets.filter((a) => a.item.liability) : assets
    if (!categoryProp) {
      const firstcat = institutions.find(
        (i) => i.item.id === a[0]?.item?.institution,
      )
      if (firstcat) setCategory(firstcat?.item?.category)
    }
    setTheseAssets(a)
  }, [assets, categoryProp])

  useEffect(() => {
    if (!theseAssets) return
    const a = donutStatsMaker(
      categories,
      theseAssets,
      institutions,
      totalForAssets,
    )
    setAssetsFormatted(a)
  }, [theseAssets, categories])

  return (
    <div className="">
      <div className="overflow-x-auto flex snap-mandatory snap-x bg-gray-400 text-white justify-center w-full top-0 mt-0 ">
        {assetsFormatted.map((item, i) => {
          if (item.hidden) return <Fragment key={i}></Fragment>
          return (
            <div
              key={i}
              onClick={() => setCategory(item.name)}
              className={`${
                category === item.name ? "bg-gray-600" : ""
              } flex flex-col snap-center p-4 items-end cursor-pointer`}
            >
              <div className={`${category === item.name ? "font-bold" : ""}`}>
                <div className="flex items-center">
                  <IconForCategory
                    category={item.name}
                    className="text-xs mr-1"
                  />
                  {CATEGORIES[item.name]}
                </div>
              </div>
              <div className="text-sm">
                {!totalDisplayed
                  ? `****${currency}`
                  : formattedMoney(item.amount, currency)}
              </div>
            </div>
          )
        })}
      </div>
      {assetsFormatted?.length < 1 ? (
        <div className="flex-center flex-col h-full glassmorphic">
          {`No ${liabilities ? "Liabilities" : "Assets"}`}
          <Link href="/new-asset" passHref>
            <button className="btn small nav-bar my-2 md:my-1 h-10 md:h-initial flex-center">
              <FaPlus className="pr-1" />
              Add
            </button>
          </Link>
        </div>
      ) : (
        <AssetCategory category={category} assets={theseAssets} />
      )}
    </div>
  )
}
