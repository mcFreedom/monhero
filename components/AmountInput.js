import { useState, useEffect, useContext } from "react"
import { helpers, moneyHelpers, useRate } from "../utils"
import { StoreContext } from "../utils/Store"
import { CurrencyList, AssetList, Toast } from "../components"
import Datetime from "react-datetime"
import moment from "moment"
import "react-datetime/css/react-datetime.css"

const { holdingsLanguage } = helpers
const { isCrypto, formattedMoney, categoryIsLiability } = moneyHelpers

export const AmountInput = ({
  assetProp = {},
  setNewAssets = () => {},
  updateTransferAsset = () => {},
  institution = {},
}) => {
  const [asset, setAsset] = useState(assetProp)
  const [transferAsset, setTransferAsset] = useState(null)
  const [difference, setDifference] = useState(null)
  const [displayAmountError, setDisplayAmountError] = useState(false)
  const {
    state: { currency, assets, institutions },
  } = useContext(StoreContext)
  const [dataPoint, setDataPoint] = useState({ datetime: new Date() })
  const { rateFor } = useRate()

  useEffect(() => {
    // console.log({ assetProp })
    const defaultDataPoint = {
      holdings: assetProp.holdings,
      datetime: moment().format(),
      notes: "",
      deltaAmount: rateFor(asset.currency),
      deltaCurrency: currency,
    }
    setAsset(assetProp)
    setDataPoint(defaultDataPoint)
  }, [assetProp])

  const [assetList, setAssetList] = useState([])
  useEffect(() => {
    const aL = assets
      .filter((a) => a.item.id !== asset.id)
      .map((a) => {
        const inst = institutions.find((i) => a.item.institution === i.item.id)
        return { value: a.item, label: `${a.item.name} - ${inst?.item?.name}` }
      })
    setAssetList(aL)
  }, [assets, institutions])

  const handleTransfer = (tA) => {
    if (tA?.value) {
      const transferAsset = tA.value
      setTransferAsset(transferAsset)
      updateDataPoint({
        deltaCurrency: transferAsset.currency,
        deltaAmount: amountMaker(transferAsset.currency),
      })
    } else {
      updateDataPoint({
        deltaCurrency: currency,
        deltaAmount: amountMaker(),
      })
    }
  }

  const updateDataPointSingle = (value, property, number = false) => {
    const newPoint = { ...dataPoint }
    newPoint[property] = number ? parseFloat(value) : value
    setDataPoint(newPoint)
  }
  const updateDataPoint = (newObject) => {
    const newPoint = { ...dataPoint, ...newObject }
    setDataPoint(newPoint)
  }
  const updateDate = (value) => {
    const newPoint = { ...dataPoint }
    newPoint["datetime"] = value.format()
    // console.log({ value, newPoint })
    setDataPoint(newPoint)
  }

  const addDataPoint = () => {
    const data = { ...dataPoint, datetime: dataPoint.datetime }
    if (transferAsset) {
      const taDataPoints = {
        holdings: transferAsset.holdings + dataPoint.deltaAmount,
        datetime: dataPoint.datetime,
        notes: "",
        deltaAmount: -1 * difference,
        deltaCurrency: asset.currency,
        deltaMore: !dataPoint.deltaMore,
      }
      // console.log(taDataPoints)
      if (
        transferAsset.holdings < dataPoint.deltaAmount &&
        dataPoint.deltaMore
      ) {
        setDisplayAmountError(true)
        return
      }
      updateTransferAsset(transferAsset, taDataPoints)
    }
    setNewAssets(data, false, categoryIsLiability(institution.category))
  }
  const handleEnter = (keyCode) => {
    if (keyCode === 13) addDataPoint()
  }

  const more = (currentHoldings, newHoldings) => {
    if (currentHoldings > newHoldings) return true
    if (currentHoldings < newHoldings) return false
    return null
  }
  const amountMaker = (toOtherCurrency = null) => {
    const volume = Math.abs(difference)
    const currency = asset.currency
    // TODO: if(currency is Crypto) calculate through BTC and store BTC.
    // TODO, add datetime for fetching rate
    const rate = toOtherCurrency ? rateFor(toOtherCurrency) : rateFor(currency)
    return volume * rate
  }
  var validDate = (current) => {
    return current.isBefore(moment())
  }

  const handleDeltaCurrencyChange = (currency) => {
    updateDataPointSingle(currency?.value, "deltaCurrency")
  }
  const handleHoldingsChange = (stringNewHoldings) => {
    // console.log(more(parseFloat(newHoldings), asset.holdings))
    const newHoldings = parseFloat(stringNewHoldings)
    const newDifference = (newHoldings - asset.holdings).toFixed(7)
    setDifference(newDifference)
    updateDataPoint({
      holdings: newHoldings,
      deltaAmount: amountMaker(),
      deltaMore: more(parseFloat(newHoldings), asset.holdings),
    })
  }

  const displayMore = asset.holdings !== dataPoint.holdings
  return (
    <>
      <div className="flex items-center justify-between">
        <label htmlFor="name" className="font-semibold text-right w-1/2 pr-2">
          {`Current ${holdingsLanguage(institution?.category)}:`}
        </label>
        <div className="flex items-center my-0 w-1/2">
          <span>{asset.currency}</span>
          <div className=" ml-4 my-2">{asset.holdings}</div>
        </div>
      </div>
      <div className="flex items-center justify-between bg-blue-200 rounded mb-2">
        <label htmlFor="name" className="font-semibold text-right w-1/2 pr-2">
          {`New ${holdingsLanguage(institution?.category)}:`}
        </label>
        <div className="flex items-center my-0 w-1/2 ">
          <span>{asset.currency}</span>
          <input
            type="number"
            placeholder={rateFor(asset.currency)}
            step={isCrypto(asset.currency) ? "0.001" : "0.1"}
            name="holdings"
            className="input inline ml-2 rounded-xl my-2 w-3/4"
            value={dataPoint.holdings}
            onChange={(e) => handleHoldingsChange(e.target.value)}
            onKeyDown={(e) => handleEnter(e.keyCode)}
          />
        </div>
      </div>
      {
        <>
          <div
            className={`flex ton flex-col ${
              displayMore
                ? // TODO
                  "block max-h-initial"
                : "hidden max-h-0"
            } `}
          >
            <div className="flex-center flex-col bg-gray-400 p-5">
              {more(asset.holdings, dataPoint.holdings) ? (
                <div>{`${formattedMoney(
                  Math.abs(difference),
                  asset.currency,
                )} Going to`}</div>
              ) : (
                <div>{`${formattedMoney(
                  Math.abs(difference),
                  asset.currency,
                )} coming from`}</div>
              )}
              <div className="relative w-full">
                <AssetList
                  handleTransfer={handleTransfer}
                  options={assetList}
                  value={dataPoint?.deltaCurrency}
                  placeholder={
                    more(asset.holdings, dataPoint.holdings)
                      ? "Outgoing / Off app"
                      : "Income / New on app"
                  }
                />
              </div>

              <div className="mt-2">
                {`Amount ${difference > 0 ? "paid" : "gained"}`}
              </div>
              <div className="flex justify-start w-full items-center">
                <input
                  type="number"
                  placeholder={21.42}
                  step={isCrypto(dataPoint.currency) ? "0.001" : "0.1"}
                  name="deltaAmount"
                  className="input my-2 mr-2 rounded-xl p-2 w-24"
                  value={dataPoint.deltaAmount}
                  onChange={(e) =>
                    updateDataPointSingle(e.target.value, "deltaAmount", true)
                  }
                />
                <div className="w-full relative">
                  <CurrencyList
                    clearable
                    inputValueProp={dataPoint?.deltaCurrency}
                    initialCurrency={currency}
                    handleChange={handleDeltaCurrencyChange}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="date" className="font-semibold">
                Date
              </label>
              {/* <input type="datetime" name="datetime" className="input" /> */}
              {/* TODO: investigate react select  */}
              <div className="flex">
                <Datetime
                  className="input w-full p-0"
                  inputProps={{ style: { width: "100%", padding: "0.5em" } }}
                  locale="en-gb"
                  dateFormat="MMMM Do YYYY"
                  timeFormat="HH:mm"
                  onChange={updateDate}
                  isValidDate={validDate}
                  initialValue={dataPoint.datetime}
                />
              </div>
              <label htmlFor="notes" className="mt-2">
                <strong>Notes</strong>
                <small> - Optional</small>
              </label>

              <input
                type="text"
                placeholder={"This looked like a good use for my money"}
                name="notes"
                className="input w-full"
                value={dataPoint.notes}
                onChange={(e) => updateDataPointSingle(e.target.value, "notes")}
              />
            </div>
          </div>
          {displayAmountError && (
            <div className="bg-red-500">
              There aren&apos;t enough funds in the asset you&apos;re
              transferring from.
            </div>
          )}
          <Toast
            text="There aren't enough funds in the asset you're transferring from."
            shown={displayAmountError}
            setShown={setDisplayAmountError}
            error
          />
          <button
            type="submit"
            className={`btn ${!displayMore ? "disabled" : ""}`}
            onClick={() => addDataPoint()}
            disabled={!displayMore}
          >
            Add
          </button>
        </>
      }
    </>
  )
}

AmountInput.propTypes = {}
