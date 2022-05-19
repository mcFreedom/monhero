import React, {
  createContext,
  useReducer,
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react"
import { UserbaseContext } from "../utils"
import { PropTypes } from "prop-types"
import { reducer } from "./Reducer"
import { constants } from "./constants"
import userbase from "userbase-js"

const { exampleState } = constants
const newState = {
  categories: exampleState["categories"],
  assets: [],
  institutions: [],
  currency: "GBP",
  country: "USA",
  inflation: true,
  totalDisplayed: true,
}

const states = {
  blank: newState,
  example: exampleState,
}

const saveToCookie = async (property, value) => {
  await localStorage.setItem(property, JSON.stringify(value))
}

export const StoreContext = createContext({})
function init() {
  return states["example"]
}

export const StoreProvider = ({
  children,
  // databases = null,
  // setDatabases = () => {},
  setShowModal = () => {},
}) => {
  const { user, databases } = useContext(UserbaseContext)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [state, dispatch] = useReducer(reducer, newState, init)

  const errorHandling = (err) => {
    setError(err.message)
    console.log({ err })
    setLoading(false)
    return
  }

  const dispatchFromUserbase = () => {
    setLoading(true)
    databases.map((db) => {
      userbase
        .openDatabase({
          databaseName: db.databaseName,
          changeHandler(payload) {
            const dbName = db.databaseName
            if (dbName === "categories") {
              dispatch({ type: "SET_CATEGORIES", payload })
            } else if (dbName === "assets")
              dispatch({ type: "SET_ASSETS", payload })
            else if (dbName === "institutions")
              dispatch({ type: "SET_INSTITUTIONS", payload })
          },
        })
        .then(() => {
          setLoading(false)
        })
        .catch((e) => errorHandling(e))
      // if categories
    })
  }

  const resetState = (stateName = "example") => {
    const newState = states[stateName]
    if (stateName !== "restore") saveToCookie("formerState", state)
    dispatch({ type: "LOAD_STATE", payload: newState })
  }

  const dbAction = (action, databaseName, item, itemId) => {
    if (!user) {
      console.log({ message: "No user", user })
      setError("You need to be logged in to do this.")
      setShowModal(true)
      return
    }
    if (action === "add") {
      userbase.insertItem({
        databaseName,
        item,
      })
    } else if (action === "delete") {
      console.log({ itemId })
      userbase.deleteItem({
        databaseName,
        itemId,
      })
    } else if (action === "update") {
      userbase.updateItem({
        databaseName,
        item,
        itemId,
      })
    }
    return undefined
  }

  useEffect(() => {
    if (user && databases) {
      dispatchFromUserbase()
    }
    if (!user) resetState()
  }, [user, databases])

  const value = useMemo(() => {
    return {
      state,
      dispatch,
      resetState,
      saveToCookie,
      dbAction,
      loading,
      error,
    }
  }, [state, user])

  return (
    <StoreContext.Provider value={{ ...value, user }}>
      {children}
    </StoreContext.Provider>
  )
}

StoreProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
