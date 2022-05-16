import ReactTooltip from "react-tooltip"
import { Fragment } from "react"
export const Liabilities = ({ liabilities }) => {
  return (
    <div className="flex rounded h-4 mt-1 s">
      {!liabilities ? (
        <></>
      ) : (
        liabilities.map((liability, index) => {
          let rounding = ""
          if (index === 0) rounding = "rounded-l"
          if (index + 1 === liabilities?.length) rounding += " rounded-r"
          return (
            <Fragment key={index}>
              <div
                className={rounding}
                style={{
                  width: `${liability.width}%`,
                  backgroundColor: liability.colour,
                  ...theme,
                }}
                data-for={`liability${liability.name}`}
                data-tip
              >
                {liability.realPercentage > 0 ? (
                  <div className="text-xs pl-1">
                    {`${liability.name} ${liability.realPercentage}%`}
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
              <ReactTooltip id={`liability${liability.name}`}>
                <div>{`${liability.name} ${liability.realPercentage}%`}</div>
                {liability.locked ? (
                  <small>{`${liability.locked}% 🔒`}</small>
                ) : null}
              </ReactTooltip>
            </Fragment>
          )
        })
      )}
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

Liabilities.propTypes = {}
