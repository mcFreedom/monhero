import {
  FaPiggyBank,
  FaBitcoin,
  FaUniversity,
  FaCalendarAlt,
  FaPaintBrush,
  FaRegMoneyBillAlt,
  FaHandHoldingUsd,
  FaHome,
  FaHouseDamage,
  FaBalanceScale,
} from "react-icons/fa"

export const IconForCategory = ({ category, className }) => {
  if (category === "crypto") return <FaBitcoin className={className} />
  if (category === "banks") return <FaPiggyBank className={className} />
  if (category === "pensions") return <FaHandHoldingUsd className={className} />
  if (category === "realEstate") return <FaHome className={className} />
  if (category === "mortgage") return <FaHouseDamage className={className} />
  if (category === "commodities")
    return <FaBalanceScale className={className} />
  if (category === "stocks") return <FaUniversity className={className} />
  if (category === "goods") return <FaPaintBrush className={className} />
  if (category === "loans") return <FaCalendarAlt className={className} />
  return <FaRegMoneyBillAlt className={className} />
}

IconForCategory.propTypes = {}
