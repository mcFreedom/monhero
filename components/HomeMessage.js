import { useState, useContext } from "react"
import { StoreContext } from "../utils"

export const HomeMessage = () => {
  const {
    state: { name },
    dispatch,
  } = useContext(StoreContext)
  const [editName, setEditName] = useState(false)
  const toggleEditName = () => {
    setEditName((editName) => !editName)
  }

  const changeName = (name) => {
    dispatch({
      type: "SET_NAME",
      payload: name,
    })
  }

  return (
    <card>
      <div className="flex items-center">
        <span className="mr-1">Hi</span>
        <div>
          {editName ? (
            name + ", "
          ) : (
            <input
              type="text"
              placeholder="Name"
              className="input"
              onChange={(e) => changeName(e.target.value)}
              onKeyPress={(e) => {
                // TODO: on submit
                // console.log(e.keyCode)
                if (e.key === 13) changeName(e.target.value)
              }}
            />
          )}
        </div>
        <small className="mr-1" onClick={toggleEditName}>
          {editName ? "edit" : "done"}{" "}
        </small>
        <div>you rock. Just out here trying to help you manage money.</div>
      </div>
      <small>
        All your data remains on your computer. Paying only gives you the option
        to see the future 🔮
      </small>
    </card>
  )
}

HomeMessage.propTypes = {}
