import React from 'react';
import Link from 'next/link';
import {StepForward} from 'lucide-react';

import { Footer } from './footer';

// I-store ang 10 terms sa array para malinis
const termsUseData = [
  { number: "1", title: " Account Responsibility", description: "Users are responsible for maintaining the confidentiality of their account credentials." },
  { number: "2", title: "Accuracy of Information", description: "Users must provide true and accurate details (Plate No., Contact No.) during registration and booking." },
  { number: "3", title: "Prohibited Acts", description: "Users shall not attempt to hack, disrupt, or exploit vulnerabilities in the Parking Hub system." },
  { number: "4", title: "Reservation Validity", description: "A reservation is only guaranteed for the specific timeframe selected. Late arrivals may result in forfeiture of the slot." },
  { number: "5", title: "Vehicle Safety", description: "While Parking Hub helps you find a spot, the system is not liable for any loss or damage to the vehicle while inside the partner parking lot." },
  { number: "6", title: "Payment and Fees", description: "Users agree to pay the fees associated with the reservation as displayed during the booking process." },
  { number: "7", title: "Cancellation Policy", description: "Cancellations must be made within the allowed grace period to avoid penalties or (No-Show) tags." },
  { number: "8", title: "Fair Use", description: "The system must be used for personal, non-commercial purposes only. Automated bot-booking is strictly prohibited." },
  { number: "9", title: "Partner Regulations", description: "Users must also follow the specific rules and regulations of the individual parking lot operators." },
  { number: "10", title: "Service Modification", description: "Parking Hub reserves the right to update features or suspend services for maintenance without prior notice." },
];

export const TermsAndConditions = () => {
  return (
    <div>
    <div className="mx-5 my-10 md:max-w-4xl md:mx-auto">
      <nav className="flex flex-row justify-between items-center">
        <h1 className="text-2xl text-text font-semibold">Parking Hub</h1>
        <div className="flex flex-row">
  <Link href="/main-page" className="flex items-center gap-2 text-base hover:text-secondary transition">
    Back 
    <StepForward size={16} /> 
  </Link>
</div>
      </nav>

      <section className="mt-20 bg-primary p-6 rounded-3xl">
        <div className="flex justify-center md:justify-start">
          <h1 className="text-lg font-semibold text-center border-b w-fit">TERMS AND CONDITIONS</h1>
        </div>

        {/* Title / Intro */}
        <div className="mt-5 text-center md:text-start">
          <h1>Welcome to Parking Hub. By accessing or using our platform, you agree to comply with and be bound by these Terms of Use. Our system is designed to provide real-time parking information and reservation services. These terms govern your right to use the system and your responsibilities as a user. If you do not agree with any part of these terms, please refrain from using the service.</h1>
          <div className="border-b mt-5"></div>
        </div>

        {/* Privacy Policy */}
        <div className="mt-5">
          <div className="flex justify-center md:justify-start">
            <h1 className="text-lg font-semibold border-b w-fit">Privacy Policy Description</h1>
          </div>
          <p className="text-center mt-5 md:text-start">We value your privacy. Parking Hub collects minimal personal information, such as your name, contact details, and vehicle plate number, solely for the purpose of managing reservations and ensuring security. We do not sell your data to third parties. All personal data is processed in compliance with the Data Privacy Act of 2012 (Republic Act No. 10173) of the Philippines.</p>
        </div>

        {/* Copyright */}
        <div className="mt-5">
          <div className="flex justify-center md:justify-start">
            <h1 className="text-lg font-semibold border-b w-fit">Copyright Description</h1>
          </div>
          <p className="text-center mt-5 md:text-start">All content included in this system, such as text, graphics, logos, button icons, images, and software, is the property of Parking Hub or its content suppliers and is protected by international copyright laws. The compilation of all content on this site is the exclusive property of the development team (BSCS 3C) and protected by applicable intellectual property rights.</p>
        </div>

        {/* Electronic Communication */}
        <div className="border-b pb-10 mt-5">
          <div className="flex justify-center md:justify-start">
            <h1 className="text-lg font-semibold border-b w-fit">Electronic Communication Description</h1>
          </div>
          <p className="text-center mt-5 md:text-start">When you use Parking Hub, you consent to receive communications from us electronically, such as via email or system notifications. All agreements and notices provided to you electronically satisfy any legal requirement that such communications be in writing.</p>
        </div>

        {/* Terms of Use List */}
        <div className="mt-5 border-b pb-5">
          <div className="flex justify-center md:justify-start">
            <h1 className="text-lg font-semibold border-b w-fit">Terms of Use</h1>
          </div>
          <ul className="mt-5 space-y-3">
            {termsUseData.map((term) => (
              <li key={term.number}>
                <span className="font-semibold">{term.number}. {term.title}:</span> {term.description}
              </li>
            ))}
          </ul>
        </div>

        {/* Summary */}
        <div className="mt-5">
          <div className="flex justify-center md:justify-start">
            <h1 className="text-lg font-semibold border-b w-fit">Summary Terms of Service</h1>
          </div>
          <p className="text-center mt-5 md:text-start">In short, by using Parking Hub, you agree to provide honest information, respect the booking schedules, and use the platform legally. We promise to protect your data and provide accurate parking updates. Failure to follow these rules may result in the suspension of your account.</p>
        </div>
      </section>
</div>
      <Footer></Footer>
    </div>
  );
}