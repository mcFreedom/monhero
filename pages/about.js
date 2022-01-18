import Link from "next/link"

const About = () => {
  return (
    <div className="flex-center flex-col min-h-screen pt-10 md:pt-40 w-full md:w-3/5 mx-auto">
      <h1>The best asset management tool out there (we hope)</h1>
      <div className=" w-full text-justify p-10">
        <h3>Private</h3>
        <div className="pt-4">
          Our biggest nightmare would be to help any tax agency in prosecuting
          you or tracking your asset. The less they know, the happier we all
          feel right?
        </div>
        <div>
          Therefore, we developed the app to be incredibly private:
          <ul>
            <li>State of the art End-to-end encryption</li>
            <li>
              Your browser only queries our servers to request the latest rates
            </li>
            <li>
              Our servers never know how much of an asset you have, only that
              you are requesting a rate for it.
            </li>
            <li>
              As soon as you log out or are away for a while, the app locks and
              displays neutral data
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-gray-200  w-full text-justify p-10">
        <h3>Crypto First</h3>
        <div>
          A great cryptocurrency tracking tool, leaving no data about your
          assets to Coinmarketcap or any other service.
        </div>
      </div>
      <div className=" w-full text-justify p-10">
        <h3>Real estate</h3>
        <div>
          Helps track the value of your real estate across time when inflation
          and other costs are factored in.
        </div>
      </div>
      <div className="bg-gray-200  w-full text-justify p-10">
        <h3>Affordable</h3>
        <div>
          If it&apos;s free, you are the product right?... (Hello Facebook,
          Hello Google).{" "}
        </div>
        <div>
          No freebies here. The app is the product and we think you won&apos;t
          regret investing in it
        </div>
      </div>
      <div className=" w-full text-justify p-10">
        <h3>Spreadsheets</h3>
        <div>
          Are you using Microsoft Excel or Google Numbers at the moment?
        </div>
        {/* TODO: */}
        These softwares are often synced in the cloud, unencrypted. Furthermore,
        you have to configure those yourself and they do not show you the
        insights that a specialised tool such as ours can.
      </div>
      <div className="bg-gray-200 text-justify p-10">
        <h3>Family office</h3>
        <div>
          Whether you consult estate lawyers, have a family office company
          helping you, our tool will help you and your
        </div>
        <div>
          Run a company and want to buy bulk licenses?
          <Link href="/contact" passHref>
            <a className="pl-1 hover:underline text-blue-500">Contact us</a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About
