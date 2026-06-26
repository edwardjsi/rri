'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Mail, User, Phone, CheckCircle2 } from 'lucide-react';
import { questions, getArchetype } from '@/data/questions';
import { submitAssessment } from '@/utils/api';
import { v4 as uuidv4 } from 'uuid';

type AppState = 'LANDING' | 'ASSESSMENT' | 'LEAD_CAPTURE' | 'RESULTS';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('LANDING');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionId] = useState(() => {
    // Basic uuid generation since we didn't install uuid package yet, but wait, let's just make it simpler
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  });

  const question = questions[currentQuestionIdx];
  const progress = ((currentQuestionIdx + 1) / questions.length) * 100;

  const calculateTotalScore = () => {
    let total = 0;
    Object.values(answers).forEach((score) => {
      total += score;
    });
    return total;
  };

  const handleStart = () => {
    setAppState('ASSESSMENT');
  };

  const handleOptionSelect = (score: number) => {
    setAnswers({ ...answers, [question.id]: score });

    if (currentQuestionIdx < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIdx(currentQuestionIdx + 1);
      }, 300);
    } else {
      setTimeout(() => {
        setAppState('LEAD_CAPTURE');
      }, 300);
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Calculate Score
    const finalScore = calculateTotalScore();

    const payload = {
      sessionId,
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
      answers,
      score: finalScore
    };

    try {
      await submitAssessment(payload);
    } catch (error) {
      console.error('Failed to submit, continuing to results anyway.', error);
    } finally {
      setIsSubmitting(false);
      setAppState('RESULTS');
    }
  };

  const renderLanding = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center max-w-2xl mx-auto"
    >
      <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-6">
        <ShieldCheck className="w-8 h-8 text-blue-600" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6">
        The Sovereign Retirement Reality Check™
      </h1>
      <p className="text-xl text-gray-600 mb-8 leading-relaxed">
        Are you building "Sovereign" wealth or just "fragile" savings? Reveal hidden fragilities in your financial life in 3 minutes.
      </p>
      <button
        onClick={handleStart}
        className="group inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out transform hover:-translate-y-1"
      >
        Start Reality Check
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </button>
      <p className="mt-4 text-sm text-gray-500">15 Questions • 3 Minutes • Zero Obligations</p>
    </motion.div>
  );

  const renderAssessment = () => (
    <motion.div
      key={currentQuestionIdx}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
          <span>{question.category}</span>
          <span>Question {currentQuestionIdx + 1} of {questions.length}</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: `${((currentQuestionIdx) / questions.length) * 100}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8 leading-snug">
        {question.text}
      </h2>

      {/* Options */}
      <div className="space-y-4">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleOptionSelect(option.score)}
            className="w-full text-left p-6 bg-white border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-blue-500 flex items-center justify-center mr-4">
                <div className="w-3 h-3 rounded-full bg-blue-500 opacity-0 group-active:opacity-100 transition-opacity" />
              </div>
              <span className="text-lg text-gray-700 font-medium group-hover:text-gray-900">{option.text}</span>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );

  const renderLeadCapture = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
          <CheckCircle2 className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analysis Complete</h2>
        <p className="text-gray-600">Enter your details to reveal your Sovereign Retirement Archetype and Fragility Score.</p>
      </div>

      <form onSubmit={handleSubmitLead} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              required
              type="text"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="John Doe"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              required
              type="email"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="john@example.com"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="(555) 123-4567"
              value={userInfo.phone}
              onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 text-white font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-lg transition-all disabled:opacity-70 flex justify-center items-center"
        >
          {isSubmitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            "Reveal My Score"
          )}
        </button>
        <p className="text-xs text-center text-gray-400 mt-4">Your information is secure and will never be shared.</p>
      </form>
    </motion.div>
  );

  const renderResults = () => {
    const finalScore = calculateTotalScore();
    const archetype = getArchetype(finalScore);
    const maxScore = questions.length * 5;
    const scorePercentage = Math.round((finalScore / maxScore) * 100);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl mx-auto"
      >
        <div className="p-8 rounded-3xl bg-white border-4 text-center mb-8 shadow-xl" style={{ borderLeftColor: archetype.borderColor }}>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-2">Your Sovereign Archetype</p>
          <h2 className={`text-4xl md:text-5xl font-extrabold ${archetype.titleColor} mb-4 drop-shadow-sm`}>
            {archetype.title}
          </h2>
          <div className="flex justify-center items-end gap-2 mb-6">
            <span className="text-6xl md:text-7xl font-black text-gray-900 leading-none drop-shadow-sm">{scorePercentage}</span>
            <span className="text-xl font-bold text-gray-500 mb-1">/ 100</span>
          </div>
          <p className="text-lg text-gray-800 max-w-2xl mx-auto font-medium leading-relaxed">
            {archetype.description}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 mb-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">The Next Step:</h3>
          <p className="text-xl text-blue-700 font-semibold mb-6">
            {archetype.cta}
          </p>
        </div>

        {/* Schedule Consultation Call to Action */}
        <div className="mt-12 p-8 bg-gradient-to-br from-slate-900 to-black rounded-3xl text-white shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="text-center mb-8 relative z-10">
            <h3 className="text-3xl font-bold mb-4 tracking-tight">Book Your 'Sovereign Retirement Roadmap' Call</h3>
            <p className="text-slate-400 max-w-xl mx-auto text-lg mb-4">
              In this 30-minute diagnosis, we will:
            </p>
            <ul className="text-left text-slate-300 max-w-md mx-auto space-y-2 mb-8">
              <li>1. Review your specific 'Fragility Score'.</li>
              <li>2. Identify the exact gaps in your Protection, AI, and Market layers.</li>
              <li>3. Show you how to build a ₹4 Crore timeline that lets you sleep at night.</li>
            </ul>
          </div>

          {/* Live Scheduling Widget (Calendly iframe) */}
          <div className="w-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden min-h-[700px] relative z-10">
            <iframe
              src="https://calendly.com/immanuelsantosh/30min"
              width="100%"
              height="700"
              frameBorder="0"
              title="Schedule a Sovereign Blueprint Consultation"
            ></iframe>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      {/* Dynamic Header */}
      <header className="fixed top-0 inset-x-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 flex items-center px-6 lg:px-12">
        <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
            R
          </div>
          <span className="hidden sm:inline-block">RealityCheck™</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="pt-32 pb-24 px-6 md:px-12 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <AnimatePresence mode="wait">
          {appState === 'LANDING' && renderLanding()}
          {appState === 'ASSESSMENT' && renderAssessment()}
          {appState === 'LEAD_CAPTURE' && renderLeadCapture()}
          {appState === 'RESULTS' && renderResults()}
        </AnimatePresence>
      </div>
    </main>
  );
}
