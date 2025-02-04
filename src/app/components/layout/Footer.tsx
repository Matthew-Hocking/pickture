import Link from "next/link"

const Footer = () => {
  return (
    <footer className="bg-surface ">
      <div className="container py-8 grid grid-cols-1 md:grid-cols-3 gap-8">

        <div>
          <h3 className="text-xl font-bold gradient-text mb-4">Pickture</h3>
          <p className="text-text-secondary">
            Take the drama out of movie night and put it where it belongs - on the screen!
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <div className="space-y-2">
            <Link href="/" className="text-text-secondary hover:text-brand">Home</Link>
            <Link href="/discover" className="block text-text-secondary hover:text-brand">Discover</Link>
            <Link href="/about" className="block text-text-secondary hover:text-brand">About</Link>
          </div>
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