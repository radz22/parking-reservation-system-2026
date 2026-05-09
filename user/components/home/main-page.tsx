'use client';
import { useState, useRef } from 'react';
import { Footer } from './footer';

import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, CircleArrowDown } from 'lucide-react';
import { ScrollReveal } from '../ScrollReveal';

import Autoplay from 'embla-carousel-autoplay';

import {
  Search,
  CalendarCheck,
  ShieldCheck,
  ChevronUp,
  Motorbike,
  Car,
  Target,
  Sparkles,
  BookOpenText,
  CircleCheckBig,
  Info,
  ShieldPlus,
  Calendars,
} from 'lucide-react';
import Image from 'next/image';
import { Navigation } from './navigation';
const faqData = [
  {
    q: 'What is Parking Hub?',
    a: 'Parking Hub is a smart parking management system designed to help drivers find and reserve available parking spaces',
  },
  {
    q: 'How does Parking Hub help me find parking?',
    a: 'Our platform provides a real-time monitoring showing available slots, pricing, and exact locations of parking lots nearby',
  },
  {
    q: 'What kind of parking information is available?',
    a: 'We provide real-time slot availability, pricing details, operating hours, and specific amenities (like CCTV, 24/7 security, or covered parking).',
  },
  {
    q: 'Can I search for specific types of parking?',
    a: 'Yes, you can use our filter tools to search by vehicle type (2-wheels or 4-wheels).',
  },
  {
    q: 'Is it free to use?',
    a: 'Browsing for parking locations is free. Making a reservation may involve a small booking fee depending on the parking lot operator.',
  },
  {
    q: 'How accurate is the information?',
    a: 'Our data is synced directly with smart sensors and parking gate systems to ensure real-time accuracy of available slots.',
  },
  {
    q: 'How can I report outdated information?',
    a: 'You can report discrepancies via email or by contacting our support team directly.',
  },
  {
    q: 'What devices is Parking Hub available on?',
    a: 'Parking Hub is fully responsive and accessible via any web browser on smartphones, tablets, and desktop computers.',
  },
  {
    q: 'What are the future plans for Parking Hub?',
    a: 'We are working on integrating EV charging station maps, monthly subscription plans, and AI-powered traffic prediction models to help you plan your parking even better.',
  },
];

const personData = [
  {
    img: '/img/person/Santillan.png',
    name: 'Santillan, Radz S.',
    role: 'Lead Website Organizer, Back-End Developer, Front-End Developer (Admin Side)',
  },

  {
    img: '/img/person/Burce.png',
    name: 'Burce, John Lester J.',
    role: 'Website UI/UX Designer & Front-End Dev (User Side)',
  },

  {
    img: '/img/person/Luntaga.png',
    name: 'Luntaga, Jimboy A.',
    role: 'Landing Page Designer & Document Organizer',
  },

  {
    img: '/img/person/Sace.png',
    name: 'Sace, Princes',
    role: 'Documentator',
  },

  {
    img: '/img/person/Dumpit.png',
    name: 'Dumpit, John Michael',
    role: 'Documentator',
  },

  {
    img: '/img/person/Caigas.png',
    name: 'Caigas, Shana Mae',
    role: 'Documentator',
  },

  {
    img: '/img/person/Encinas.png',
    name: 'Encinas, Justin Lee',
    role: 'Documentator',
  },
];

const showcaseImages = [
  { src: '/img/showcase/1.png', title: 'UI 1' },
  { src: '/img/showcase/2.png', title: 'UI 2' },
  { src: '/img/showcase/3.png', title: 'UI 3' },
];

