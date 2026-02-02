import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare, faInstagramSquare, faYoutubeSquare, faSquareLinkedin } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#012523] text-white">
        {/*logo*/}
        <div className="absolute bottom-[5px] right-[5px] z-0">
            <div className="relative w-[350px] h-[350px] flex justify-center items-center overflow-hidden">
                <div className="absolute top-[-43px] left-[57px] h-[500px] w-[280px] bg-gradient-to-r from-[#012523] from-[88%] to-transparent rotate-[15deg] opacity-[.9]"></div>
                <Image src={'/images/icons/icn.png'}
                    alt=""
                    width={500}
                    height={500}
                    className="object-cover" />
            </div>
        </div>
      {/* Main Content */}
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 py-16 md:grid-cols-3">
        {/* Contact */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">Contact Us Directly</h4>
          <p className="mb-2 text-sm opacity-80">904/A, 5/C, Shagufta, Pallabi, Dhaka-1216.</p>
          <a href="block tel:008801707132919"
             className="text-sm opacity-80 hover:underline">
            01707-132919
          </a>
          <a
            href="mailto:info@alliance-exposition.com"
            className="block text-sm opacity-80 hover:underline"
          >
            info@alliance-exposition.com
          </a>
        </div>

        {/* Links */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">Quick Links</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/locations">Locations</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Exhibitor Tools */}
        <div>
          <h4 className="mb-4 text-sm font-semibold">Exhibitor Tools</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link href="/exhibitor-login">Exhibitor Login</Link></li>
            <li><Link href="/track-package">Track Your Order</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-white/10 p-6">
        <div className="mx-auto my-3 flex max-w-7xl flex-col gap-4 text-center">
            <div className="mx-auto my-3 text-lg font-bold">
                <Image src={'/images/logo/logo_1.png'}
                        alt=""
                        width={100}
                        height={100}
                        className="object-cover"/>
            </div>
            <div className="text-sm opacity-70">বাংলাদেশের সবচেয়ে বড় ও নির্ভরযোগ্য গার্ডেনিং ষ্টোর, এখানে সকল ধরনের ইনডোর, আউটডোর, সেমি ইনডোর গাছ পাওয়া যায়। সারা বাংলাদেশ হোম ডেলিভারি দেওয়া হয়।</div>
        </div>

        <div className="mx-auto my-3 flex flex-col justify-between items-center text-xs opacity-70
                        md:flex-row">
            <div className="my-3">
                <Link href="/privacy-policy"
                      className="m-1" >
                    Privacy Policy
                </Link>
                <Link href="/terms"
                      className="m-1" >
                    Terms & Conditions
                </Link>
            </div>
            <div className="flex justify-center items-center my-3">
                <FontAwesomeIcon icon={faFacebookSquare} className="w-[25px] h-[25px] text-white mx-1"/>
                <FontAwesomeIcon icon={faInstagramSquare} className="w-[25px] h-[25px] text-white mx-1"/>
                <FontAwesomeIcon icon={faYoutubeSquare} className="w-[25px] h-[25px] text-white mx-1"/>
                <FontAwesomeIcon icon={faSquareLinkedin} className="w-[25px] h-[25px] text-white mx-1"/>
            </div>
        </div>
        <h4 className="text-sm font-normal text-gray-300 text-center z-100">© 2024 Antorbon. All rights reserved</h4>
      </div>
    </footer>
  );
}
