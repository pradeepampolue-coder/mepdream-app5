
import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Clock, 
  CheckCircle2,
  ChevronRight,
  Send,
  Loader2,
  AlertTriangle,
  Settings,
  Globe,
  Building2,
  Home as HomeIcon,
  ArrowLeft,
  ShoppingBag,
  Utensils,
  Warehouse,
  Hospital,
  ExternalLink,
  ChevronDown,
  FileText,
  Play,
  Image as ImageIcon,
  Users,
  Briefcase,
  Layers,
  Leaf,
  BarChart3,
  HardHat,
  Droplets,
  Flame,
  Fan,
  Cpu,
  Hammer,
  Flower2,
  Search,
  Laptop,
  CreditCard,
  Lock,
  Calendar,
  PieChart,
  ClipboardCheck,
  Target,
  Eye,
  Stethoscope,
  Hotel,
  Factory,
  Building,
  Monitor,
  Layout,
  GraduationCap
} from 'lucide-react';
import { Section, ChatMessage } from './types';
import { SERVICES_DATA, INDUSTRIES_DATA, PRODUCTS_DATA, RESOURCES_DATA, CORE_VALUES } from './constants';
import { getTechnicalAdvice } from './services/geminiService';

const Logo = ({ inverted = false }: { inverted?: boolean }) => (
  <div className={`flex flex-col items-center justify-center ${inverted ? 'brightness-0 invert' : ''}`}>
    <svg viewBox="0 0 400 240" className="h-16 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Top Graphic: Buildings and Drop */}
      <g className="logo-top">
        <path d="M220 100 V40 H240 V100 M245 100 V20 H270 V100 M275 100 V35 H295 V100 M300 100 V50 H320 V100" stroke="#024B97" strokeWidth="2" fill="#024B97" />
        <path d="M190 100 C190 120 170 140 150 140 C130 140 110 120 110 100 C110 80 150 40 150 40 C150 40 190 80 190 100Z" fill="url(#dropGradient)" />
        <path d="M145 75 L160 95 H145 L155 120" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      
      <g transform="translate(40, 110)">
        <path d="M20 60 C 20 20, 300 20, 320 60" stroke="#F47A20" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M0 65 C 0 110, 340 110, 340 50" stroke="#3BB54A" strokeWidth="6" strokeLinecap="round" fill="none" />
        <text x="50" y="85" style={{ font: 'italic bold 85px sans-serif' }}>
          <tspan fill="#024B97">M</tspan>
          <tspan fill="#F47A20">E</tspan>
          <tspan fill="#3BB54A">P</tspan>
        </text>
      </g>
      
      <g transform="translate(40, 200)">
        <text x="10" y="20" style={{ font: 'bold 22px sans-serif' }} fill="#024B97">
          DREAM OPERATION
        </text>
        <text x="22" y="45" style={{ font: 'bold 18px sans-serif' }} fill="#024B97">
          SOLUTION <tspan fill="#F47A20">PVT. LTD.</tspan>
        </text>
      </g>

      <defs>
        <linearGradient id="dropGradient" x1="110" y1="40" x2="190" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0ea5e9" />
          <stop offset="1" stopColor="#024B97" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const FAQSection = ({ items }: { items: { q: string, a: string }[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <h4 className="text-[#14918e] font-bold uppercase tracking-widest text-xs mb-4">COMMON QUESTIONS</h4>
            <h3 className="text-5xl font-bold text-slate-900 leading-tight">Most Popular Questions.</h3>
          </div>
          <div className="lg:col-span-7 space-y-4">
            {items.map((item, i) => (
              <div key={i} className="border-b border-slate-100 last:border-0">
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full py-6 flex justify-between items-center text-left group"
                >
                  <span className="text-lg font-bold text-slate-900 group-hover:text-[#14918e] transition-colors">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-96 pb-6' : 'max-h-0'}`}>
                  <p className="text-slate-600 leading-relaxed pl-4 border-l-2 border-[#14918e]/30">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Section>(Section.HOME);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesHovered, setIsServicesHovered] = useState(false);
  const [isProductsHovered, setIsProductsHovered] = useState(false);
  const [isResourcesHovered, setIsResourcesHovered] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, selectedServiceId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const navigateTo = (page: Section) => {
    setCurrentPage(page);
    setSelectedServiceId(null);
    setIsMenuOpen(false);
    setIsServicesHovered(false);
    setIsProductsHovered(false);
    setIsResourcesHovered(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    const advice = await getTechnicalAdvice(chatInput);
    setChatMessages(prev => [...prev, { role: 'assistant', content: advice }]);
    setIsTyping(false);
  };

  const QuoteForm = () => (
    <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl p-10 space-y-8">
      <h3 className="text-4xl font-bold text-slate-900">Get a Quote</h3>
      <form className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-900 ml-1">Name</label>
          <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-6 py-4 text-sm focus:ring-2 focus:ring-[#14918e] outline-none" placeholder="Name" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-900 ml-1">Email</label>
          <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-6 py-4 text-sm focus:ring-2 focus:ring-[#14918e] outline-none" placeholder="Email" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-900 ml-1">Message</label>
          <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg px-6 py-4 text-sm h-40 focus:ring-2 focus:ring-[#14918e] outline-none" placeholder="Message"></textarea>
        </div>
        <button type="button" className="w-full bg-[#14918e] text-white py-5 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-[#117a78] transition-all">Get a Quote</button>
      </form>
    </div>
  );

  const MEPServiceDetail = () => (
    <div className="animate-in slide-in-from-right duration-500 bg-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center text-white text-center">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="MEP Services" />
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 max-w-6xl px-4 space-y-10">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight drop-shadow-2xl">MEP Engineering Services – O & M</h1>
          <p className="text-xl md:text-2xl font-medium leading-relaxed max-w-4xl mx-auto drop-shadow-lg text-slate-100">We specialize in end-to-end MEP Operations & Maintenance services designed to keep your mechanical, electrical, and plumbing systems performing at their best. Our approach combines structured maintenance, real-time monitoring, and experienced manpower to deliver efficiency, safety, and continuity for your facilities.</p>
        </div>
      </section>

      {/* Intro Text Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <div className="max-w-6xl mx-auto">
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-12">
              Managing complex infrastructure requires more than periodic check-ups — it demands <strong>precision, planning, and proactive care</strong>. At Mepdream operation solutions Pvt Ltd., we deliver comprehensive <strong>O&M services for MEP systems</strong>, tailored to the unique requirements of commercial, residential, and industrial facilities.
            </p>
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-20">
              Our team ensures round-the-clock operational support through <strong>planned preventive maintenance, data-driven performance tracking, and responsive service teams</strong>, helping you <strong>minimize breakdowns, reduce downtime, and extend asset life</strong>.
            </p>

            <h3 className="text-3xl font-bold text-slate-900 mb-12">Our Solutions & Benefits</h3>
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-6">
              {[
                'Proactive Planned Preventive Maintenance for improved system reliability',
                'Day-to-day operations support by trained technical teams',
                'Annual Shutdown planning and execution to minimize business disruption',
                'Real-time data logging and reporting for better decision-making',
                'Enhanced safety and compliance with statutory norms',
                '24×7 service support for critical infrastructure',
                'Tailored O&M strategies to suit each facility\'s unique requirements',
                'Optimized asset performance and reduced life-cycle costs'
              ].map((benefit, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div className="w-6 h-6 rounded-full bg-[#14918e]/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[#14918e]" />
                  </div>
                  <span className="text-slate-700 font-medium text-lg leading-snug">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Operations Grid matched to screenshots */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-6xl font-bold text-center text-slate-900 mb-20">Operations</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Electrical Services', 
                img: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=800',
                text: 'We maintain electrical systems including power distribution, lighting, and emergency systems, from high-voltage substations to low-voltage workstations for buildings. We ensure safety, energy efficiency, and compliance with electrical codes.'
              },
              { 
                title: 'Diesel Generator Services', 
                img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800',
                text: 'We handle the setup, routine maintenance, and troubleshooting of backup diesel generators for uninterrupted power supply. This includes load assessment, installation, repairs, and testing for reliability during outages.'
              },
              { 
                title: 'HVAC Maintenance', 
                img: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecb?q=80&w=800',
                text: 'We service, and optimize Heating, Ventilation, and Air Conditioning (HVAC) systems to ensure comfortable indoor environments. Our work includes scheduled preventive maintenance, repairs, and efficiency upgrades.'
              },
              { 
                title: 'Fire Safety and Preventive Services', 
                img: 'https://images.unsplash.com/photo-1563991655280-cb95c90ca2fb?q=80&w=800',
                text: 'Our teams implement and maintain fire alarm systems, sprinklers, hydrants, and emergency lighting throughout buildings. They also conduct regular inspections and testing to ensure compliance with safety regulations.'
              },
              { 
                title: 'Sewage/Effluent/Water Treatment Plant Services', 
                img: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=800',
                text: 'We maintain plumbing networks for wastewater management, sewage treatment plants, and water reuse. Our responsibilities include pump maintenance, system monitoring, and ensuring environmental standards are met.'
              },
              { 
                title: 'Plumbing Services', 
                img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800',
                text: 'We maintain building plumbing works, including pipes, sanitary fittings, leak repairs, and water supply line management. We also handle modifications related to MEP installations for seamless system integration.'
              },
              { 
                title: 'Integrated Building Management System', 
                img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=800',
                text: 'Our experts integrate and manage an Integrated Building Management System (IBMS) for centralized control of power, HVAC, security, and utilities. We oversee automation, monitoring, and optimization to enhance building performance.'
              },
              { 
                title: 'Civil and Masonry Services', 
                img: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecb?q=80&w=800',
                text: 'Our team provides civil and masonry services in facilities ensure the structural integrity, durability, and safety of buildings through activities like waterproofing, brickwork, plastering, flooring, and renovations—supporting both preventive maintenance and efficient facility upgrade.'
              },
              { 
                title: 'Gardening Services', 
                img: 'https://images.unsplash.com/photo-1558904541-efa8c196b27d?q=80&w=800',
                text: 'We provide complete gardening and lawn care services, focusing on maintenance, landscaping, and regular upkeep to ensure healthy, well-maintained green spaces that enhance the beauty and environment of any facility.'
              }
            ].map((op, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col group">
                <div className="p-8 border-b border-slate-50">
                  <h4 className="text-xl font-bold text-slate-900 text-center">{op.title}</h4>
                </div>
                <div className="h-64 relative overflow-hidden">
                  <img src={op.img} alt={op.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="p-8 flex-grow">
                  <p className="text-slate-500 text-sm leading-relaxed">{op.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative sections */}
      <section className="py-24 space-y-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-8">
          <h3 className="text-5xl font-bold text-slate-900 tracking-tight">Maintenance</h3>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
            We specialize in the operation and maintenance of electromechanical assets through our comprehensive MEP engineering services. Our expert technical team is dedicated to ensuring optimal system performance and longevity through tailored solutions, including <strong>Annual Maintenance Contracts (AMCs)</strong> for diesel generators (DG), transformers, electrical panels, HVAC units, and more. Additionally, we provide <strong>shutdown services</strong> and emergency or preventive repairs to minimize downtime and maintain operational efficiency.
          </p>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
            Committed to 24/7 service availability, we ensure rapid response times and an efficient ticket management process to address your needs promptly. Maintenance is crucial for preserving the value and functionality of your assets, and we develop customized plans tailored to your specific operational requirements. Our approach guarantees your equipment remains in peak condition, enhancing productivity while reducing unexpected failures and costs.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4 text-center space-y-8">
          <h3 className="text-5xl font-bold text-slate-900 tracking-tight">Performance Enhancement</h3>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
            We provide comprehensive MEP audit services to ensure optimal performance, safety, and regulatory compliance of your building systems. Our offerings include Facility Audits that evaluate the condition and efficiency of all mechanical, electrical, and plumbing systems within your premises. We conduct thorough Energy Audits to analyze consumption patterns and recommend cost-saving improvements. Our Safety/EHS Audits assess workplace conditions to ensure adherence to environmental and safety standards. Additionally, our Thermography Audits utilize infrared technology to detect hidden electrical and mechanical faults early, preventing costly failures.
          </p>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
            Our specialized services also encompass Air Quality Testing to monitor indoor environment health and enhance occupant comfort. Meter Calibration and Testing guarantee the accuracy and compliance of critical measurement devices. Through these diverse audits, we enable proactive maintenance, risk mitigation, and improved system longevity. Partnering with us means gaining detailed insights and actionable recommendations that empower you to optimize operational efficiency, reduce costs, and uphold the safety and reliability of your MEP infrastructure.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4 text-center space-y-8">
          <h3 className="text-5xl font-bold text-slate-900 tracking-tight">Sustainability Partner</h3>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
            At Mepdream operation solutions Pvt Ltd., sustainability is central to every service we provide. We actively promote the adoption of clean and cost-effective energy solutions such as solar power and EV charging infrastructure, integrating sustainable HVAC duct sealing and RECD devices to minimize energy losses and maximize efficiency. Our commitment extends to reducing the overall carbon footprint of building systems by implementing best practices, policies, and state-of-the-art technology that ensure resource conservation and long-term environmental benefits.
          </p>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
            Through strategic planning and execution, we foster greener operations by optimizing energy consumption with advanced energy management techniques and supporting facility sustainability goals. Our team collaborates closely with clients to design tailored sustainability roadmaps that incorporate renewable energy integration, energy-efficient equipment, and rigorous operational protocols. By championing these sustainable initiatives, we help organizations meet regulatory requirements, enhance operational cost savings, and contribute meaningfully to a more resilient and environmentally responsible future.
          </p>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-24 bg-[#14918e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="text-center mb-16">
            <h4 className="font-bold uppercase tracking-widest text-xs mb-4 opacity-80">INDUSTRIES WE ARE SERVING</h4>
            <h3 className="text-5xl md:text-6xl font-bold font-heading mb-6">Expertise Tailored for every Industry.</h3>
            <p className="max-w-3xl mx-auto text-white/80">Our deep understanding of sector-specific challenges allows us to deliver customized solutions that meet unique operational and regulatory demands.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { icon: <Settings />, title: 'IT Parks', text: 'Reliable end-to-end facility support for large-scale technology campuses.' },
              { icon: <FileText />, title: 'IT Campuses', text: 'Smart facility solutions designed for vibrant IT Campuses spaces.' },
              { icon: <Layout />, title: 'IT Floors', text: 'Managing multi-floor facilities for companies.' },
              { icon: <Building />, title: 'GCC', text: 'Global Capabilities Centre support services.' },
              { icon: <Stethoscope />, title: 'Pharma & Biotech', text: 'Controlled environments built for precision, safety, and compliance.' },
              { icon: <Factory />, title: 'Manufacturing Units', text: 'Industrial-grade facility management for round-the-clock productivity.' },
              { icon: <Building2 />, title: 'BFSI', text: 'Ensuring uninterrupted operations for secure and trusted Banking, Financial Services, and Insurance spaces.' },
              { icon: <ShoppingBag />, title: 'Malls', text: 'Creating safe, efficient, and visitor-friendly shopping environments.' },
              { icon: <Hotel />, title: 'Hotels', text: 'Seamless operations that enhance guest experience and comfort.' },
              { icon: <Warehouse />, title: 'Commercial Establishments', text: 'Professional maintenance solutions that match business pace.' },
              { icon: <Monitor />, title: 'Social Infrastructure', text: 'Supporting critical public spaces with dependable facility services.' },
              { icon: <HomeIcon />, title: 'Residential Spaces', text: 'Comfortable, well-maintained living spaces for modern communities.' }
            ].map((ind, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 text-white">
                  {React.cloneElement(ind.icon as React.ReactElement, { className: 'w-7 h-7' })}
                </div>
                <div className="space-y-1">
                  <h5 className="text-xl font-bold">{ind.title}</h5>
                  <p className="text-white/70 text-sm leading-relaxed">{ind.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <h4 className="text-[#14918e] font-bold uppercase tracking-widest text-xs">HOW IT WORKS</h4>
                <h3 className="text-5xl font-bold text-slate-900 leading-tight">When you need experience, we have it covered.</h3>
              </div>
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1200" className="w-full object-cover" alt="Team Work" />
              </div>
            </div>
            <div className="space-y-6">
              {[
                { title: 'Consultation', text: 'We assess your facility, existing systems, and pain points to design a tailored O&M plan.' },
                { title: 'Contracting & Planning', text: 'Scope of work, service frequency, SLAs, and reporting formats are finalized transparently.' },
                { title: 'Execution & Monitoring', text: 'Our team takes over daily operations, preventive maintenance, and critical shutdowns while logging performance data.' },
                { title: 'Quality Check & Continuous Improvement', text: 'Regular audits, performance reviews, and system enhancements ensure sustained reliability and cost optimization.' }
              ].map((step, i) => (
                <div key={i} className="bg-slate-50 p-10 rounded-2xl border border-slate-100 hover:shadow-lg transition-all">
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">{step.title}</h4>
                  <p className="text-slate-500 leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FAQSection items={[
        { q: 'What types of MEP systems do you cover under O&M services?', a: 'We cover the full spectrum of Mechanical, Electrical, and Plumbing systems, including HVAC systems, power distribution, UPS, DG sets, fire fighting systems, water supply, drainage, and IBMS. Our team ensures each system runs smoothly with preventive maintenance and real-time monitoring.' },
        { q: 'How do you structure your preventive maintenance schedule?', a: 'Our schedules are customized based on asset type, manufacturer recommendations, and usage intensity, ensuring zero-breakdown reliability.' },
        { q: 'Do you provide 24×7 operational support?', a: 'Yes, we provide round-the-clock technical and emergency support for all critical facilities.' },
        { q: 'Can you integrate with our existing Facility Management or BMS systems?', a: 'Absolutely. We have expertise in integrating our O&M protocols with major IBMS and CAFM platforms.' },
        { q: 'What makes Mepdream operation solutions Pvt Ltd.\'s O&M services different?', a: 'Our difference lies in our 3,000+ skilled workforce, technology-led reporting (VManage), and unwavering focus on compliance and sustainability.' }
      ]} />
    </div>
  );

  const StaffingServiceDetail = () => (
    <div className="animate-in slide-in-from-right duration-500 bg-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center text-white text-center">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="Staffing Solutions" />
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]"></div>
        </div>
        <div className="relative z-10 max-w-6xl px-4 space-y-10">
          <h1 className="text-5xl md:text-9xl font-bold tracking-tight">Staffing Solutions</h1>
          <p className="text-xl md:text-2xl font-medium leading-relaxed max-w-4xl mx-auto text-slate-200">We provide skilled, experienced, and dependable manpower to support your operations, boost productivity, and ensure seamless day-to-day functioning across industries.</p>
        </div>
      </section>

      {/* Intro & Quote Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-7 space-y-12">
              <div className="space-y-8">
                <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
                  Finding the right talent can be challenging, especially for critical facility and engineering roles. At Mepdream operation solutions Pvt Ltd., we take that burden off your shoulders. We offer end-to-end staffing solutions, from recruitment and onboarding to training and management. Whether you need specialized technical staff or reliable facility operators, our team ensures you get the right people for the right job — every time.
                </p>
                <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
                  Our extensive industry network, rigorous screening process, and hands-on approach help you build strong teams that align with your operational goals. We don't just fill positions; we provide people who contribute to your success.
                </p>
              </div>

              {/* Solutions & Benefits matched to screenshots */}
              <div className="space-y-12 pt-8">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Our Solutions & Benefits</h3>
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                  {[
                    { title: 'End-to-End Recruitment', desc: 'From sourcing to onboarding, we handle the entire hiring cycle.' },
                    { title: 'Industry-Trained Workforce', desc: 'Staff equipped with practical skills and compliance training.' },
                    { title: 'Flexible Engagement Models', desc: 'Temporary, contract, or permanent placement based on your needs.' },
                    { title: 'Cost & Time Efficiency', desc: 'Reduce overheads with streamlined staffing processes.' },
                    { title: 'Compliance & Reliability', desc: 'All placements meet safety and regulatory standards.' },
                    { title: 'Quick Turnaround', desc: 'Fast deployment to keep your operations running smoothly.' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-6 h-6 rounded-full bg-[#14918e]/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle2 className="w-4 h-4 text-[#14918e]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight mb-1">{item.title}:</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-12 pt-16">
                <div className="space-y-6">
                  <h3 className="text-4xl font-bold text-slate-900 tracking-tight">What We Offer</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Finding the right talent shouldn't slow your business down. Our end-to-end staffing solutions help you build agile teams through a smart mix of recruitment, screening, and workforce management. Whether you need short-term specialists or long-term hires, we offer flexible staffing models that grow with your business—while we handle all employment responsibilities behind the scenes.
                  </p>
                </div>

                <div className="space-y-16">
                  <div className="space-y-4">
                    <h4 className="text-2xl font-bold text-slate-900">1. Complete Recruitment Cycle</h4>
                    <p className="text-slate-600">We manage the entire hiring process so you can focus on your core operations.</p>
                    <ul className="space-y-4 pl-4 text-slate-500">
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Comprehensive sourcing from diverse and reliable talent pools</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Multi-stage screening, including technical assessments and background checks</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Structured interviews with industry-specific evaluation criteria</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-2xl font-bold text-slate-900">2. Flexible Staffing Models</h4>
                    <p className="text-slate-600">Every business has different hiring needs. We offer multiple staffing formats to match your goals.</p>
                    <ul className="space-y-4 pl-4 text-slate-600">
                      <li><strong>Temporary Staffing</strong> – Short-term workforce for projects or seasonal needs</li>
                      <li><strong>Contract Staffing</strong> – Skilled professionals for fixed durations with defined deliverables</li>
                      <li><strong>Permanent Placement</strong> – Full-time hiring with candidate quality guarantees</li>
                      <li><strong>Staff Augmentation</strong> – Specialized talent to support and enhance existing teams</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-2xl font-bold text-slate-900">3. Workforce Management</h4>
                    <p className="text-slate-600">We don't stop at recruitment. We take care of your workforce from day one.</p>
                    <ul className="space-y-4 pl-4 text-slate-500">
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Smooth onboarding and orientation programs</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Ongoing performance monitoring and feedback systems</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Scalable staffing solutions to match changing business demands</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-2xl font-bold text-slate-900">4. Compliance & Administration</h4>
                    <p className="text-slate-600">We act as the legal employer of record, taking full responsibility for all compliance and HR administration.</p>
                    <ul className="space-y-4 pl-4 text-slate-500">
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Complete HR documentation and contract management</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Legal compliance with labor laws and regulations</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Workers' compensation and benefits administration</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-12 pt-16">
                  <h3 className="text-4xl font-bold text-slate-900 tracking-tight">Specialized Staffing Services</h3>
                  
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-2xl font-bold text-slate-900">Executive Search</h4>
                      <ul className="space-y-4 pl-4 text-slate-500">
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Recruitment for C-level and senior leadership positions</li>
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Board-level hiring for strategic roles</li>
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Confidential and discreet search processes</li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-2xl font-bold text-slate-900">Virtual Staffing</h4>
                      <ul className="space-y-4 pl-4 text-slate-500">
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Access to a global remote talent pool</li>
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> End-to-end virtual onboarding and performance management</li>
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Ideal for niche skills and distributed teams</li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-2xl font-bold text-slate-900">Managed Service Provider (MSP)</h4>
                      <ul className="space-y-4 pl-4 text-slate-500">
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Full outsourcing of workforce management</li>
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Vendor coordination and contract administration</li>
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Centralized reporting and workforce analytics</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-12 pt-16">
                  <h3 className="text-4xl font-bold text-slate-900 tracking-tight">Why Businesses Choose Us</h3>
                  <div className="space-y-6">
                    <ul className="space-y-4 pl-4 text-slate-600 font-bold">
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#14918e]"></div> End-to-end support from recruitment to management</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#14918e]"></div> Scalable solutions for changing business needs</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#14918e]"></div> Deep industry expertise for faster, better hiring</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#14918e]"></div> Total compliance and administration handled for you</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 sticky top-32">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>

      <FAQSection items={[
        { q: 'Do you provide both technical and non-technical staff?', a: 'Yes. We offer a wide range of staffing solutions, including skilled technicians, operators, housekeeping, security, and administrative personnel.' },
        { q: 'Can we hire staff on a temporary basis?', a: 'Absolutely. We offer temporary staffing for short-term projects or peaks.' },
        { q: 'How do you ensure the quality of manpower?', a: 'Every candidate undergoes a rigorous screening process and skill assessments to ensure they meet the specific requirements of the role.' },
        { q: 'Do you offer replacement support if required?', a: 'Yes, we provide quality guarantees and replacement if the placed candidate does not meet your expectations within a specified period.' },
        { q: 'Are your staffing solutions industry compliant?', a: 'Yes, all our services are fully compliant with current labor laws and regulations, including HR documentation, contract management, and statutory benefits.' }
      ]} />
    </div>
  );

  const PayrollServiceDetail = () => (
    <div className="animate-in slide-in-from-right duration-500 bg-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center text-white text-center">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="Payroll Management" />
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]"></div>
        </div>
        <div className="relative z-10 max-w-6xl px-4 space-y-10">
          <h1 className="text-5xl md:text-9xl font-bold tracking-tight">Payroll Management Services</h1>
          <p className="text-xl md:text-2xl font-medium leading-relaxed max-w-4xl mx-auto text-slate-200">Streamline your payroll operations with accuracy, compliance, and complete peace of mind. We manage every aspect of payroll so you can focus on growing your business.</p>
        </div>
      </section>

      {/* Intro & Benefits Grid matched to screenshots */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-7 space-y-12">
              <div className="space-y-8">
                <h3 className="text-4xl font-bold text-slate-900">Why Mepdream operation solutions Pvt Ltd. for Payroll Management</h3>
                <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
                  Managing payroll doesn't have to be complicated. Our end-to-end payroll management services turn a time-consuming task into a smooth, accurate, and fully compliant process. From salary calculations to statutory filings, we handle everything so your team can focus on growing the business, not chasing numbers.
                </p>
              </div>

              <div className="space-y-12">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Our Solutions & Benefits</h3>
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                  {[
                    { icon: <CreditCard />, title: 'Accurate Payroll Processing', desc: 'Timely salary disbursements without errors or delays.' },
                    { icon: <ShieldCheck />, title: 'Tax & Statutory Compliance', desc: 'We handle PF, ESI, TDS, and other statutory obligations so you stay worry-free.' },
                    { icon: <Settings />, title: 'Customizable Payroll Structures', desc: 'Flexible to match your company\'s policies and employee needs.' },
                    { icon: <Lock />, title: 'Secure Data Management', desc: 'Advanced systems to ensure complete confidentiality and data security.' },
                    { icon: <Calendar />, title: 'Leave & Attendance Integration', desc: 'Automated sync with HR records for precise calculations.' },
                    { icon: <Users />, title: 'End-to-End Employee Support', desc: 'From payslips to queries, we manage the entire payroll communication.' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start group">
                      <div className="w-6 h-6 rounded-full bg-[#14918e]/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle2 className="w-4 h-4 text-[#14918e]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight mb-1">{item.title}:</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Breakdown Section matched to screenshots */}
              <div className="space-y-12 pt-16">
                <h3 className="text-4xl font-bold text-slate-900 tracking-tight">What We Offer</h3>
                
                <div className="space-y-16">
                  <div className="space-y-4">
                    <h4 className="text-2xl font-bold text-slate-900">1. Accurate Payroll Processing</h4>
                    <p className="text-slate-600">Say goodbye to manual errors. We use automated systems to ensure every employee is paid correctly and on time.</p>
                    <ul className="space-y-4 pl-4 text-slate-500">
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Automated calculations for base pay, bonuses, overtime, and variable components</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Real-time deductions for PF, ESI, TDS, and Professional Tax</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Centralized payroll for multiple locations with easy reporting</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-2xl font-bold text-slate-900">2. Full Compliance Management</h4>
                    <p className="text-slate-600">Staying compliant with ever-changing laws can be overwhelming. We keep your payroll aligned with all statutory and tax regulations.</p>
                    <ul className="space-y-4 pl-4 text-slate-500">
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> End-to-end statutory compliance with labor and tax laws</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Automated generation and filing of government forms and returns</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Regular updates to reflect changes in tax rules and regulations</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-2xl font-bold text-slate-900">3. Employee Self-Service Portal</h4>
                    <p className="text-slate-600">Empower your workforce with a simple, digital payroll experience.</p>
                    <ul className="space-y-4 pl-4 text-slate-500">
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Easy access to pay slips, tax documents, and salary certificates</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Leave and attendance integration for accurate calculations</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Mobile-friendly access so employees can view their information anytime</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-2xl font-bold text-slate-900">4. Advanced Reporting & Analytics</h4>
                    <p className="text-slate-600">Get real-time insights that help you make better business decisions.</p>
                    <ul className="space-y-4 pl-4 text-slate-500">
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Comprehensive payroll reports and cost analytics</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Department-wise, location-wise, and project-wise breakdowns</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Automated alerts for compliance deadlines and irregularities</li>
                    </ul>
                  </div>
                </div>

                {/* Tailored Solutions Section matched to screenshots */}
                <div className="space-y-12 pt-16">
                  <h3 className="text-4xl font-bold text-slate-900 tracking-tight">Tailored Solutions for Every Industry</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">Different industries have unique payroll needs. We customize our services to fit your sector's requirements.</p>
                  
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <h4 className="text-2xl font-bold text-slate-900">Pharmaceutical Companies</h4>
                      <ul className="space-y-4 pl-4 text-slate-500">
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Manage complex shift differentials and research-based incentives</li>
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Ensure industry-specific regulatory compliance</li>
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Handle flexible and remote work allowances with ease</li>
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Manage performance-based bonuses and retention programs</li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-2xl font-bold text-slate-900">Manufacturing Units</h4>
                      <ul className="space-y-4 pl-4 text-slate-500">
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Handle detailed overtime calculations and shift premiums</li>
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Process production incentives and safety bonuses</li>
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Manage payroll in line with union agreements and labor laws</li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-2xl font-bold text-slate-900">Retail & Malls</h4>
                      <ul className="space-y-4 pl-4 text-slate-500">
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Manage commission structures and sales incentives</li>
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Handle seasonal and part-time workforce payroll</li>
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Process multi-location payroll with varying regional regulations</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-12 pt-16">
                  <h3 className="text-4xl font-bold text-slate-900 tracking-tight">Why Businesses Choose Us</h3>
                  <div className="space-y-6">
                    <ul className="space-y-4 pl-4 text-slate-600 font-bold">
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#14918e]"></div> Accuracy you can rely on</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#14918e]"></div> Compliance without the headache</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#14918e]"></div> Employee satisfaction through transparency</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#14918e]"></div> Actionable insights from detailed analytics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 sticky top-32">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>

      <FAQSection items={[
        { q: 'Do you handle statutory compliance as part of payroll?', a: 'Yes, we manage all statutory obligations like PF, ESI, PT, TDS, and other applicable regulations to keep your business fully compliant.' },
        { q: 'Can your payroll system integrate with our existing HR software?', a: 'Absolutely. Our system is designed for seamless integration with major HRMS and attendance management platforms.' },
        { q: 'How secure is employee payroll data?', a: 'Security is our top priority. We use enterprise-level encryption and secure multi-layered systems to protect all sensitive data.' },
        { q: 'Do you provide payroll services for contract and temporary staff as well?', a: 'Yes, we provide specialized payroll management for full-time, contract, and temporary workforces.' },
        { q: 'Can you scale payroll services for growing teams?', a: 'Our services are fully scalable. Whether you have 50 employees or 5,000, we adapt as your business grows.' }
      ]} />
    </div>
  );

  const AboutView = () => (
    <div className="animate-in slide-in-from-right duration-500 bg-white">
      <section className="relative h-[80vh] flex items-center justify-center text-white text-center">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="Team" />
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]"></div>
        </div>
        <div className="relative z-10 max-w-6xl px-4"><h1 className="text-6xl md:text-9xl font-bold tracking-tight">Why Mepdream</h1></div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-16 tracking-tight">Our Story</h2>
          <div className="space-y-8 max-w-5xl mx-auto">
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed">Established in 1995, Mepdream operation solutions Pvt Ltd has evolved from a specialist in MEP Engineering to a diversified conglomerate, trusted for delivering excellence with every project.</p>
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed">In addition to our core MEP expertise, our Trading division is a long-standing partner and distributor of high-quality electrical products from leading brands like Lapp Cables and Accuride. With our expansion into new verticals, including Staffing Solutions and Payroll Management, we offer integrated services to support our clients' growing needs.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-[#14918e] p-16 rounded-[40px] text-white space-y-6 flex flex-col items-center text-center shadow-xl">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4"><Target className="w-10 h-10" /></div>
              <h3 className="text-4xl md:text-5xl font-bold">Our Mission</h3>
              <p className="text-white/90 text-lg leading-relaxed">Emerge as an organization adapting to the dynamic business ecosystem, committed to serve and enrich all stakeholders.</p>
            </div>
            <div className="bg-[#14918e] p-16 rounded-[40px] text-white space-y-6 flex flex-col items-center text-center shadow-xl">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4"><Eye className="w-10 h-10" /></div>
              <h3 className="text-4xl md:text-5xl font-bold">Our Vision</h3>
              <p className="text-white/90 text-lg leading-relaxed">To deliver innovative products & services consistently, establishing a trusted and reliable brand bringing sustained benefit.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-7xl font-bold text-center text-slate-900 mb-20 tracking-tight">Our Competitive Edge</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {[
              { title: 'Industry Expertise', text: 'Powered by over 3,000 certified professionals managing complex mechanical, electrical, and plumbing projects.' },
              { title: 'Compliance Excellence', text: 'Robust framework ensuring installations and maintenance meet the highest safety and regulatory standards.' },
              { title: 'Technology Led', text: 'In-house digital platforms providing real-time visibility and control over all core processes.' },
              { title: 'Safety & Sustainability', text: 'Optimizing resource efficiency through innovative practices and energy-saving measures.' }
            ].map((edge, i) => (
              <div key={i} className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#14918e] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h4 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">{edge.title}</h4>
                <p className="text-slate-500 text-lg leading-relaxed">{edge.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const IndustriesView = () => (
    <div className="animate-in slide-in-from-right duration-500 pt-12 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <button onClick={() => navigateTo(Section.HOME)} className="flex items-center gap-2 text-blue-600 font-bold mb-8 hover:gap-3 transition-all"><ArrowLeft className="w-4 h-4" /> Back to Home</button>
        <div className="text-center mb-16"><h2 className="text-[#14918e] font-bold uppercase tracking-widest text-xs mb-4">Industries We Serve</h2><h3 className="text-3xl md:text-5xl font-bold text-slate-900 font-heading">Versatile expertise tailored for every sector.</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INDUSTRIES_DATA.map((ind, i) => (
            <div key={i} className="bg-white rounded-[32px] overflow-hidden group hover:shadow-xl transition-all border border-slate-100 flex flex-col">
              <div className="h-64 relative overflow-hidden">
                <img src={ind.image} alt={ind.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white"><h5 className="font-bold text-xl">{ind.name}</h5></div>
              </div>
              <div className="p-8"><p className="text-slate-500 text-sm leading-relaxed mb-6">{ind.description}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const HomeView = () => {
    const [currentBg, setCurrentBg] = useState(0);
    const backgroundImages = [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1510627489930-0c1b0ba8fa75?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=2000'
    ];

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="animate-in fade-in duration-500">
        <section className="relative overflow-hidden h-[95vh] md:h-[85vh] text-white flex items-center">
          {/* Background Image Slider */}
          {backgroundImages.map((img, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${currentBg === idx ? 'opacity-100' : 'opacity-0'}`}
            >
              <img src={img} className="w-full h-full object-cover scale-105" alt={`Building Background ${idx}`} />
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"></div>
            </div>
          ))}

          {/* Hero Content matched to request */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
            <div className="max-w-4xl space-y-8">
              <h1 className="text-5xl md:text-8xl font-bold leading-tight drop-shadow-2xl">
                Mepdream operation solutions Pvt Ltd.
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl drop-shadow-lg font-medium">
                Delivering end-to-end engineering and maintenance solutions that keep your infrastructure running <span className="font-bold underline decoration-[#14918e] underline-offset-8">smarter, safer, and longer</span>.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button onClick={() => navigateTo(Section.SERVICES)} className="bg-[#14918e] text-white px-10 py-5 rounded-xl font-bold flex items-center gap-3 hover:bg-[#117a78] transition-all group text-lg shadow-xl shadow-black/20">
                  Explore Services <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
                <button onClick={() => navigateTo(Section.CONTACT)} className="bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 text-white px-10 py-5 rounded-xl font-bold transition-all text-lg">
                  Enquire Now
                </button>
              </div>
            </div>
          </div>

          {/* Slider Indicators */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {backgroundImages.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentBg(idx)}
                className={`w-12 h-1.5 rounded-full transition-all duration-500 ${currentBg === idx ? 'bg-[#14918e] w-20' : 'bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>
        </section>

        {/* Overview section */}
        <section className="py-32 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -skew-x-12 translate-x-1/2 -z-0"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
                  25+ Years of Trusted Partnership in Engineering
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Mepdream operation solutions Pvt Ltd. has been at the forefront of technical excellence since 1995. We don't just fix problems; we optimize performance. Our end-to-end approach ensures that your mechanical, electrical, and plumbing systems are always at peak health.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-4xl font-bold text-[#14918e] mb-1">3000+</div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Certified Pros</div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-4xl font-bold text-[#14918e] mb-1">24/7</div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Support Response</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6 pt-12">
                  <div className="p-8 rounded-[40px] bg-slate-50 border border-slate-100 hover:shadow-lg transition-all cursor-pointer" onClick={() => navigateTo(Section.ABOUT)}>
                    <ShieldCheck className="w-12 h-12 text-[#14918e] mb-6" />
                    <h3 className="text-xl font-bold mb-2 text-slate-900">Safety First</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">Uncompromising standards in every project and installation.</p>
                  </div>
                  <div className="p-8 rounded-[40px] bg-slate-50 border border-slate-100 hover:shadow-lg transition-all cursor-pointer" onClick={() => navigateTo(Section.SERVICES)}>
                    <Settings className="w-12 h-12 text-orange-500 mb-6" />
                    <h3 className="text-xl font-bold mb-2 text-slate-900">Customized Care</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">Tailored O&M strategies that match your facility's unique dna.</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="p-8 rounded-[40px] bg-slate-900 text-white shadow-2xl hover:scale-105 transition-all cursor-pointer group" onClick={() => navigateTo(Section.AI_ADVISOR)}>
                    <Zap className="w-12 h-12 text-yellow-400 mb-6 group-hover:animate-pulse" />
                    <h3 className="text-xl font-bold mb-2">AI Diagnostic</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Get instant technical advice from our virtual advisor.</p>
                    <div className="mt-6 flex items-center gap-2 text-yellow-400 font-bold text-xs">TRY ADVISOR <ArrowRight className="w-4 h-4" /></div>
                  </div>
                  <div className="p-8 rounded-[40px] bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
                    <Globe className="w-12 h-12 text-blue-600 mb-6" />
                    <h3 className="text-xl font-bold mb-2 text-slate-900">Pan-India Reach</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">Network hubs across major cities to support your operations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  const ServicesView = () => {
    if (selectedServiceId === 'mep-om') return <MEPServiceDetail />;
    if (selectedServiceId === 'staffing') return <StaffingServiceDetail />;
    if (selectedServiceId === 'payroll') return <PayrollServiceDetail />;

    return (
      <div className="animate-in fade-in duration-500">
        <section className="relative h-[85vh] flex items-center justify-center text-white">
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1558389186-438424b00a32?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="Services" />
            <div className="absolute inset-0 bg-slate-900/40"></div>
          </div>
          <div className="relative z-10 text-center space-y-8 max-w-6xl px-4">
            <h2 className="text-5xl md:text-9xl font-bold tracking-tight drop-shadow-2xl">Services</h2>
            <p className="text-xl md:text-2xl font-medium leading-relaxed max-w-4xl mx-auto">From precision-led MEP engineering to advanced manpower and payroll solutions.</p>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h3 className="text-4xl md:text-5xl font-bold mb-12">When you need expertise, we've got you covered</h3>
            <div className="mt-28 grid md:grid-cols-3 gap-12">
              {SERVICES_DATA.map((service) => (
                <div key={service.id} onClick={() => setSelectedServiceId(service.id)} className="group relative flex flex-col bg-white rounded-[24px] shadow-sm hover:shadow-2xl transition-all border border-slate-100 cursor-pointer p-8">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                      {service.id === 'mep-om' ? <Layers /> : service.id === 'staffing' ? <Users /> : <Briefcase />}
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 text-left leading-tight group-hover:text-blue-600">{service.title.replace(' – O & M', '')}</h4>
                  </div>
                  <img src={service.image} className="h-72 rounded-[20px] object-cover group-hover:scale-105 transition-transform" alt={service.title} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  };

  const AdvisorView = () => (
    <div className="animate-in zoom-in duration-500 pt-12 pb-24 min-h-[90vh] bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 flex flex-col">
        <button onClick={() => navigateTo(Section.HOME)} className="flex items-center gap-2 text-blue-400 font-bold mb-8"><ArrowLeft className="w-4 h-4" /> Exit Advisor</button>
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col h-[70vh] border border-slate-200">
          <div className="p-6 bg-slate-50 border-b flex justify-between items-center"><span className="font-bold text-slate-800 text-sm">MEPDREAM Virtual Advisor</span></div>
          <div className="flex-grow p-8 overflow-y-auto space-y-6">
            {chatMessages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-12 space-y-4">
                <Zap className="w-12 h-12" />
                <p>Hello! I am your Mepdream assistant. Describe any technical issue for safety tips and service advice.</p>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-[24px] px-6 py-4 text-sm ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-br-none' : 'bg-white text-slate-700 shadow-lg rounded-bl-none'}`}>{msg.content}</div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-400 rounded-[24px] px-6 py-4 text-sm shadow-lg rounded-bl-none flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Mepdream operation solutions Pvt Ltd. is thinking...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="p-6 border-t flex gap-3">
            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Describe your issue..." className="flex-grow bg-slate-50 border rounded-2xl px-5 py-3 outline-none" />
            <button disabled={isTyping} className="bg-blue-600 text-white p-3.5 rounded-2xl hover:bg-blue-700 disabled:opacity-50"><Send className="w-5 h-5" /></button>
          </form>
        </div>
      </div>
    </div>
  );

  const ContactView = () => (
    <div className="animate-in slide-in-from-right duration-500 pt-12 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <button onClick={() => navigateTo(Section.HOME)} className="flex items-center gap-2 text-blue-600 font-bold mb-8"><ArrowLeft className="w-4 h-4" /> Back to Home</button>
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="p-8 bg-white rounded-3xl shadow-sm"><Phone className="w-6 h-6 text-blue-600 mb-4" /><p className="text-xs font-bold uppercase text-slate-400">Call Us</p><a href="tel:9337225129" className="text-2xl font-bold">9337225129</a></div>
            <div className="p-8 bg-white rounded-3xl shadow-sm"><Mail className="w-6 h-6 text-blue-600 mb-4" /><p className="text-xs font-bold uppercase text-slate-400">Email Us</p><a href="mailto:mepdreamoperations.25@gmail.com" className="text-xl font-bold">mepdreamoperations.25@gmail.com</a></div>
            <div className="p-8 bg-white rounded-3xl shadow-sm"><MapPin className="w-6 h-6 text-blue-600 mb-4" /><p className="text-xs font-bold uppercase text-slate-400">Visit Us</p><address className="not-italic font-bold">Cyberabad, Rangareddy dist, 500019  https://maps.app.goo.gl/RH4Fu3LrWqxPJ7uz6?g_st=aw </address></div>
          </div>
          <div className="bg-white rounded-[40px] p-10 shadow-2xl">
            <h4 className="text-2xl font-bold mb-8">Send a Message</h4>
            <form className="space-y-6"><input type="text" className="w-full bg-slate-50 border rounded-xl px-5 py-4" placeholder="Your Name" /><input type="email" className="w-full bg-slate-50 border rounded-xl px-5 py-4" placeholder="Email Address" /><textarea className="w-full bg-slate-50 border rounded-2xl px-5 py-4 h-48" placeholder="Message"></textarea><button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold uppercase hover:bg-blue-700 transition-all">Submit</button></form>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-24 items-center">
            <div className="flex items-center cursor-pointer" onClick={() => navigateTo(Section.HOME)}><Logo /></div>
            <div className="hidden lg:flex items-center space-x-8 h-full">
              {Object.values(Section).map((s) => {
                if (s === Section.SERVICES) {
                  return (
                    <div key={s} className="relative h-full flex items-center" onMouseEnter={() => setIsServicesHovered(true)} onMouseLeave={() => setIsServicesHovered(false)}>
                      <button onClick={() => navigateTo(s)} className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 h-full ${currentPage === s ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>
                        {s.replace('_', ' ')} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isServicesHovered ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`absolute top-full left-0 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 transition-all z-[60] ${isServicesHovered ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                        {SERVICES_DATA.map((item) => (
                          <button key={item.id} onClick={() => { navigateTo(s); setSelectedServiceId(item.id); }} className="w-full text-left px-5 py-3.5 hover:bg-blue-50 flex items-center justify-between group">
                            <span className="text-[11px] font-bold text-slate-700 group-hover:text-blue-600 uppercase tracking-widest">{item.title}</span>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }
                return (
                  <button key={s} onClick={() => navigateTo(s)} className={`text-xs font-bold uppercase tracking-wider ${currentPage === s ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>{s.replace('_', ' ')}</button>
                );
              })}
              <button onClick={() => navigateTo(Section.CONTACT)} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase shadow-lg hover:bg-blue-700 transition-all">Inquire Now</button>
            </div>
            <div className="lg:hidden"><button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">{isMenuOpen ? <X /> : <Menu />}</button></div>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-24">
        {currentPage === Section.HOME && <HomeView />}
        {currentPage === Section.ABOUT && <AboutView />}
        {currentPage === Section.SERVICES && <ServicesView />}
        {currentPage === Section.INDUSTRIES && <IndustriesView />}
        {currentPage === Section.AI_ADVISOR && <AdvisorView />}
        {currentPage === Section.CONTACT && <ContactView />}
      </main>

      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Logo inverted />
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-8">© {new Date().getFullYear()} Mepdream operation solutions Pvt Ltd.</p>
        </div>
      </footer>

      {/* Floating Buttons */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
         <button 
          onClick={() => navigateTo(Section.AI_ADVISOR)}
          className="bg-white text-slate-900 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group relative border border-slate-100"
        >
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></div>
          </div>
          <Zap className="w-8 h-8 text-blue-600" />
        </button>
        <button 
          onClick={() => window.location.href = 'tel:9337225129'}
          className="bg-slate-900 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-slate-400"
        >
          <Phone className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
