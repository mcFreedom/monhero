import { useContext, useEffect, useState, Fragment } from "react"
import { StoreContext, constants, helpers, assetMethods } from "../utils"
import { Row, EmptyRow, Header } from "./table"
import ReactTooltip from "react-tooltip"

import { FaArrowRight, FaCog, FaPlus, FaSpinner } from "react-icons/fa"
import Link from "next/link"
import styles from "../styles/Category.module.css"

import { useTotalAmounts, useRate } from "../utils/hooks"
const { institutionStyle } = helpers
const { assetsForCategory, assetsForInstitution } = assetMethods

export const Category = ({ category }) => {
  const { totalForAssets } = useTotalAmounts()
  const [currentInstitutions, setCurrentInstitutions] = useState([])

  const {
    state: { assets, institutions },
    // dbAction,
  } = useContext(StoreContext)
  const { loading } = useRate()
  useEffect(() => {
    if (institutions) setCurrentInstitutions(currentIntitutionsMaker(category))
  }, [institutions, assets])

  // const toggleActiveCategory = () => {
  //   let newCat = { ...category }
  //   newCat.percentage = !category.percentage
  //   dbAction("update", "categories", newCat, id)
  // }

  // TODO: cleanup ?
  const totalForInstitution = (institution) => {
    return totalForAssets(
      assetsForInstitution(assets, institution).map((a) => a.item),
    )
  }

  const totalForCategory = () =>
    totalForAssets(assetsForCategory(assets, institutions, category?.name))

  const currentIntitutionsMaker = (category) => {
    const currentInst = institutions.filter((institution) => {
      return institution.item.category === category.name
    })
    return currentInst
  }

  const leftColumn = (index, institution) => {
    if (index === 0)
      return (
        <div className="flex items-center">
          {institution.name}
          {institution.href && (
            <>
              <Link href={institution.href} target="_blank">
                <FaArrowRight
                  className="ml-2 cursor-pointer rounded text-lg"
                  style={institutionStyle(institution, true)}
                  data-for={`link${institution.name}`}
                  data-tip
                />
              </Link>
              <ReactTooltip id={`link${institution.name}`}>
                <span>{`Go to ${institution.href}`}</span>
              </ReactTooltip>
            </>
          )}
          <>
            <Link href={`/institution/${institution.id}`}>
              <FaPlus
                className="ml-2 cursor-pointer rounded text-lg p-1"
                style={institutionStyle(institution, true)}
                data-for="add-asset"
                data-tip
              />
            </Link>
            <ReactTooltip id="add-asset">
              <span>Add an asset</span>
            </ReactTooltip>
          </>
        </div>
      )
    if (index === 1)
      return loading ? (
        <FaSpinner className="fa-spin" />
      ) : (
        <div>{totalForInstitution(institution)}</div>
      )
    return null
  }

  return (
    <div className="border border-b-0 rounded my-5 w-full">
      <div className="flex justify-between items-center w-full">
        <h2>{constants.CATEGORIES[category?.name]}</h2>
        <div className="flex items-center">
          <Link title="Manage Category" href={`/category/${category?.name}`}>
            <div
              className="cursor-pointer"
              data-for={`editCat${category}`}
              data-tip
            >
              <FaCog className="mx-2 text-gray-500" />
            </div>
          </Link>
          <ReactTooltip id={`editCat${category?.name}`}>
            Edit {constants.CATEGORIES[category?.name]}
          </ReactTooltip>
        </div>
      </div>
      {currentInstitutions.length === 0 ? (
        <>
          <div className="flex-center flex-col w-full font-bold border-b">
            Nothing here yet
            <Link href={`/category/${category?.name}`}>
              <button className="btn mb-2">+ Add an institution</button>
            </Link>
          </div>
        </>
      ) : (
        <table className="h-10 w-full p-5 table-auto overflow-x-auto">
          <thead className={styles.thead}>
            <Header
              categoryProp={category?.name}
              totalForCategory={totalForCategory()}
            />
          </thead>
          <tbody>
            {currentInstitutions.map((dbInstitution) => {
              const { item: institution } = dbInstitution
              const instId = institution.id

              if (
                assets.filter((a) => a.item.institution === instId).length === 0
              ) {
                return (
                  <EmptyRow
                    institutionId={instId}
                    leftColumnStyle={institutionStyle(institution)}
                    key={`asset${instId}`}
                  >
                    {leftColumn(0, institution)}
                  </EmptyRow>
                )
              } else {
                return assetsForInstitution(assets, institution).map(
                  (asset, i) => {
                    return asset.item.holdings === 0 ? (
                      <Fragment key={`asset0${institution}${i}`} />
                    ) : (
                      <Row
                        asset={asset.item}
                        key={`asset${institution}${i}`}
                        leftColumnStyle={institutionStyle(institution)}
                        categoryProp={institution.category}
                      >
                        {leftColumn(i, institution)}
                      </Row>
                    )
                  },
                )
              }
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

Category.propTypes = {}
