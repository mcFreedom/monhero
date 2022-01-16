import React from "react"
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table"
import { SortingIcon } from "."

export const PortfolioHeader = ({ setSortBy, sortBy }) => {
  return (
    <Tr>
      <Th>
        <div
          onClick={() => setSortBy(sortBy === 1 ? -1 : 1)}
          className="w-full flex-center cursor-pointer hover:underline"
        >
          <SortingIcon sortBy={sortBy} thisId={1} type="alpha" />
          Category
        </div>
      </Th>
      <Th>
        <div
          onClick={() => setSortBy(sortBy === 2 ? -2 : 2)}
          className="w-full flex-center cursor-pointer hover:underline"
        >
          <SortingIcon sortBy={sortBy} thisId={2} />
          Split
        </div>
      </Th>
      <Th>
        <div
          onClick={() => setSortBy(sortBy === 3 ? -3 : 3)}
          className="w-full flex-center cursor-pointer hover:underline"
        >
          <SortingIcon sortBy={sortBy} thisId={3} />
          Amount
        </div>
      </Th>
      <Th>
        <div
          onClick={() => setSortBy(sortBy === 4 ? -4 : 4)}
          className="w-full flex-center cursor-pointer hover:underline"
        >
          <SortingIcon sortBy={sortBy} thisId={4} />
          Total Return
        </div>
      </Th>
      <Th>
        <div
          onClick={() => setSortBy(sortBy === 5 ? -5 : 5)}
          className="w-full flex-center cursor-pointer hover:underline"
        >
          <SortingIcon sortBy={sortBy} thisId={5} />
          Total return (%)
        </div>
      </Th>
      <Th className="hidden md:table-cell">Include in percentage bar?</Th>
    </Tr>
  )
}
