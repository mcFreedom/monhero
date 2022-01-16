import React from "react"
import { AssetPage } from "../../components"
import { useRouter } from "next/router"

export default function Home() {
  const router = useRouter()
  let { category } = router.query
  return <AssetPage categoryProp={category} />
}
