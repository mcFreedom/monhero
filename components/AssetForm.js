import { useState, useEffect } from "react"
import { helpers } from "../utils"
import { Alert, CurrencyList } from "../components"
import { FaEyeSlash, FaKey, FaLock, FaQuestion, FaTrash } from "react-icons/fa"
import { GiSpy } from "react-icons/gi"
import ReactTooltip from "react-tooltip"

const { assetPlaceholders } = helpers

export const AssetForm = ({
  assetProp = {},
  add = false,
  submit = () => {},
  deleteIt = () => {},
  category = null,
  id = null,
}) => {
  const [showAlert, setShowAlert] = useState(false)
  const [asset, setAsset] = useState(assetProp)
  const [disabledSubmit, setDisabledSummit] = useState(true)
  const placeholders = assetPlaceholders()[category]

  useEffect(() => {
    setAsset(assetProp)
  }, [assetProp])

  const fieldChange = (prop, value) => {
    const newAsset = { ...asset }
    newAsset[prop] = value
    setAsset(newAsset)
    setDisabledSummit(
      asset.name?.length === 0 || !newAsset.currency || !newAsset.institution,
    )
  }
  const handleCurrencyChange = (newCurrency, actionMeta) => {
    if (["select-option", "clear"].includes(actionMeta.action))
      fieldChange("currency", newCurrency?.value)
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
      <div className="flex flex-col">
        {!add ? <h3>{`Edit ${asset?.name}`}</h3> : <h3>New asset</h3>}
        <form
          onSubmit={(values) => submit(values)}
          values={asset}
          className="flex flex-col"
        >
          <label htmlFor="name" className="required">
            Name
          </label>
          <input
            type="text"
            placeholder={placeholders[0]}
            name="name"
            className="input"
            value={asset.name}
            onChange={(e) => {
              fieldChange("name", e.target.value)
            }}
          />
          <label htmlFor="platform" className="required">
            Currency
          </label>
          {category === "stocks" ? (
            <small className="my-1 text-gray-500">
              We&apos;re working on importing stocks and funds. WIP!
            </small>
          ) : null}
          {/* TODO: add asyncselect (search as you type)  */}
          <CurrencyList clearable handleChange={handleCurrencyChange} />
          <label className="mt-1 flex items-center" htmlFor="roi">
            {placeholders[1]} (in %)
            <FaQuestion
              className="text-sm text-gray-400"
              data-for={"interest"}
              data-tip
            />
          </label>
          {placeholders[2] ? (
            <ReactTooltip id={"interest"}>{placeholders[2]}</ReactTooltip>
          ) : null}
          <input
            placeholder="0.0%"
            name="interest"
            type="number"
            step="0.01"
            className="input"
            value={asset.interest}
            onChange={(e) => fieldChange("interest", e.target.value)}
          />

          <div className="flex items-center py-2 ">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hidden"
                name="hidden"
                value={asset.hidden}
                onChange={(e) => fieldChange("hidden", e.target.checked)}
              />
              <label htmlFor="hidden" className="ml-2 flex items-center">
                <FaEyeSlash className="mx-2 text-gray-600" />
                <span>Hidden</span>
                <FaQuestion
                  className="text-sm text-gray-400"
                  data-for={"hidden"}
                  data-tip
                />
              </label>
            </div>
            <ReactTooltip id={"hidden"}>
              Hides this asset in your dashboard
            </ReactTooltip>
          </div>
          <div className="flex items-center py-2 ">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="locked"
                name="locked"
                value={asset.locked}
                onChange={(e) => fieldChange("locked", e.target.checked)}
              />
              <label htmlFor="locked" className="ml-2 flex items-center">
                <FaLock className="mx-2 text-gray-600" />
                <span>Iliquid</span>
                <FaQuestion
                  className="text-sm text-gray-400"
                  data-for={"locked"}
                  data-tip
                />
              </label>
            </div>

            <ReactTooltip id={"locked"}>
              Tick if this asset is illiquid (Can&apos;t sell it soon if the
              need arises)
            </ReactTooltip>
          </div>
          <div className="flex items-center py-2 ">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="private"
                name="private"
                value={asset.private}
                onChange={(e) => fieldChange("private", e.target.checked)}
              />
              <label htmlFor="private" className="ml-2 flex items-center">
                <GiSpy className="mx-2 text-gray-600" />
                <span>Private</span>
              </label>
            </div>
            <FaQuestion
              className="text-sm text-gray-400"
              data-for={"private"}
              data-tip
            />
            <ReactTooltip id={"private"}>
              Tick if this asset can&apos;t be tracked by governments (no KYC /
              coin tracking / tax declaration etc.)
            </ReactTooltip>
          </div>
          <div className="flex items-center py-2 ">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="keys"
                name="keys"
                value={asset.keys}
                onChange={(e) => fieldChange("keys", e.target.checked)}
              />
              <label htmlFor="keys" className="ml-2 flex items-center">
                <FaKey className="mx-2 text-gray-600" />
                <span>Full ownership</span>
                <FaQuestion
                  className="text-sm text-gray-400"
                  data-for={"keys"}
                  data-tip
                />
              </label>
            </div>
            <ReactTooltip id={"keys"}>
              Tick if you own the private keys to these coins / have access to
              this with no intermediary (e.g. own safe).
            </ReactTooltip>
          </div>

          <div className="flex-center relative">
            <button
              className={`btn ${disabledSubmit ? "disabled" : ""}`}
              disabled={disabledSubmit}
              onClick={() => submit(asset, id)}
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
        </form>
      </div>
    </>
  )
}

AssetForm.propTypes = {}
