"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Is my data safe and secure?",
    answer:
      "Track Your Income and Expenses: With our app, you can easily track your income and expenses, so you always know where your money is going.",
  },
  {
    question: "Can I sync my accounts from multiple banks?",
    answer:
      "Yes, we support syncing with thousands of financial institutions worldwide to keep all your accounts in one place.",
  },
  {
    question: "Is there a mobile app available?",
    answer:
      "Absolutely! Our mobile app is available for both iOS and Android devices, allowing you to manage your finances on the go.",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer:
      "Yes, you can cancel your subscription at any time without any hidden fees or penalties.",
  },
  {
    question: "Do you offer customer support?",
    answer:
      "We offer 24/7 customer support via chat and email to assist you with any questions or issues you may have.",
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
                    ? "bg-[#007AFF] text-white"
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
