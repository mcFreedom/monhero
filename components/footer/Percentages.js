import { Fragment } from "react"
import PropTypes from "prop-types"
import ReactTooltip from "react-tooltip"
// import { FaCheck } from "react-icons/fa"

// import styles from "../styles/Percentages.module.css"

export const Percentages = ({ percentages = null }) => {
  return (
    <div className="rounded">
      <div className="row">
        <div className="flex rounded h-20">
          {!percentages ? (
            <div className="flex-center bg-grey-500 w-full border rounded">
              Add Assets
            </div>
          ) : (
            percentages.map((percentage, index) => {
              let rounding = ""
              if (index === 0) rounding = "rounded-l"
              if (index + 1 === percentages.length) rounding += " rounded-r"
              return (
                <Fragment key={`percentage${index}`}>
                  <div
                    className={rounding}
                    style={{
                      width: `${percentage.width}%`,
                      backgroundColor: percentage.colour,
                      ...theme,
                    }}
                    data-for={`percentage${percentage.name}`}
                    data-tip
                  >
                    {percentage.realPercentage > 0 ? (
                      <div className="p-4">
                        {`${percentage.name} ${percentage.width}%`}
                      </div>
                    ) : null}
                    {/* {percentage.locked ? (
                    <>
                      <div className="flex relative">
                        <div
                          className="rounded-r bg-white "
                          style={{
                            height: "15px",
                            width: `${percentage.locked}%`,
                          }}
                        />
                        <span
                          className={`text-xs text-gray-800 ${
                            percentage.locked > 20 ? "absolute" : ""
                          }`}
                        >
                          {`${percentage.locked}% 🔒`}
                        </span>
                      </div>

                      <div></div>
                    </>
                  ) : null} */}
                  </div>
                  <ReactTooltip id={`percentage${percentage.name}`}>
                    <div>{`${percentage.name} ${percentage.realPercentage}%`}</div>
                    {percentage.locked ? (
                      <small>{`${percentage.locked}% 🔒`}</small>
                    ) : null}
                  </ReactTooltip>
                </Fragment>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

const theme = {
  color: "white",
  fontWeight: 500,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}

Percentages.propTypes = {
  percentage: PropTypes.number,
  label: PropTypes.string,
  style: PropTypes.string,
  totalSteps: PropTypes.number,
  steps: PropTypes.number,
}
Percentages.defaultProps = {
  percentage: 0,
  label: "Percentages",
  style: "primary",
  steps: 0,
  totalSteps: 5,
}
