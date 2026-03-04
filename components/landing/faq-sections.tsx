"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How does Stallion differ from traditional job or bounty boards?",
    answer: (
      <div className="space-y-2 text-left">
        <p><strong>For Contributors:</strong> You aren't just "hunting"; you're building a verified career. Every task you complete creates an immutable, on-chain record of your skills.</p>
        <p><strong>For Companies:</strong> We eliminate the "resume noise." Stallion is a decentralized vetting pipeline that ensures you only see work from qualified professionals, reducing your overhead for talent discovery.</p>
      </div>
    ),
  },
  {
    question: "How do payments and settlements work on the platform?",
    answer: (
      <div className="space-y-2 text-left">
        <p><strong>For Contributors:</strong> No more chasing invoices. Once your submission is verified, smart contracts on the Stellar blockchain route funds directly to your wallet instantly.</p>
        <p><strong>For Companies:</strong> You gain full transparency. Funds are held securely and released only when milestones are met, ensuring your budget is always tied to high-quality results.</p>
      </div>
    ),
  },
  {
    question: 'What is an "On-Chain CV," and why do I need one?',
    answer: (
      <div className="space-y-2 text-left">
        <p><strong>For Contributors:</strong> It is your permanent proof of expertise. Unlike a PDF, your Stallion profile is verified by the blockchain, making your skills undeniable to future high-profile partners.</p>
        <p><strong>For Companies:</strong> It provides a trust-layer. You can view a contributor's actual history of successful deliveries on-chain before you even hire them, significantly lowering the risk of bad actors.</p>
      </div>
    ),
  },
  {
    question: "How do you ensure the quality of bounties and submissions?",
    answer: (
      <div className="space-y-2 text-left">
        <p><strong>For Contributors:</strong> We filter out the spam. Stallion only hosts high-impact quests from visionary communities and verified projects, ensuring your time is spent on work that matters.</p>
        <p><strong>For Companies:</strong> Our decentralized vetting pipeline is designed to "strip away the noise." By using intent-based execution and specific vetting criteria, we ensure that only top-tier solutions reach your desk.</p>
      </div>
    ),
  },
  {
    question: "Is Stallion limited to the Stellar ecosystem?",
    answer: (
      <div className="space-y-2 text-left">
        <p><strong>The Big Picture:</strong> While we are currently optimized for the Stellar network to provide the fastest, low-cost settlements, our roadmap includes cross-chain support.</p>
      </div>
    ),
  },
];

export function FAQSections() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="container mx-auto py-20 px-4 md:px-0" id="faqs">
      <div className="text-center mb-16">
        <h2 className="text-[45px] md:text-[64px] font-bold font-syne text-white mb-2 tracking-[-1px]">
          Frequently Asked Questions.
        </h2>
        <p className="text-[12px] md:text-[16px] leading-[19.2px] font-normal font-inter text-white tracking-[-0.32px] max-w-2xl mx-auto">
          We Get It—Curiosity Leads to Success! Got questions? That’s a great
          sign. Here are some.
        </p>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            onClick={() => toggleFAQ(index)}
            className={`cursor-pointer rounded-[20px] transition-all duration-300 overflow-hidden ${openIndex === index ? "bg-black" : "bg-black"
              }`}
            style={{
              border: '1px solid #007AFF4A',
              boxShadow: '0px 4px 4px 0px #007AFF21',
            }}
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center gap-4">
                <h3 className="text-white font-medium text-lg md:text-xl font-inter text-left">
                  {faq.question}
                </h3>
                <button
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === index
                    ? "bg-primary text-white"
                    : "bg-[#27272A] text-white"
                    }`}
                >
                  {openIndex === index ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${openIndex === index ? "grid-rows-[1fr] mt-6 pt-6 border-t border-[#007AFF4A]" : "grid-rows-[0fr]"
                  }`}
              >
                <div className="overflow-hidden">
                  <p className="text-[#94969D] font-inter text-sm md:text-base leading-relaxed text-left">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