export const MainPage = () => {
  const [activeStep, setActiveStep] = useState(1);

  const autoplayShow = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  );
  const autoplayTeam = useRef(
    Autoplay({ delay: 2500, stopOnInteraction: false }),
  );

  const [emblaRefShow, emblaApiShow] = useEmblaCarousel({ loop: true }, [
    autoplayShow.current,
  ]);
  const [emblaRefTeam, emblaApiTeam] = useEmblaCarousel({ loop: true }, [
    autoplayTeam.current,
  ]);

  const scrollPrevShow = () => emblaApiShow && emblaApiShow.scrollPrev();
  const scrollNextShow = () => emblaApiShow && emblaApiShow.scrollNext();

  const scrollPrevTeam = () => emblaApiTeam && emblaApiTeam.scrollPrev();
  const scrollNextTeam = () => emblaApiTeam && emblaApiTeam.scrollNext();

  return (
    <div className="bg-body min-h-screen dark:bg-black border border-dark/10 dark:border-white/10">
      <Navigation />

<section 
  id="main-header" 
  className="relative w-full flex items-center mt-20 justify-center overflow-hidden"
  style={{ height: '100svh' }} 
>

<div className="absolute inset-0 z-0 w-full h-full"> 
<Image
  src="/img/image.png"
  alt="parking"
  fill
  className="object-cover object-top" 
  priority
/>
  <div className="absolute inset-0 bg-black/70"></div> 
</div>

  <div className="relative z-10  md:pb-10">
    <div className="flex flex-col items-center text-center px-6 max-w-7xl gap-4">
      
      <ScrollReveal direction='right' delay={0.2}>
        <p className="md:text-xl text-primary font-semibold mb-4 drop-shadow-md">
          Parking Space Management & Reservation System
        </p>
      </ScrollReveal>

      <ScrollReveal direction='fade' delay={0.2}>
        <div className="flex flex-col">
          <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight drop-shadow-lg">
            Find Parking
          </h1>
          <h2 className="font-bold text-4xl md:text-7xl ml-5 text-secondary">Faster & Easier</h2>
        </div>
      </ScrollReveal>

      <ScrollReveal direction='left' delay={0.2}>
        <p className="text-gray-200 mt-6 text-lg md:text-xl max-w-lg leading-relaxed">
          Parking Hub helps drivers quickly locate available parking spaces
          and reserve parking spots easily.
        </p>
      </ScrollReveal>

      <div className="mt-10 flex items-center justify-center gap-4"> 
        <ScrollReveal direction='bounce' delay={0.2}>
          <button className="bg-secondary text-primary px-10 py-4 rounded-full font-bold hover:bg-primary hover:text-text hover:scale-105 duration-300 shadow-xl inline-block">
            Book Parkings
          </button>
        </ScrollReveal>

        <ScrollReveal direction='bounce' delay={0.3}>
          <a
            href="#features"
            className="border-2 border-white text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-black duration-300 hover:scale-105 inline-block"
          >
            Learn More
          </a>
        </ScrollReveal>
      </div>

      <ScrollReveal direction='down' delay={0.5}>
        <a href="#features"> 
          <CircleArrowDown className="block mt-10 md:hidden text-white/80 hover:text-primary transition hover:translate-y-2 animate-bounce" size={35} />
        </a>
      </ScrollReveal>
    </div>
  </div>
</section>

      <section id="features" className=" mx-auto px-6 pb-16 mt-10 relative md:z-20 md:-mt-30">

        <div className=" block md:hidden flex-col mb-5 text-center">
            <h1 className="text-text text-3xl md:text-4xl font-semibold">Features</h1>
             <p className="text-dark my-5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia, eaque. Voluptates illo repudiandae rerum animi.</p>
         </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto items-stretch">

            <ScrollReveal direction='up' delay={0.2}>
          <div className="bg-secondary/80 rounded-[2rem] p-8 border border-blue-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group cursor-default dark:bg-[#121212]">
            <div className="flex gap-4 mb-8">
              <div className="bg-white p-4 rounded-2xl shadow-sm flex-1 border border-gray-100 group-hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Car></Car>
                  <span className="font-bold text-slate-800">4 Wheels</span>
                </div>
                <div className="text-3xl font-black text-slate-900">10</div>
                <div className="text-xs text-gray-400">of 10 spaces</div>
                <div className="w-full bg-gray-100 h-1.5 mt-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-full"></div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm flex-1 border border-gray-100 group-hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Motorbike></Motorbike>
                  <span className="font-bold text-slate-800">2 Wheels</span>
                </div>
                <div className="text-3xl font-black text-slate-900">1</div>
                <div className="text-xs text-gray-400">of 10 spaces</div>
                <div className="w-full bg-gray-100 h-1.5 mt-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[10%]"></div>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              Real-time availability indicators
            </h3>
            <p className="text-primary text-lg leading-relaxed">
              Why guess if there are available parking spaces in your area when
              you can see it instantly on the app?
            </p>
            <p className="text-base italic text-text/80 mt-4 font-light ">
              Only available for Partner Users
            </p>
          </div>

          </ScrollReveal>

<ScrollReveal direction='up' delay={0.3}>
          <div className="bg-secondary/80 rounded-[2rem] p-8 border border-blue-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group cursor-default dark:bg-[#121212]">
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-12 flex items-center justify-between border border-gray-100 group-hover:border-blue-300 transition-colors">
              <span className="font-bold text-slate-800 text-lg">
                {"Zabarte Kai Mall's Parking Lot"}
              </span>
              <i className="fa-regular fa-heart text-2xl text-slate-800"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 dark:text-white">
              Receive parking lot updates
            </h3>
            <p className="text-primary text-lg leading-relaxed">
              {
                'Has the parking lot rental price increased? Is it closed today?'
              }
              {" You don't need to ask anymore because you can receive updates"}
              {'directly from them.'}
            </p>
            <p className="text-base italic text-text/80 mt-4 font-light">
              Only available for Partner Users
            </p>
          </div>

          </ScrollReveal>

<ScrollReveal direction='up' delay={0.3}>
          <div className="bg-secondary/70 rounded-[2rem] p-8 border border-blue-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group cursor-default dark:bg-[#121212]">
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-gray-100 group-hover:border-blue-300 transition-colors">
              <div className="flex flex-col gap-2">
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">
                    ₱30 flat rate
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase">
                    Weekdays
                  </span>
                </div>
                <input
                  type="range"
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-4"
                />
                <div className="text-center mt-2">
                  <p className="text-xs text-gray-400 uppercase tracking-tighter">
                    Total Price
                  </p>
                  <p className="text-xl font-black text-slate-800">₱60</p>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 dark:text-white">
              Transparent pricing
            </h3>
            <p className="text-primary text-lg leading-relaxed">
              How much is the pricing on weekdays versus weekends? No need to
              guess, we help you calculate your total cost before you even
              arrive.
            </p>
          </div>
</ScrollReveal>

<ScrollReveal direction='up' delay={0.2}>
          <div className="h-full bg-secondary/70 rounded-[2rem] p-8 border border-blue-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group cursor-default dark:bg-[#121212]">
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-gray-100 group-hover:border-blue-300 transition-colors">
              <p className="text-base font-bold text-slate-400 mb-3 uppercase">
                Features
              </p>
              <ul className="grid grid-cols-2 gap-2">
                <li className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                  <i className="fa-solid fa-circle-check text-blue-500"></i>{' '}
                  Security Guard
                </li>
                <li className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                  <i className="fa-solid fa-circle-check text-blue-500"></i>{' '}
                  CCTV Available
                </li>
                <li className="flex items-center gap-2 text-[13px] font-semibold text-slate-400 opacity-50">
                  <i className="fa-solid fa-circle-xmark"></i> EV Charger
                </li>
                <li className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                  <i className="fa-solid fa-circle-check text-blue-500"></i>{' '}
                  24/7 Access
                </li>
              </ul>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 dark:text-white">
              Check the benefits
            </h3>
            <p className="text-primary text-lg leading-relaxed">
              Does the parking lot have CCTV? Is it gated? You can see all this
              information and even filter lots based on your specific needs. It gives more
              privacy and keeps your vehicle in a safe place
            </p>
          </div>
</ScrollReveal>
        </div>
      </section>

      <section id="how-it-works"
        className="mx-auto px-6 md:pt-10 pb-25 dark:bg-black"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 dark:text-white">
            How it works
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Stop circling for a spot. Parking Hub takes the guesswork out of
            parking so you can save time, money, and stress.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 container-1">
  {/* LEFT SIDE: STEPS LIST */}
  <div className="w-full lg:w-1/2 space-y-4">
    {[1, 2, 3, 4].map((step, index) => (
      <ScrollReveal key={step} direction="right" delay={index * 0.2}>
        <div
          onMouseEnter={() => setActiveStep(step)}
          className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
            activeStep === step 
              ? 'bg-white shadow-xl border-l-4 border-blue-500' 
              : 'bg-transparent border-l-4 border-transparent'
          }`}
        >
          <h3
            className={`text-xl font-bold ${
              activeStep === step ? 'text-blue-600' : 'text-slate-800 dark:text-white'
            }`}
          >
            {step === 1 && 'Find Your Spot Before You Go'}
            {step === 2 && 'Park Smarter, Not Harder'}
            {step === 3 && 'Save Time and Money'}
            {step === 4 && 'Reserve Your Spot'}
          </h3>

          <p
            className={`mt-2 text-sm leading-relaxed ${
              activeStep === step ? 'text-blue-600' : 'text-gray-500 dark:text-white'
            }`}
          >
            {step === 1 && 'Simply search for your destination, and Parking Hub will show you all available parking lots nearby on a map with real-time availability.'}
            {step === 2 && "The app guides you to the entrance. You'll know exactly what to expect—whether the lot has CCTV, is covered, or has 2-wheel slots."}
            {step === 3 && "Track your savings from choosing more affordable spots and see how much time you've reclaimed from your day."}
            {step === 4 && 'Imagine knowing a spot is waiting for you. Use our booking feature to secure your parking before you even leave home.'}
          </p>
        </div>
      </ScrollReveal>
    ))}
  </div>

  {/* RIGHT SIDE: IMAGE DISPLAY (Ibinalik natin dito) */}
  <div className="w-full lg:w-1/2 hidden md:flex justify-center relative h-125">
    {/* Optional: Pwede mo rin lagyan ng ScrollReveal ang mismong image kung gusto mo */}
    <ScrollReveal direction="fade" delay={0.5}>
      <Image
        src={`/img/mobile-step/mobile-step-${activeStep}.png`}
        alt="Steps"
        height={500} // Inayos ko yung height base sa h-125 mo
        width={250}
        sizes="(max-width: 768px) 100vw, 100vw"
        className="rounded-[2.5rem] shadow-2xl object-cover"
      />
    </ScrollReveal>
  </div>
</div>
      </section>

     <section id="services" className="mb-20 container-1">
        <div className="">
          <h1 className="text-center font-semibold text-3xl mb-10 dark:text-white">
            Services
          </h1>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:max-w-7xl mx-auto">
            <ScrollReveal direction='up' delay={0.2}>
            <div className="service-card dark:bg-[#121212]">
              <div className="flex flex-col gap-5 items-center justify-center">
                <Search
                  className="service-icon"
                  size={195}
                  strokeWidth={3} // Kontrolado mo ang laki ng icon gamit ang 'size' prop
                />

                <h1 className="text-3xl font-semibold dark:text-white">
                  Real-time Availability
                </h1>
                <p className="text-center dark:text-white">
                  {" Don't "}waste time circling around. Our system instantly
                  displays all available parking slots in real-time, helping you
                  find the perfect spot the moment you arrive.
                </p>
              </div>
            </div>
</ScrollReveal>

  <ScrollReveal direction='up' delay={0.3}>
            <div className="service-card dark:bg-[#121212]">
              <div className="flex flex-col gap-5 items-center justify-center">
                <CalendarCheck
                  className="service-icon"
                  size={25}
                  strokeWidth={3}
                />
                <h1 className="text-3xl font-semibold text-center dark:text-white">
                  One-Click Reservation
                </h1>
                <p className="text-center dark:text-white">
                  Secure your parking space ahead of time. With our intuitive
                  interface, you can book your preferred slot in just a few
                  seconds and ensure your spot is waiting for you.
                </p>
              </div>
            </div>
</ScrollReveal>

  <ScrollReveal direction='up' delay={0.4}>
            <div className="service-card dark:bg-[#121212]">
              <div className="flex flex-col gap-5 items-center justify-center">
                <ShieldCheck
                  className="service-icon"
                  size={25}
                  strokeWidth={3}
                />
                <h1 className="text-3xl font-semibold dark:text-white">
                  Safe & Organized
                </h1>
                <p className="text-center dark:text-white">
                  Rest easy knowing your parking experience is managed
                  professionally. We provide a structured system that monitors
                  slot status to prevent overbooking and unauthorized access.
                </p>
              </div>
            </div>
            </ScrollReveal>
          </div>
        </div>
      </section>


      <section id="about-sys" className="container-1 mx-auto px-6 pb-16 ">

  <div className="text-center mb-12">
    <ScrollReveal delay={0.3}>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">
              About Parking Hub
            </h2>
         </ScrollReveal>
            <div className="w-16 h-1 bg-red-500 mx-auto mt-3 rounded-full dark:text-white"></div>
          </div>


          <div className="grid md:grid-cols-2 gap-12">
            {/* Our Mission Section */}

 <ScrollReveal direction='right' delay={0.4}>
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border dark:bg-[#121212] dark:border-slate-800">

            <div className="pl-6 border-l-4 border-red-500">
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-red-500" />
                
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  Our Mission
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed dark:text-white">
                To provide Filipino drivers with the most convenient parking
                experience at affordable rates, delivered through smart
                technology and real-time updates. We believe that every journey
                starts with a stress-free parking spot.
              </p>
            </div>
 </div>
 </ScrollReveal>
            {/* Why Choose Us Section */}

 <ScrollReveal direction='left' delay={0.5}>
        <div className="bg-white h-full rounded-3xl shadow-xl p-8 md:p-12 border dark:bg-[#121212] dark:border-slate-800">
            <div className="pl-6 border-l-4 border-red-500">
              <div className="flex items-center  gap-3 mb-4">
                <Sparkles className="text-blue-500" />
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  Why Choose Us?
                </h3>
              </div>
              <ul className="space-y-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <li className="flex items-center text-gray-600 text-base dark:text-white">
                  <CircleCheckBig className="mr-2 h-4 w-4 text-green-500 shrink-0" />
                  100% Real-time slots
                </li>
                <li className="flex items-center text-gray-600 text-base dark:text-white">
                  <Calendars className="mr-2 h-4 w-4 text-green-500 shrink-0" />
                  Instant booking
                </li>
                <li className="flex items-center text-gray-600 text-base dark:text-white">
                  <ShieldPlus className="mr-2 h-4 w-4 text-green-500 shrink-0" />
                  Competitive rates
                </li>
                <li className="flex items-center text-gray-600 text-base dark:text-white">
                  <Info className="mr-2 h-4 w-4 text-green-500 shrink-0" />
                  24/7 support
                </li>
              </ul>
            </div>
        </div>
        </ScrollReveal>
        </div>
      
      </section>


<ScrollReveal delay={0.1}>
      <section id="story" className="container-1 mx-auto px-6 pb-20">

    <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3">
              <BookOpenText size={35}></BookOpenText>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">
                Our Story
              </h2>
            </div>
            <div className="w-16 h-1 bg-red-500 mt-4 rounded-full"></div>
          </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-16 border dark:bg-[#121212] text-center dark:border-slate-800">


          <div className="max-w-5xl mx-auto space-y-6 text-gray-600 text-lg leading-relaxed text-left md:text-center dark:text-white">
            <p>
              Established in 2026, {'Parking Hub'} began with a simple vision:
              to make urban navigation and parking accessible to every Filipino
              driver. What started as a small project to solve city congestion
              has grown into a trusted platform, serving thousands of commuters
              daily.
            </p>

            <p>
              We work directly with commercial establishment owners and private
              lot operators to ensure that every parking space meets our strict
              safety and accessibility standards. Our commitment to innovation
              and driver satisfaction has made us the preferred choice for daily
              commuters and travelers across the region.
            </p>
          </div>
        </div>
      </section>
</ScrollReveal>

        <section id="banner-1" className=" mb-20">
        <div className="bg-secondary py-20 md:rounded-2xl lg: container-1 dark:bg-[#121212]">
          <div className="flex flex-col gap-3 items-center lg:mx-20">
            <h1 className="text-4xl font-semibold mb-5 text-primary text-center">
              {'Parking Made Simple. Reservation Made Smart.'}
            </h1>
            <p className="text-lg text-center text-primary">
              Experience a seamless parking journey. Find, reserve, and secure
              your slot in just a few clicks—no stress, no delays. Leveraging
              modern technology to streamline your parking experience. Fast,
              reliable, and always ready for your arrival
            </p>
            <a
              href="#features"
              className="my-5 bg-secondary py-3 px-13 rounded-3xl font-semibold text-primary text-base border border-primary hover:bg-primary transition hover:text-secondary"
            >
              See More
            </a>
          </div>
        </div>
      </section>

      <section id="about-us" className="pb-5  max-w-7xl mx-auto px-6">
        <div className="container-1 dark:text-white mb-10">
          <div
            id="about-us-header"
            className="flex flex-col gap-5 items-center"
          >
            <h1 className="text-center font-semibold text-text text-4xl dark:text-white">
              About Us
            </h1>
            <h3>{'Built for the Community, by the Student'}</h3>
            <p className="text-center">
              {'Developed to solve the common parking challenges faced by our'}
              fellow students and staff, this system is more than just a
              reservation tool, it &rsquo;s a commitment to a more organized
              campus. We are dedicated to creating a system that values your
              time, ensures
              {'fairness, and makes every arrival a stress-free experience.'}
            </p>
          </div>
        </div>

        <div className="relative group">
          <div className="overflow-hidden" ref={emblaRefTeam}>
            <div className="flex">
              {personData.map(({ img, name, role }, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] px-4"
                >
                  <div className="p-8 bg-white rounded-3xl shadow-md border border-gray-100 flex flex-col items-center h-full dark:bg-[#121212] dark:border-white/10">
                    <div className="relative h-44 w-44 mb-6">
                      <Image
                        src={img}
                        fill
                        className="object-cover rounded-full border-4 border-white shadow-lg"
                        alt={name}
                      />
                    </div>
                    <h3 className="font-bold text-center text-slate-800 dark:text-white">
                      {name}
                    </h3>
                    <p className="text-xs text-center text-gray-500 mt-3">
                      {role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={scrollPrevTeam}
            className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-10"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={scrollNextTeam}
            className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-10"
          >
            <ChevronRight />
          </button>
        </div>


        <div className="my-10 flex flex-col gap-6 md:flex-row">

          <ScrollReveal delay={0.3} direction="right">
          <div className="service-card flex flex-col gap-6 items-center dark:bg-[#121212]">
            <h1 className="text-xl font-semibold dark:text-white">
              &ldquo;Smart Parking, Streamlined. &rdquo;
            </h1>
            <p className="text-center text-base dark:text-white">
              &ldquo;Innovation meets convenience. Our parking reservation
              system is designed with cutting-edge technology to provide
              real-time updates and effortless management. We are pushing for a
              future where parking is no longer a hurdle, but a standard part of
              a well-organized, efficient, and tech-driven campus life.&rdquo;
            </p>
          </div>
         </ScrollReveal>

 <ScrollReveal delay={0.5} direction="left">
          <div className="service-card flex flex-col gap-6 items-center dark:bg-[#121212]">
            <h1 className="text-xl font-semibold dark:text-white">
              &ldquo;Redefining Campus Mobility.&rdquo;
            </h1>
            <p className="text-center text-base dark:text-white">
              &ldquo;We believe that your day {"shouldn't"} start with the
              stress of searching for a parking spot. Our mission is to
              transform the traditional parking experience into a modern,
              seamless, and digital-first journey. By bridging the gap between
              drivers and available spaces, we empower our community to save
              time and move with confidence.&rdquo;
            </p>
          </div>
          </ScrollReveal>
        </div>
      </section>

        <section id="project-showcase" className="mb-20">
        <div className="container-1">
          <div className="my-10 flex flex-col gap-2">
            <h3 className="text-center text-3xl font-semibold dark:text-white">
              Showcase
            </h3>
            <p className="text-center text-base text-text dark:text-white">
              Some of the User Interfaces inside the whole system.
            </p>
          </div>

          <div className="relative group max-w-5xl mx-auto">
            <div
              className="overflow-hidden rounded-[2rem] shadow-2xl bg-white border border-gray-100 dark:bg-[#121212] dark:border-white/10"
              ref={emblaRefShow}
            >
              <div className="flex">
                {showcaseImages.map((item, index) => (
                  <div
                    key={index}
                    className="flex-[0_0_100%] relative h-87.5 md:h-150"
                  >
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-contain p-4 md:p-8"
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={scrollPrevShow}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-full shadow-2xl transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronLeft size={30} />
            </button>

            <button
              onClick={scrollNextShow}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-full shadow-2xl transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronRight size={30} />
            </button>
          </div>
        </div>
      </section>

      <section id="FAQ" className="container mx-auto px-6 pt-10 pb-20">
        <div className="text-center mb-16 dark:bg-[#0a0a0a]">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 dark:bg-[#0a0a0a] dark:text-white">
            Frequently asked questions
          </h2>
          <p className="text-gray-500 text-lg">
            If you {"can't"} find what you are looking for {"don't"} hesitate to
            contact us.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-2">
          {faqData.map((item, index) => (
            <details key={index} className="group border-b border-gray-200">
              <summary className="flex justify-between items-center w-full py-6 cursor-pointer list-none">
                <span className="text-lg font-medium text-slate-800 dark:text-white">
                  {item.q}
                </span>
                <div className="bg-gray-100 group-open:rotate-180 transition-transform duration-300 w-10 h-10 flex items-center justify-center rounded-full">
                  <ChevronUp size={16} className="text-slate-500" />
                </div>
              </summary>
              <div className="pb-6 text-gray-600 leading-relaxed">{item.a}</div>
            </details>
          ))}
        </div>
      </section>

      <Footer></Footer>
    </div>
  );
};
