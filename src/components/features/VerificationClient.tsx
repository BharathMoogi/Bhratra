'use client';

import React, { useState, useTransition, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Check, Clock, ShieldCheck, Mail, FileText, 
  Upload, X, AlertCircle, Loader2, Sparkles, CheckCircle2 
} from 'lucide-react';
import { submitVerificationAction } from '@/app/verifications/actions';

interface VerificationClientProps {
  initialProfile: {
    isVerified: boolean;
    verificationDoc: string | null;
  } | null;
}

export default function VerificationClient({ initialProfile }: VerificationClientProps) {
  const [isVerified, setIsVerified] = useState(initialProfile?.isVerified || false);
  const [isOpen, setIsOpen] = useState(false);
  const [docType, setDocType] = useState('PASSPORT');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      status: isVerified ? 'complete' : 'pending',
    },
    {
      title: 'Review & Trusted Badge',
      description: 'Our safety team reviews documents within 24 hours. Once verified, get the blue badge!',
      icon: ShieldCheck,
      status: isVerified ? 'complete' : 'upcoming',
    },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const validateFile = (file: File) => {
    setError(null);
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid JPEG, PNG, or PDF document.');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size must be less than 5MB.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select or drag an ID document to upload.');
      return;
    }

    setError(null);
    const formData = new FormData();
    formData.append('idDocument', selectedFile);
    formData.append('docType', docType);

    startTransition(async () => {
      const res = await submitVerificationAction(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setIsVerified(true);
        setIsOpen(false);
        setSelectedFile(null);
      }
    });
  };

  return (
    <div className="space-y-10">
      {/* ─── TITLE / SUBTITLE ─── */}
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <Shield className="h-16 w-16 text-primary mx-auto stroke-[1.25]" />
          {isVerified && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="absolute -bottom-1 -right-1 bg-forest-green text-white p-1 rounded-full border-2 border-white"
            >
              <Check className="h-4 w-4 stroke-[3]" />
            </motion.div>
          )}
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Traveler Trust & Verification
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
          Verify your identity to build trust within the Bhratra community. Verified travelers receive a premium blue verification badge and can join exclusive verified-only expeditions.
        </p>
      </div>

      {/* ─── DYNAMIC STEP LIST ─── */}
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-4 p-5 border rounded-2xl transition-all duration-300 ${
              step.status === 'complete' 
                ? 'bg-emerald-500/[0.03] border-emerald-500/20' 
                : 'bg-white border-slate-200/80 shadow-sm'
            }`}
          >
            <div className={`flex-none p-3 rounded-xl ${
              step.status === 'complete' 
                ? 'bg-emerald-500/10 text-emerald-600' 
                : step.status === 'pending'
                ? 'bg-amber-500/10 text-amber-600'
                : 'bg-slate-100 text-slate-400'
            }`}>
              <step.icon className="h-5 w-5" />
            </div>
            <div className="space-y-1 flex-1 pr-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 flex-wrap">
                {step.title}
                {step.status === 'complete' && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold tracking-wide uppercase">
                    <Check className="h-2.5 w-2.5 stroke-[3]" /> Verified
                  </span>
                )}
                {step.status === 'pending' && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold tracking-wide uppercase">
                    <Clock className="h-2.5 w-2.5" /> Pending Upload
                  </span>
                )}
                {step.status === 'upcoming' && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold tracking-wide uppercase">
                    Locked
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── DYNAMIC BOTTOM CTA SECTION ─── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 shadow-md">
        <AnimatePresence mode="wait">
          {!isVerified ? (
            <motion.div
              key="unverified"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="p-6 sm:p-8 bg-gradient-to-br from-emerald-500/[0.04] via-transparent to-transparent text-center space-y-5"
            >
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 text-lg">Ready to start identity verification?</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Please upload a clear copy of a government-issued photo ID (Passport, Driving License, or National ID Card) to unlock full access.
                </p>
              </div>

              {!isOpen ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsOpen(true)}
                  className="bg-primary hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full text-sm shadow-md transition-colors"
                >
                  Verify My ID
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-left bg-white border border-slate-200 p-6 rounded-2xl max-w-lg mx-auto shadow-inner space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-sm font-bold text-slate-800">Secure Document Upload</span>
                    <button 
                      onClick={() => { setIsOpen(false); setError(null); setSelectedFile(null); }}
                      className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-600 font-semibold flex items-center gap-1.5">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Doc Type Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Document Type</label>
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="PASSPORT">Passport</option>
                        <option value="DRIVERS_LICENSE">Driver's License</option>
                        <option value="NATIONAL_ID">National ID / Government ID Card</option>
                      </select>
                    </div>

                    {/* Drag and Drop Zone */}
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                        dragActive 
                          ? 'border-primary bg-primary/[0.02]' 
                          : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        accept="image/jpeg,image/png,application/pdf"
                        className="hidden"
                      />

                      {selectedFile ? (
                        <div className="space-y-2">
                          <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-slate-800 line-clamp-1">{selectedFile.name}</p>
                            <p className="text-[10px] text-slate-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-500 hover:text-rose-600"
                          >
                            <X className="h-3 w-3" /> Remove File
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 text-slate-400 mx-auto" />
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-slate-700">
                              <span className="text-primary hover:underline">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-[10px] text-slate-400">JPEG, PNG, or PDF up to 5MB</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => { setIsOpen(false); setError(null); setSelectedFile(null); }}
                        className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isPending || !selectedFile}
                        className="flex-1 bg-primary hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          'Submit Verification'
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="verified"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 sm:p-8 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent text-center space-y-4"
            >
              <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600">
                <ShieldCheck className="h-6 w-6 stroke-[2]" />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-500 fill-amber-500 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-emerald-800 text-lg">Identity Verified successfully!</h4>
                <p className="text-xs text-emerald-700/80 max-w-sm mx-auto leading-relaxed">
                  Your government ID has been securely processed and your trust badge is active. You are fully eligible to join and host verified-only travel groups.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
