import HeroCards from '@/components/landing/hero-cards'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className='container mx-auto py-10  justify-center items-center md:text-center text-foreground'>
      <h1 className='text-4xl text-nowrap md:text-8xl font-bold font-syne mb-4 text-foreground w-auto'>
        Build the Future,
        <br />
        <p className='text-primary'>Get Paid Instantly</p>
      </h1>

      <p className='text-[10px] md:text-xl text-muted-foreground font-normal font-inter mb-6 max-w-2xl mx-auto text-start md:text-center'>
        The decentralized bounty platform connecting builders with opportunities
        on Stellar. Create wallets, post bounties, and manage payments—all in
        one place.
      </p>

      <div className='flex justify-start md:justify-center gap-4'>
        <Link href='/bounties'>
          <Button
            size='lg'
            className='bg-primary hover:bg-primary/80 font-inter tracking-tighter font-regular text-[12px] md:text-lg w-[127.88px] md:w-[190px] h-[37.82px] md:h-[56px] rounded-[4.03px] md:rounded-[6px]  border-transparent border-[0.67px] md:border px-[32.94px] md:px-[49px] py-[9.41px] md:py-[14px] gap-[6.72px]'
          >
            Get Started
          </Button>
        </Link>
        <Link href='/register'>
          <Button
            size='lg'
            className='bg-secondary hover:bg-secondary/80 font-inter tracking-tighter font-regular text-[12px]  md:text-lg w-[127.88px] md:w-[190px] h-[37.82px] md:h-[56px] rounded-[4.03px] md:rounded-[6px] border-transparent border-[0.67px] md:border px-[32.94px] md:px-[49px] py-[9.41px] md:py-[14px] gap-[6.72px]'
          >
            Learn More
          </Button>
        </Link>
      </div>

      {/* Mobile Stats */}
      <div className='md:hidden flex justify-center items-center gap-[43px] mt-12 mb-8 text-center'>
        <div className='text-primary text-[21px] leading-[23px] font-bold font-space-grotesk'>
          30+
          <br />
          <span className='text-foreground text-nowrap text-[8px] leading-[17px] font-normal font-inter'>
            Full-time SWEs Hired
          </span>
        </div>
        <div className='text-primary text-[21px] leading-[23px] font-bold font-space-grotesk'>
          100%
          <br />
          <span className='text-foreground text-nowrap text-[8px] leading-[17px] font-normal font-inter'>
            1st Year Retention
          </span>
        </div>
        <div className='text-primary text-[21px] leading-[23px] font-bold font-space-grotesk'>
          100+
          <br />
          <span className='text-foreground text-nowrap text-[8px] leading-[17px] font-normal font-inter'>
            Happy Customers
          </span>
        </div>
      </div>

      <div className='hidden md:flex justify-center items-center mx-auto mt-20'>
        <HeroCards />
      </div>
    </section>
  )
}
