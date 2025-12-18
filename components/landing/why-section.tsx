import React from "react";
import { Button } from "../ui/button";

export function WhySection() {
  const features = [
    {
      icon: "/assets/icons/discovery.png",
      title: "Discovery",
      description: "We strip away the spam. Access a filtered stream of high-value quests from visionary communities. Don't waste time scrolling."
    },
    {
      icon: "/assets/icons/dollar.png",
      title: "Instant settlement.",
      description: "Frictionless payouts. Smart contracts route funds to your wallet the second your work is verified. No invoices, no chasing."
    },
    {
      icon: "/assets/icons/verifiable.png",
      title: "Verifiable reputation.",
      description: "Stop updating PDFs. Your completed bounties automatically generate an on-chain CV that proves your skill to future clients."
    }
  ];

  return (
    <section className="container mx-auto py-10 md:py-10 justify-center gap-1.5" id="why-us">
      <div className="text-center">
        <h2 className="text-[45px] md:text-[64px] font-bold font-syne leading-[100%] mb-4 text-foreground tracking-[-1.4px]">Designed for High Impact.</h2>
        <p className="text-[12px] sm:text-[16px] leading-[19.2px] font-normal font-inter mb-16 text-muted-foreground tracking-[-0.32px] align-middle">
          Why Settle for Less? Before you dive in, let’s show you why our platform is the future of bounty hunting.
        </p>
      </div>


      <div className="flex flex-col md:flex-row items-stretch justify-center relative">
        {/* Custom Outer Borders */}
        <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(to_right,hsl(var(--border))_50%,transparent_50%)] bg-size-[20px_1px] bg-repeat-x" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[linear-gradient(to_right,hsl(var(--border))_50%,transparent_50%)] bg-size-[20px_1px] bg-repeat-x" />
        <div className="absolute top-0 bottom-0 left-0 w-px bg-[linear-gradient(to_bottom,hsl(var(--border))_50%,transparent_50%)] bg-size-[1px_20px] bg-repeat-y" />
        <div className="absolute top-0 bottom-0 right-0 w-px bg-[linear-gradient(to_bottom,hsl(var(--border))_50%,transparent_50%)] bg-size-[1px_20px] bg-repeat-y" />

        {features.map((feature, index) => (
          <React.Fragment key={index}>
            <div className="flex-1 flex flex-col gap-4 text-center items-center p-8">
              <div className="w-[66px] h-[66px]">
                <img src={feature.icon} alt={feature.title} className="w-full h-full" />
              </div>
              <h3 className="text-[19px] font-medium font-inter leading-[26.6px] tracking-[-0.57px] text-center text-foreground align-middle">{feature.title}</h3>
              <p className="text-muted-foreground font-regular leading-[22.4px] text-[12px] font-inter tracking-[-0.32px]">{feature.description}</p>
            </div>

            {index < features.length - 1 && (
              <>
                <div className="hidden md:block w-px self-stretch bg-[linear-gradient(to_bottom,hsl(var(--border))_50%,transparent_50%)] bg-size-[1px_20px] bg-repeat-y" />
                <div className="md:hidden h-px w-full bg-[linear-gradient(to_right,hsl(var(--border))_50%,transparent_50%)] bg-size-[20px_1px] bg-repeat-x" />
              </>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <Button
          className="text-center bg-secondary hover:bg-secondary/80 text-secondary-foreground w-[178px] h-[59px] gap-[10px] rounded-[118px] p-[20px] opacity-100"
          style={{
            boxShadow:
              "0px 45px 63px -1px #0000001B, 0px 22.77px 31.88px -0.86px #00000011, 0px 12.43px 17.41px -0.71px #0000000C, 0px 7.14px 10px -0.57px #0000000A, 0px 4.09px 5.73px -0.43px #00000008, 0px 2.16px 3.02px -0.29px #00000008, 0px 0.88px 1.23px -0.14px #00000007",
          }}
        >
          Get Started
        </Button>
      </div>
    </section>
  );
}