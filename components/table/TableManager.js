import { Fragment, useState, useEffect } from "react"

import { Table, Tbody } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"

import { PortfolioHeader, PortfolioRow, CryptoRow, CryptoHeader } from "./"

const sortCategory = (type) => {
  if (type === "portfolio")
    return {
      1: "name",
      2: "split",
      3: "amount",
      4: "return",
      5: "returnP",
    }
  if (type === "crypto")
    return {
      1: "institution",
      2: "asset",
      3: "price",
      4: "holdings",
      5: "24h",
      6: "7d",
      7: "1y",
      8: "apr",
    }
  return {
    1: "institution",
    2: "rate",
    3: "amount",
    4: "return",
    5: "returnP",
  }
}

export const TableManager = ({
  assets = [],
  passedFunction = () => {},
  category = "portfolio",
}) => {
  const [sortBy, setSortBy] = useState(1)

  useEffect(() => {
    sortCategories()
  }, [sortBy])

  const sortCategories = () => {
    // sorting
    const s = sortCategory()[Math.abs(sortBy)]
    const sorted = [...assets].sort((a, b) => {
      if (s === "name") return b[s] > a[s] ? -1 : 1
      return parseInt(b[s]) - parseInt(a[s])
    })

    if (sortBy < 0) return sorted.reverse()
    return sorted
  }

  const Header = () => {
    if (category === "portfolio")
      return <PortfolioHeader setSortBy={setSortBy} sortBy={sortBy} />
    if (category === "crypto") {
      return <CryptoHeader setSortBy={setSortBy} sortBy={sortBy} />
    }
    return <PortfolioHeader setSortBy={setSortBy} sortBy={sortBy} />
  }
  const Row = ({ i, item, category = "category" }) => {
    // TODO: different for real Estate etc ?
    if (category === "portfolio")
      return <PortfolioRow item={item} i={i} passedFunction={passedFunction} />
    // TODO: make passed function work in crypto
    if (category === "crypto")
      return <CryptoRow item={item} i={i} passedFunction={passedFunction} />
    return <PortfolioRow item={item} i={i} passedFunction={passedFunction} />
  }
  return (
    <Table key={sortBy}>
      <Header setSortBy={setSortBy} />
      <Tbody>
        {sortCategories().map((item, i) => {
          if (item.hidden) return <Fragment key={i}></Fragment>
          return (
            <Row key={item.id} i={item.id} item={item} category={category} />
          )
        })}
      </Tbody>
    </Table>
  )
}

TableManager.propTypes = {}
