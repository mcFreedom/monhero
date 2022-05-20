import { useContext, useState, useEffect } from "react"
import { StoreContext, constants, helpers } from "../../utils"
import { InstitutionForm, Loading } from "../../components"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { FaCog, FaArrowRight, FaInfo } from "react-icons/fa"
import ReactTooltip from "react-tooltip"
const { institutionLanguage, institutionLanguageInfo } = helpers

const { CATEGORIES, INSTITUTIONS_PLACEHOLDER } = constants

const Category = () => {
  const router = useRouter()
  let { category } = router.query
  const [institution, setInstitution] = useState(null)
  const [shown, setShown] = useState(false) // show form
  const [add, setAdd] = useState(true) // adding or editing mode
  const [id, setId] = useState(null) // db Id
  const [showInfo, setShowInfo] = useState(false) // db Id

  const {
    state: { institutions },
    loading,
    // dispatch,
    dbAction,
  } = useContext(StoreContext)

  const newInstitutionId = () => {
    return institutions && institutions?.length > 0
      ? [...institutions].sort((a, b) => b.item.id - a.item.id)[0]["item"][
          "id"
        ] + 1
      : 1
  }

  const newInstitution = {
    id: newInstitutionId(),
    category,
    name: "",
    backgroundColor: "#00F",
    color: "#FFF",
  }
  const categoryInstitution = (institutions = null) => {
    return institutions
      ? institutions.filter(
          (institution) => institution.item.category === category,
        )
      : []
  }

  useEffect(() => {
    setInstitution(newInstitution)
    if (institutions && categoryInstitution(institutions)?.length < 1) {
      setShowInfo(true)
      setShown(true)
    }
  }, [institutions])

  const deleteInstitution = (dbId) => {
    dbAction("delete", "institutions", null, dbId)
    resetState()
  }
  const addInstitution = (institution, dbId = null) => {
    console.log({ dbId, institution })
    dbId
      ? dbAction("update", "institutions", institution, dbId)
      : dbAction("add", "institutions", institution)
    const newId = institution.id
    resetState()
    if (!dbId) router.push(`/institution/${newId}`)
    // let otherInstitutions = institutions.filter((i) => i.id !== institution.id)
    // otherInstitutions.push(institution)
    // sendIt(otherInstitutions)
  }
  const resetState = () => {
    setShown(false)
    setAdd(true)
    setId(null)
  }

  // console.log({ categoryInstitution, newInstitution })
  if (loading) return <Loading fullPage />

  const title = `${CATEGORIES[category]} ${institutionLanguage(category)}`

  return (
    <div className="flex-center flex-col min-h-screen mt-10 md:w-1/3 md:mx-auto">
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <FaInfo
        className="text-gray-400 mb-5"
        onClick={() => setShowInfo(!showInfo)}
      />
      {showInfo && (
        <div className="info">{institutionLanguageInfo(category)}</div>
      )}
      <div className="my-5">
        {categoryInstitution(institutions).map((currentInst, i) => {
          const { item: institution, itemId } = currentInst
          return (
            <div className="flex justify-between items-center" key={i}>
              <div
                style={{
                  backgroundColor: institution.backgroundColor,
                  color: institution.color,
                }}
                className="w-full p-3 my-2 mr-2 rounded"
              >
                {institution.name}
              </div>
              <div className="flex items-center">
                <FaCog
                  onClick={() => {
                    setInstitution(institution)
                    setShown(true)
                    setAdd(false)
                    setId(itemId)
                  }}
                  className="text-gray-400 mr-2 cursor-pointer text-xl"
                  data-for={`percentage${i}`}
                  data-tip
                />
                <ReactTooltip id={`percentage${i}`}>Edit</ReactTooltip>
                {/* <button className="btn disabled text-xs my-0 relative" disabled>
                  Connect via API
                  <div className="notice top-8 -left-2">Coming soon</div>
                </button> */}
                {/* <FaMagic
                  onClick={() => {}}
                  className="text-gray-300 cursor-pointer text-xl"
                  data-for={`api${i}`}
                  data-tip
                />
                <ReactTooltip id={`api${i}`}>
                  API<span className="notice -left-2">Coming soon</span>
                </ReactTooltip> */}
                <Link href={`/institution/${institution.id}`} passHref>
                  <div>
                    <FaArrowRight
                      className="text-gray-400 mr-2 cursor-pointer text-xl ml-2"
                      data-for={`assets${i}`}
                      data-tip
                    />
                  </div>
                </Link>
                <ReactTooltip
                  id={`assets${i}`}
                >{`${institution.name} assets`}</ReactTooltip>
              </div>
            </div>
          )
        })}
      </div>

      {shown ? (
        <InstitutionForm
          add={add}
          institution={institution}
          placeholder={INSTITUTIONS_PLACEHOLDER[category]}
          submit={addInstitution}
          deleteIt={deleteInstitution}
          id={id}
        />
      ) : null}
      {shown && add ? null : (
        <button
          className="btn mt-5"
          onClick={() => {
            setInstitution(newInstitution)
            setShown(true)
            setAdd(true)
            setId(null)
          }}
        >
          + Add an institution
        </button>
      )}
    </div>
  )
}

Category.propTypes = {}

export default Category
