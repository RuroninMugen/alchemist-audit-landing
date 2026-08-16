import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import HowItWorks from "./components/HowItWorks";
import WhatYouGet from "./components/WhatYouGet";
import About from "./components/About";
import AuditQuiz from "./components/AuditQuiz";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <Hero />
        <TrustBar />
        <HowItWorks />
        <WhatYouGet />
        <About />
        <AuditQuiz />
      </main>
      <Footer />
    </div>
  );
}
