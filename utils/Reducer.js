import { produce } from "immer"
import { Actions } from "./"

const saveState = async (state) => {
  const { institutions, assets, ...rest } = state
  await localStorage.setItem("state", JSON.stringify(rest))
}

export const reducer = (state, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case "SET_ASSETS": {
        draft.assets = action.payload
        saveState(draft)
        break
      }
      case "SET_CATEGORIES": {
        draft.categories = action.payload
        saveState(draft)
        break
      }
      case "SET_INSTITUTIONS": {
        draft.institutions = action.payload
        saveState(draft)
        break
      }

      case Actions.LOAD_STATE: {
        Object.entries(action.payload).map(([key, value]) => {
          draft[key] = value
        })
        saveState(draft)
        break
      }
      case Actions.SET_WHOLE_STATE: {
        draft = action.payload
        saveState(draft)
        break
      }

      case Actions.SET_NAME: {
        draft.name = action.payload
        saveState(draft)
        break
      }
      case Actions.SET_CURRENCY: {
        draft.currency = action.payload
        saveState(draft)
        break
      }
      case Actions.SET_INFLATION: {
        draft.inflation = action.payload
        saveState(draft)
        break
      }
      case Actions.SET_COUNTRY: {
        draft.country = action.payload
        saveState(draft)
        break
      }
      case Actions.SET_TOTAL: {
        draft.totalDisplayed = action.payload
        saveState(draft)
        break
      }

      default:
        break
    }
  })
