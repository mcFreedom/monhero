import { useState, useEffect, useRef } from "react"
import { Alert } from "./"
import { FaQuestion, FaTrash } from "react-icons/fa"
import ReactTooltip from "react-tooltip"

export const InstitutionForm = ({
  institution = {},
  placeholder = "",
  add = false,
  submit = () => {},
  deleteIt = () => {},
  id = null,
}) => {
  useEffect(() => {
    setName(institution.name)
    setColor(institution.color)
    setBackgroundColor(institution.backgroundColor)
  }, [institution])
  const [showAlert, setShowAlert] = useState(false)
  const [name, setName] = useState(institution.name)
  const [color, setColor] = useState(institution.color)
  const [href, setHref] = useState(institution?.href)
  const [backgroundColor, setBackgroundColor] = useState(
    institution.backgroundColor,
  )

  const regEx = /^#(?:[0-9a-f]{3}){1,2}$/i

  const colorError = (value, field = "") => {
    const ref = field === "bg" ? errorBg : errorColor
    ref.current = !regEx.test(value)
  }
  const errorBg = useRef(!regEx.test(backgroundColor))
  const errorColor = useRef(!regEx.test(color))
  const disabledSubmit =
    errorBg.current || errorColor.current || name?.length < 1

  const finalInstitution = () => {
    return {
      ...institution,
      name,
      color,
      backgroundColor,
      href,
    }
  }

  const handleEnter = (keyCode) => {
    if (keyCode === 13) submit(finalInstitution(), id)
  }

  return (
    <>
      {showAlert ? (
        <Alert
          close={() => setShowAlert(false)}
          buttonTrigger={() => deleteIt(id)}
          buttonText="Yes"
          message="This will delete all associated assets. Are you sure?"
        />
      ) : null}
      <div className="w-full px-4">
        <div className="flex flex-col bg-white px-4">
          {!add ? (
            <h3>{`Edit ${institution?.name}`}</h3>
          ) : (
            <h3>New institution</h3>
          )}
          <label htmlFor="name" className="pt-2">
            Name
          </label>
          <input
            type="text"
            placeholder={placeholder}
            name="name"
            className="input mb-4"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => handleEnter(e.keyCode)}
          />
        </div>

        <div className="flex-center relative">
          <button
            type="submit"
            className={`btn ${disabledSubmit ? "disabled" : ""}`}
            disabled={disabledSubmit}
            onClick={() => submit(finalInstitution(), id)}
          >
            {add ? "Add" : "Edit"}
          </button>
          {add ? null : (
            <FaTrash
              onClick={() => setShowAlert(true)}
              className="text-red-400 mr-2 cursor-pointer absolute right-0 mt-2"
            />
          )}
        </div>

        <div className="optional">
          <div className="flex flex-col bg-white px-4 my-3">
            <div className="flex items-center">
              <label htmlFor="currency">Link</label>
              <FaQuestion
                className="text-sm text-gray-400"
                data-for={"link"}
                data-tip
              />
            </div>
            <ReactTooltip id={"link"}>
              Will create a link to institution from the crypto dashoard
            </ReactTooltip>
            <input
              type="text"
              placeholder="https://someInstitution.com"
              name="href"
              className="input"
              value={href}
              onChange={(e) => {
                setHref(e.target.value)
              }}
            />
          </div>

          <div className="py-5 flex flex-col bg-gray-200 px-4">
            <div className="flex items-center">
              <label htmlFor="platform" data-for={"bg-color"} data-tip>
                Background color (hex value)
              </label>
              <FaQuestion
                className="text-sm text-gray-400"
                data-for={"bg-colour"}
                data-tip
              />
            </div>
            <ReactTooltip id={"bg-colour"}>
              Put a hex colour and the institution will appear in a different
              colour throughout the app
            </ReactTooltip>
            <input
              type="text"
              name="backgroundColor"
              className="input"
              onChange={(e) => {
                setBackgroundColor(e.target.value)
                colorError(e.target.value, "bg")
              }}
              value={backgroundColor}
              placeholder="#00F"
              // required
            />
            {errorBg.current ? (
              <div className="text-sm text-red-400">Not a hex color</div>
            ) : null}

            <label htmlFor="currency">Text color (hex value)</label>
            <input
              type="text"
              placeholder="#FFF"
              name="color"
              className="input"
              value={color}
              onChange={(e) => {
                setColor(e.target.value)
                colorError(e.target.value)
              }}
            />
            {errorColor.current ? (
              <div className="text-sm text-red-400">Not a hex color</div>
            ) : null}
            <label className="text-sm text-gray-400">displayed as:</label>
            <div
              className="p-4 rounded border"
              style={{
                backgroundColor,
                color,
              }}
            >
              {name}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

InstitutionForm.propTypes = {}
