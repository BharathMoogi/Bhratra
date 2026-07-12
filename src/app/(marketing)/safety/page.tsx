import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ShieldCheck, UserCheck, HeartHandshake, FileCheck } from 'lucide-react';

export default function SafetyPage() {
  const guidelines = [
    {
      title: 'Government ID Check',
      description: 'Every user can verify their account by securely uploading a Passport, Driver License, or National ID. Once approved, they receive a permanent trust checkmark.',
      icon: ShieldCheck,
      color: 'text-primary bg-blue-50',
    },
    {
      title: 'Companion Match Compatibility',
      description: 'Find companions based on driving speed, trekking pace, vehicle specs, smoking preference, and dietary habits to minimize conflicts during travel.',
      icon: UserCheck,
      color: 'text-forest-green bg-green-50',
    },
    {
      title: 'Mutual Reviews & Trust Scores',
      description: 'Travelers rate and write reviews for each other after completing a journey. Bad behavior is reported to admins, ensuring high community safety standards.',
      icon: HeartHandshake,
      color: 'text-sunset-orange bg-orange-50',
    },
    {
      title: 'Verified Only Expeditions',
      description: 'Trip organizers can enable a setting restricting applications strictly to verified badge holders. This keeps the circle safe and verified.',
      icon: FileCheck,
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold text-rose-500 tracking-widest uppercase">Safety Guidelines</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            Trust & Community Protection
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Safety isn't an afterthought. It's built into every feature of the Bhratra platform.
          </p>
        </div>

        {/* Guidelines List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {guidelines.map((g, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
              <div className={`p-3 rounded-xl w-fit ${g.color}`}>
                <g.icon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-slate-900">{g.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{g.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Safety Warning/Alert Card */}
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl flex items-start gap-4">
          <ShieldAlert className="h-10 w-10 text-rose-500 shrink-0 mt-1" />
          <div className="space-y-1">
            <h4 className="font-bold text-rose-900 text-sm">Security & Privacy First</h4>
            <p className="text-xs text-rose-700/80 leading-relaxed">
              All government verification documents are processed with end-to-end encryption. Original documentation scans are stored securely in encrypted private buckets and are never shared publicly or with other travelers.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-4">
          <p className="text-sm text-slate-500 mb-4">Want to secure your profile status?</p>
          <Link
            href="/signup"
            className="bg-mountain-blue hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full text-sm shadow-md transition-colors"
          >
            Get Verified Badge
          </Link>
        </div>
      </div>
    </div>
  );
}
