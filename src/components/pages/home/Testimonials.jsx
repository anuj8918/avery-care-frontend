import React from "react";

const Testimonials = () => {
  const testimonials = [
    {
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDbgbd-04tx5i51Q9onE-j5mnFcOdQTToz8ddUMu05baUqZkVjJPykenm_DDZ9NRf7EPq-H1w2hqR2OddTKJoKT9Aa2R6n13b_G9VoykSxrF5-IoXCMu8uiZScMUpv_SgGolxA79npvEfBV16RVP9--YH4PL8igw-sBklMhiL9Wa2bjj7dtut9SxAdwGdoEiVdowkWiPVbhkVes1dtPn4XOYG7r5_aNa3gH1avvfXabrZg4VC9sbfihFtnoxoht-3ea90gheA1--k",
      quote: "AveryCare has been a game-changer for our family. It helps us stay connected and informed about our loved one’s health.",
      name: "The Smiths",
    },
    {
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBveGbgjamgt1KFsFZyeQ2hMws3jJU039tz1smwoYOpPr2R7H1bF4XQb6oSWepap1WyFjF_ToEfkMsZxQAN-EJDR0xVT-_OtbycNs4R1u6cAeC9Jn4JTyMOh-naTcZWO1ToJlab_OhJq_vJ8aifWV6WfigCuc4F6E0byTbj6PE3YoAxtHUc5lku-c_LpSFe0Ir4m3WYi9nNAjS2-Wkc8gXE-rASWKOjyes4XW1gqNK5BpBAlZdtDO8dOG9cNSq9BT0jww6Gusr_9Po",
      quote: "The medication reminders are a lifesaver. We no longer worry about missed doses.",
      name: "The Johnsons",
    },
    {
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDq0pij1RSu2PuW4jeCEuSTB4tYsKuZvx-ilwEoxrCatH5kjFH0OJfhgT8VQbrKeWywbIG0BS1knFAW-oJwQVkOeZpqeXXKBj-id4qk70Br1RRTzABWG-AcB6QUb3y6tRp3E-chZx-Xw1GvUDRVad8I7ujTTMA8eLeWVNl1vCyLM-lhAoe3JpcAgWjl8aA2tliVZ4XxnQBvRL20mDxcZrP-xXdSRdbkC5eVcmmFWh13etJN4rpKDVJzhC8VptBLryqnQ5fap72SVJg",
      quote: "The daily summaries provide peace of mind, knowing we have a clear picture of our family member’s well-being.",
      name: "The Williams",
    },
  ];

  return (
    <section className="pt-12 sm:pt-16 md:pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#101815]">Trusted by Families Like Yours</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-[#101815] flex-grow">"{item.quote}"</p>
                <p className="mt-4 text-sm text-[#101815] font-semibold">
                  - {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials