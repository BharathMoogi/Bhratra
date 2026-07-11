import Link from 'next/link';
import { ShieldCheck, Zap, MessageCircle, Map } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Hero from '@/components/features/Hero';
import Footer from '@/components/shared/Footer';

const features = [
  {
    icon: ShieldCheck,
    title: 'Verified Travelers',
    description: 'Identity verification for every member to ensure a safe and trustworthy global network.',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    icon: Zap,
    title: 'Smart Matching',
    description: 'Our AI-powered algorithm connects you with people based on interests and travel style.',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
  {
    icon: MessageCircle,
    title: 'Secure Chat',
    description: 'Encrypted messaging to coordinate plans, share photos, and get to know your companions.',
    color: 'text-red-400',
    bg: 'bg-red-50',
  },
  {
    icon: Map,
    title: 'AI Trip Planner',
    description: 'Generate custom itineraries in seconds tailored to your group\'s unique preferences.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <Hero />

      {/* "Everything You Need" Feature Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-14 space-y-3">
            <p className="text-xs font-bold text-blue-500 uppercase tracking-[0.2em]">
              Designed for Discovery
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Everything You Need for the<br className="hidden sm:block" /> Perfect Journey
            </h2>
          </div>

          {/* 4-column feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
              >
                <div className={`inline-flex p-2.5 rounded-xl ${feature.bg} mb-4`}>
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
