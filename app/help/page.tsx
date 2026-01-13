"use client";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, HelpCircle, Mail, MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "What is Stallion?",
        a: "Stallion is a platform connecting project owners with skilled contributors through bounties and projects. It facilitates collaboration, payment escrow, and reputation building."
      },
      {
        q: "How do I get started?",
        a: "Simply sign up as a Contributor or Project Owner. Complete your profile, and you can immediately start browsing bounties or posting your own projects."
      },
      {
        q: "Is it free to use?",
        a: "Yes, joining the platform is free. We charge a small service fee on successful bounty payments to maintain the platform and ensure security."
      }
    ]
  },
  {
    category: "For Contributors",
    questions: [
      {
        q: "How do I get paid?",
        a: "Payments are processed via USDC (Starknet). Once your submission is approved, funds held in escrow are automatically released to your wallet."
      },
      {
        q: "Can I work on multiple bounties?",
        a: "Yes, you can work on as many bounties as you can handle. However, we recommend focusing on quality submissions to build your reputation."
      }
    ]
  },
  {
    category: "For Project Owners",
    questions: [
      {
        q: "How does escrow work?",
        a: "When you create a bounty, the reward amount is locked in a secure smart contract. It is only released when you explicitly approve a submission."
      },
      {
        q: "What if I'm not satisfied with a submission?",
        a: "You can request revisions or reject the submission. If there is a dispute, you can raise a ticket for our support team to intervene."
      }
    ]
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/20">
      <Header />

      {/* Hero Section */}
      <div className="relative py-24 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <Badge className="mb-6 bg-white/10 text-white hover:bg-white/20 border-white/20 backdrop-blur-sm px-4 py-1.5 h-auto text-sm font-medium">
            <HelpCircle className="w-4 h-4 mr-2" />
            Support Center
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold font-syne mb-6 tracking-tight">
            How can we <span className="text-primary">help?</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light font-inter">
            Find answers, contact support, and learn how to make the most of Stallion.
          </p>

          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              className="h-14 pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-2xl focus-visible:ring-primary/50 text-base font-inter"
              placeholder="Search for answers (e.g. payments, profile, bounties)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-24">
        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <div className="group bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-primary/50 transition-all hover:bg-white/[0.07]">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-syne mb-3">Community Forum</h3>
            <p className="text-gray-400 mb-6 font-inter leading-relaxed">
              Join discussions, share ideas, and get help from the Stallion community.
            </p>
            <Link href="/dashboard/forums" className="inline-flex items-center text-primary font-medium hover:underline">
              Visit Forums <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="group bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-primary/50 transition-all hover:bg-white/[0.07]">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-syne mb-3">Email Support</h3>
            <p className="text-gray-400 mb-6 font-inter leading-relaxed">
              Need direct assistance? Our support team is ready to help you resolve any issues.
            </p>
            <a href="mailto:support@stallion.com" className="inline-flex items-center text-primary font-medium hover:underline">
              Contact Us <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto space-y-16">
          {filteredFaqs.length > 0 ? filteredFaqs.map((category, idx) => (
            <div key={idx} className="space-y-6">
              <h2 className="text-3xl font-bold font-syne">{category.category}</h2>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {category.questions.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${idx}-${index}`} className="border border-white/10 rounded-xl px-6 bg-white/5 data-[state=open]:border-primary/50 transition-colors">
                    <AccordionTrigger className="text-lg font-medium font-inter hover:no-underline py-6">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400 font-inter leading-relaxed pb-6 text-base">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>

        {/* Still Need Help */}
        <div className="mt-24 text-center">
          <h3 className="text-3xl font-bold font-syne mb-4">Still need help?</h3>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto font-inter">
            We're here to assist you with any questions or issues you may have regarding the platform.
          </p>
          <Button size="lg" className="bg-primary text-white hover:bg-primary/90 h-12 px-8 rounded-xl font-medium text-base">
            Contact Support
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
