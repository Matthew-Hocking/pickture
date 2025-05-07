import Link from "next/link"
import { RegionDropdown } from "../ui";
import { getRegionFromCookie } from "@/app/lib/helpers/region";

const defaultRegion = process.env.DEFAULT_REGION ?? 'US';

const Footer = async () => {
  const region = await getRegionFromCookie()

  return (
    <footer className="bg-surface">
      <div className="container py-8 grid grid-cols-1 md:grid-cols-3 gap-8">

        <div>
          <h3 className="text-xl font-bold gradient-text mb-4">Pickture</h3>
          <p className="text-text-secondary">
            Take the drama out of movie night and put it where it belongs - on the screen!
          </p>
          <RegionDropdown initialRegion={region} />
        </div>

        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="text-text-secondary hover:text-brand">Home</Link></li>
            <li><Link href="/discover" className="text-text-secondary hover:text-brand">Discover</Link></li>
            <li><Link href="/about" className="text-text-secondary hover:text-brand">About</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <div className="space-y-2 text-text-secondary">
            <p>Email: support@pickture.com</p>
            <p>© {new Date().getFullYear()} Pickture. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;