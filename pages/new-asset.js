import { useContext } from "react"

import Link from "next/link"
import Head from "next/head"

import { StoreContext, constants } from "../utils"
import { IconForCategory } from "../components"
const { CATEGORIES } = constants

const NewAsset = () => {
  const {
    state: { categories },
    // dbAction,
  } = useContext(StoreContext)

  return (
    <div className="flex-center flex-col min-h-screen pt-10 md:pt-40 w-full md:w-3/5 mx-auto">
      <Head>
        <title>New Asset</title>
      </Head>
      <h1>Add an asset</h1>
      <div className="flex space-betwen flex-wrap">
        {categories
          .filter((c) => c.item.enabled)
          .map((cat, index) => {
            const categoryName = cat.item.name
            return (
              <Link key={index} href={`/category/${categoryName}`}>
                <card className="w-2/5 bg-blue-100 m-4 p-10 link flex items-center">
                  <IconForCategory
                    category={categoryName}
                    className="mr-2 text-gray-800 text-lg"
                  />
                  <h3>{CATEGORIES[categoryName]}</h3>
                </card>
              </Link>
            )
          })}
      </div>

      <info>
        Looking for other assets? You can enable more categories in the
        <Link href="/settings">
          <a className="a white pl-1 font-bold">settings</a>
        </Link>
      </info>
    </div>
  )
}

export default NewAsset
