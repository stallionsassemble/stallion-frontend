"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      category: "FinTech",
      rating: 5,
      text: "The 3D configurator has received positive feedback from customers. Moreover, it has generated 30% more business and increased leadssignificantly, giving the client confidence for the future. Overall, Applab has led the project seamlessly. Customers can expect a responsible, well-organized partner.",
      avatar: "https://placehold.co/43x43",
      name: "Victor",
      role: "Product Designer",
    },
    {
      id: 2,
      category: "FinTech",
      rating: 5,
      text: "The 3D configurator has received positive feedback from customers. Moreover, it has generated 30% more business and increased leadssignificantly, giving the client confidence for the future. Overall, Applab has led the project seamlessly. Customers can expect a responsible, well-organized partner.",
      avatar: "https://placehold.co/43x43",
      name: "Sarah",
      role: "CTO @ DefiProtocol",
    },
    {
      id: 3,
      category: "DeFi",
      rating: 5,
      text: "The 3D configurator has received positive feedback from customers. Moreover, it has generated 30% more business and increased leadssignificantly, giving the client confidence for the future. Overall, Applab has led the project seamlessly. Customers can expect a responsible, well-organized partner.",
      avatar: "https://placehold.co/43x43",
      name: "David",
      role: "Founder",
    },
    {
      id: 4,
      category: "Web3",
      rating: 5,
      text: "The 3D configurator has received positive feedback from customers. Moreover, it has generated 30% more business and increased leadssignificantly, giving the client confidence for the future. Overall, Applab has led the project seamlessly. Customers can expect a responsible, well-organized partner.",
      avatar: "https://placehold.co/43x43",
      name: "Elena",
      role: "Product Lead",
    },
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, testimonials.length - 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  // Show 2 cards at a time
  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
  ];

  return (
    <section className="container mx-auto py-20 text-center">
      <div className="mb-12">
        <h2 className="text-[45px] md:text-[64px] font-bold font-syne text-white mb-2">Trusted by the Visionaries.</h2>
        <p className="text-white max-w-2xl font-inter font-normal text-[12px] md:text-[16px] text-center mx-auto tracking-[-0.32px] leading-[19.2px]">
          Stallion is the operating system of choice for high-signal builders. See why the top 1% of contributors have made the switch.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-12">
        {visibleTestimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={`flex-1 bg-transparent rounded-[32px] p-8 min-h-[300px] flex flex-col justify-between relative transition-all duration-300 hover:!border-[#007AFF] ${index === 1 ? 'hidden md:flex' : 'flex'}`}
            style={{
              border: "1.97px solid #E1E6EC1A",
            }}
          >
            <div>
              <div className="bg-[#007AFF] text-white font-manrope text-[15px] font-normal tracking-[-0.32px] leading-[19.2px] px-4 py-1.5 rounded-full w-fit mb-4">
                {testimonial.category}
              </div>
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#FF3B30] text-[#FF3B30]" />
                ))}
              </div>
              <p className="text-white font-manrope text-lg leading-relaxed text-left">
                {testimonial.text}
              </p>
            </div>

            <div className="flex flex-row items-center mt-8 gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                <img src={testimonial.avatar} alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col items-start text-left">
                <h2 className="text-white font-manrope text-[15px] font-normal tracking-[-0.32px] leading-[19.2px]">
                  {testimonial.name}
                </h2>
                <p className="text-white font-manrope text-[13px] font-normal tracking-[-0.32px] leading-[19.2px]">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        {/* Dots */}
        <div className="flex gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full transition-colors ${idx === currentIndex ? "bg-[#007AFF]" : "bg-white/20"
                }`}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="flex gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center justify-center rounded-full border w-[23.32px] h-[23.32px] md:w-[59.47px] md:h-[59.47px] bg-transparent p-0 shrink-0 transition-colors ${currentIndex === 0
              ? "border-[#B8CCE3] text-[#B8CCE3] cursor-not-allowed"
              : "border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF] hover:text-white"
              }`}
          >
            <ChevronLeft className="w-3 h-3 md:w-6 md:h-6" strokeWidth={2.5} />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === testimonials.length - 1}
            className={`flex items-center justify-center rounded-full border w-[23.32px] h-[23.32px] md:w-[59.47px] md:h-[59.47px] bg-transparent p-0 shrink-0 transition-colors ${currentIndex === testimonials.length - 1
              ? "border-[#B8CCE3] text-[#B8CCE3] cursor-not-allowed"
              : "border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF] hover:text-white"
              }`}
          >
            <ChevronRight className="w-3 h-3 md:w-6 md:h-6" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
