import { Shield, Check, Clock, ShieldCheck, Mail, FileText } from 'lucide-react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function VerificationPage() {
  const steps = [
    {
      title: 'Email & Contact Verification',
      description: 'Confirm your email and mobile phone number to enable contact matching.',
      icon: Mail,
      status: 'complete',
    },
    {
      title: 'Official ID Upload',
      description: 'Securely upload your Passport, Driver License, or National ID. Your details are encrypted.',
      icon: FileText,
      status: 'pending',
    },
    {
      title: 'Review & Trusted Badge',
      description: 'Our safety team reviews documents within 24 hours. Once verified, get the blue badge!',
      icon: ShieldCheck,
      status: 'upcoming',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 pt-24 w-full">
        <div className="text-center space-y-4">
          <Shield className="h-16 w-16 text-primary mx-auto stroke-[1.5]" />
          <h1 className="text-4xl font-extrabold tracking-tight">Traveler Trust & Verification</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Travel safely with verified companions. Unverified users will not be able to join "Verified Only" trip groups.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-6 border border-border bg-card rounded-2xl shadow-sm relative overflow-hidden"
            >
              <div className="flex-none p-3 bg-secondary rounded-xl text-primary">
                <step.icon className="h-6 w-6" />
              </div>
              <div className="space-y-1 pr-12">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  {step.title}
                  {step.status === 'complete' && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold">
                      <Check className="h-3 w-3" /> Done
                    </span>
                  )}
                  {step.status === 'pending' && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-semibold">
                      <Clock className="h-3 w-3" /> Pending
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-secondary/50 rounded-2xl border border-border text-center space-y-4">
          <h4 className="font-bold text-foreground">Ready to start identity verification?</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Please make sure you have a clear picture or PDF of your government issued ID. Verification is processed by trusted privacy standards.
          </p>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-full text-sm shadow-sm transition-colors">
            Verify My ID
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
