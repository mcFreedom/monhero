import styles from "../../styles/Category.module.css"
import Link from "next/link"

export const EmptyRow = ({ institutionId, children, leftColumnStyle }) => {
  let { tr, leftColumn } = styles
  let style = tr

  return (
    <tr className={style}>
      <td className={leftColumn} style={leftColumnStyle}>
        {children}
      </td>
      <td>
        <Link href={`/institution/${institutionId}`} passHref>
          <button className="btn m-3 p-2 text-sm">Add an asset</button>
        </Link>
      </td>
    </tr>
  )
}
