import { Linkedin, Mail, Phone, Youtube } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export function Footer() {
  return (
    <footer className="container mx-auto py-6 text-center gap-4">
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="font-syne text-[45px] md:text-[64px] font-bold text-white tracking-[-1px]">Ready to Get Started?</h2>
        <p className="font-inter text-[11px] md:text-[16px] leading-[19.2px] font-normal text-white tracking-[-0.32px]">Join 1,247 builders earning in crypto on Stellar</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center mb-4">
        <Link href="/bounties">
          <Button
            size="lg"
            className="bg-blue hover:bg-blue/80 font-inter tracking-tighter font-regular text-[12px] md:text-lg w-[127.88px] md:w-[190px] h-[37.82px] md:h-[56px] rounded-[4.03px] md:rounded-[6px]  border-transparent border-[0.67px] md:border px-[32.94px] md:px-[49px] py-[9.41px] md:py-[14px] gap-[6.72px]"
          >
            Browse Bounties
          </Button>
        </Link>
        <Link href="/register">
          <Button
            size="lg"
            className="bg-[#27272A] hover:bg-[#27272A]/80 font-inter tracking-tighter font-regular text-[12px]  md:text-lg w-[115.88px] md:w-[190px] h-[37.82px] md:h-[56px] rounded-[4.03px] md:rounded-[6px] border-transparent border-[0.67px] md:border px-[32.94px] md:px-[49px] py-[9.41px] md:py-[14px] gap-[6.72px]"
          >
            Post a Bounty
          </Button>
        </Link>
      </div>

      <div className="p-5 flex flex-col md:flex-row gap-3 justify-center md:bg-transparent"
        style={{
          borderTop: "0.79px solid #FFFFFF1A",
          borderBottom: "0.79px solid #FFFFFF1A"
        }}>
        <div className="mx-auto md:mx-0">
          <p className="font-inter text-sm font-normal text-white tracking-[-0.32px] flex items-center justify-center gap-2 border border-[#71717A] rounded-[8px] w-[200px] h-[48px]">
            <Phone color="white" className="w-4 h-4" />
            <span className="font-bold">Call</span>
            <span className="text-[10px]">+1 (650) 420-2207</span>
          </p>
        </div>

        <div className="mx-auto md:mx-0">
          <p className="font-inter text-sm font-normal text-white tracking-[-0.32px] flex items-center justify-center gap-2 border border-[#71717A] rounded-[8px] w-[200px] h-[48px]">
            <Mail className="w-4 h-4" />
            <span className="font-bold">Mail Us</span>
            <span className="text-[10px]">info@earnstallion.com</span>
          </p>
        </div>
      </div>
      <div className="mt-16 pt-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="flex gap-6">
            <Link href="/terms" className="text-[#94969D] hover:text-white text-sm font-inter">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-[#94969D] hover:text-white text-sm font-inter">
              Privacy Policy
            </Link>
          </div>

          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg border text-[#94969D] hover:text-white hover:border-white transition-colors" style={{ borderWidth: "1.57px", borderColor: "#71717A" }}>
              {/* Discord SVG */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.772-.6083 1.1588a18.2915 18.2915 0 00-5.4868 0c-.1636-.3933-.4058-.7835-.617-1.1588a.0771.0771 0 00-.0785-.0371 19.718 19.718 0 00-4.8852 1.5152.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1569 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
              </svg>
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg border text-[#94969D] hover:text-white hover:border-white transition-colors" style={{ borderWidth: "1.57px", borderColor: "#71717A" }}>
              {/* X (Twitter) SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231h.001Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
              </svg>
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg border text-[#94969D] hover:text-white hover:border-white transition-colors" style={{ borderWidth: "1.57px", borderColor: "#71717A" }}>
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg border text-[#94969D] hover:text-white hover:border-white transition-colors" style={{ borderWidth: "1.57px", borderColor: "#71717A" }}>
              <Youtube className="w-5 h-5" />
            </a>
            <a href="mailto:info@earnstallion.com" className="w-10 h-10 flex items-center justify-center rounded-lg border text-[#94969D] hover:text-white hover:border-white transition-colors" style={{ borderWidth: "1.57px", borderColor: "#71717A" }}>
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[#A1A1AA] text-sm font-inter font-normal">
            Copyright © 2025 Stallion. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
