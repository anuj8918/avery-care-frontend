import React from "react";
// Feature Section Component
const FeatureSection = () => {
  const features = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32Z"></path></svg>,
      title: "AI Wellness Calls",
      description: "Engage in supportive conversations with our AI companion, designed to promote your overall well-being.",
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M216.42,39.6a53.26,53.26,0,0,0-75.32,0L39.6,141.09a53.26,53.26,0,0,0,75.32,75.31h0L216.43,114.91A53.31,53.31,0,0,0,216.42,39.6ZM103.61,205.09h0a37.26,37.26,0,0,1-52.7-52.69L96,107.31,148.7,160Z"></path></svg>,
      title: "Medication Reminders",
      description: "Receive timely reminders for your medications, ensuring you never miss a dose.",
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Z"></path></svg>,
      title: "Daily Summaries",
      description: "Get a concise overview of your daily health activities and insights, keeping you informed and in control.",
    },
  ];

  return (
    <div className="pt-12 sm:pt-16 md:pt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center md:text-left mb-10 md:mb-12">
          <h1 className="text-[#101815] text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
            Care, Simplified.
          </h1>
          <p className="text-[#101815] text-base sm:text-lg leading-normal max-w-3xl mx-auto md:mx-0 mt-2">
            AveryCare offers a suite of features designed to simplify your healthcare journey.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col gap-4 rounded-xl border border-[#d4e2dc] p-6 transition-transform transform hover:-translate-y-1 hover:shadow-lg">
              <div className="text-green-600">
                {feature.icon}
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-[#101815] text-lg font-bold leading-tight">{feature.title}</h2>
                <p className="text-[#101815] text-sm font-normal leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection