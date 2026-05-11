
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SERVICES, PROJECTS, CORE_VALUES } from '../constants';

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string; links?: { label: string; href: string }[] }[]>([
    { role: 'model', text: "Hello! Welcome to Polaris Integrated and Geosolutions Limited. I'm Polaris Assistant, your dedicated digital receptionist. How can I assist you today? 👋" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userData, setUserData] = useState<{ name?: string; email?: string }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice Interaction Logic
  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Find a professional-sounding voice if possible
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google UK English Female') || v.name.includes('Female') || v.lang === 'en-GB');
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.pitch = 1.1;
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      // Automatically send the message
      handleSendMessage(null, transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.start();
  };



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent | null, directText?: string) => {
    if (e) e.preventDefault();
    const textToSend = directText || input.trim();
    if (!textToSend || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsLoading(true);

    // Stop speaking if user interrupts
    window.speechSynthesis.cancel();
    setIsSpeaking(false);


    // Basic extraction logic for Name and Email
    let updatedData = { ...userData };

    // Simple Email Regex
    const emailMatch = textToSend.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      updatedData.email = emailMatch[0];
    }

    // Name extraction (very basic: "My name is [Name]")
    const nameMatch = textToSend.match(/(?:my name is|i am|this is)\s+([a-zA-Z\s]+)/i);
    if (nameMatch) {
      updatedData.name = nameMatch[1].trim();
    }


    if (emailMatch || nameMatch) {
      setUserData(updatedData);
    }


    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API Key not found in environment variables");
      }

      console.log("Chatbot Debug: Initializing Gemini with Key Status:", !!apiKey);

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: `
        IDENTITY & TONE:
        - Your name is Polaris Assistant. You are the professional, warm, and empathetic digital receptionist for PIGL (Polaris Integrated and Geosolutions Limited).
        - You speak like a dedicated customer relations agent—helpful, precise, and never robotic.
        - You are the first point of contact for clients, partners, and job seekers.

        PRIMARY OBJECTIVES:
        1. ASSIST: Answer questions about PIGL using the provided context.
        2. LEAD CAPTURE: If a user has a specific business inquiry or request, naturally ask for their name and email/phone so a human representative can follow up. 
           - Example: "I'd love to have one of our engineers reach out to you about that. May I get your name and email address?"
        3. ROUTE: Guide users to relevant sections of the site (#/services, #/projects, #/contact).

        STRICT CONVERSATIONAL RULES:
        - Keep responses concise but polished.
        - Avoid long lists. Summarize and link to the full page.
        - NEVER sound like a generic AI. Use phrases like "Certainly," "I can help with that," "It's a pleasure to assist you."
        - Avoid heavy markdown.

        CONTEXT:
        - Services: ${SERVICES.map(s => s.title).join(', ')}. We specialize in 3D Reality Capture (Leica Partners), Pipeline Integrity, Civil Works, and Geosolutions.
        - Projects: ${PROJECTS.map(p => p.title).join(', ')}. We have delivered for Chevron, TotalEnergies, Aradel, etc.
        - Authority: 20+ years of operation, ISO 9001:2015 certified, Authorized Leica Geosystems Partner in Nigeria.
        - Location: Based in Port Harcourt, Nigeria.

        USER DATA STATUS:
        Current User Info: ${updatedData.name ? `Name: ${updatedData.name}` : 'Unknown'}, ${updatedData.email ? `Email: ${updatedData.email}` : 'Unknown'}.
        If data is missing and the conversation requires it, ask politely.
      `
      });

      const chat = model.startChat({
        history: messages.slice(1).map(m => ({
          role: m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.text }]
        })),
        generationConfig: {
          temperature: 0.7,
        },
      });

      const result = await chat.sendMessage(textToSend);
      const aiText = result.response.text();

      // Speak the response
      speak(aiText);

      const suggestedLinks: { label: string; href: string }[] = [];
      const lowerText = aiText.toLowerCase();
      if (lowerText.includes('service') || lowerText.includes('solutions')) suggestedLinks.push({ label: 'Explore Services', href: '#/services' });
      if (lowerText.includes('project') || lowerText.includes('case study')) suggestedLinks.push({ label: 'View Projects', href: '#/projects' });
      if (lowerText.includes('career') || lowerText.includes('job')) suggestedLinks.push({ label: 'Careers', href: '#/careers' });
      if (lowerText.includes('contact') || lowerText.includes('call') || lowerText.includes('office')) suggestedLinks.push({ label: 'Get in Touch', href: '#/contact' });

      setMessages(prev => [...prev, { role: 'model', text: aiText, links: suggestedLinks }]);
    } catch (error: any) {
      console.error('Chatbot Error:', error);
      let errorMessage = "I hit a snag. 😅 Reach us at info@polarisigl.com while I fix myself!";
      if (error.message?.includes('API Key')) errorMessage += " (Configuration Error: API Key missing)";
      else if (error.message?.includes('fetch')) errorMessage += " (Network Error: Please check connection)";
      else errorMessage += ` (Error: ${error.message || 'Unknown'})`;

      setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-emerald-600 text-white rounded-full shadow-2xl z-[60] flex items-center justify-center hover:bg-orange-600 hover:scale-110 transition-all duration-300"
      >
        {isOpen ? (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <div className="relative">
            <span className="font-black text-xl">Z</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-ping"></span>
          </div>
        )}
      </button>

      <div className={`fixed bottom-24 right-6 w-[90vw] sm:w-[420px] h-[650px] max-h-[75vh] bg-white shadow-3xl z-[60] flex flex-col rounded-[2.5rem] overflow-hidden border border-slate-200 transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95 pointer-events-none'}`}>
        <div className="bg-emerald-950 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-emerald-700 flex items-center justify-center font-black rounded-xl text-lg">P</div>
            <div>
              <p className="font-black text-sm tracking-tight">Polaris Assistant</p>
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">PIGL Digital Reception</span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/50 scrollbar-hide">
          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="flex flex-col space-y-2 animate-in slide-in-from-bottom-2 duration-700">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1 mb-1">Quick Actions</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Request a Quote", text: "I'd like to request a quote for a project." },
                  { label: "3D Scanning", text: "Tell me about your 3D reality capture services." },
                  { label: "Company Profile", text: "Can I see your company profile?" },
                  { label: "Careers", text: "How can I join the PIGL team?" }
                ].map((action, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(action.text);
                    }}
                    className="px-4 py-2 bg-white border border-slate-200 text-[11px] font-bold text-emerald-900 rounded-full hover:border-emerald-500 hover:bg-emerald-50 transition-all shadow-sm"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[88%] p-5 shadow-sm ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-[1.8rem] rounded-tr-sm font-medium' : 'bg-white border border-slate-100 text-slate-800 rounded-[1.8rem] rounded-tl-sm'}`}>
                <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                {msg.links && msg.links.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {msg.links.map((link, lIdx) => (
                      <a
                        key={lIdx}
                        href={link.href}
                        className="px-4 py-2 bg-emerald-50 text-emerald-900 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 hover:text-white transition-all rounded-full border border-emerald-100"
                        onClick={() => { if (link.href.startsWith('#')) setIsOpen(false); }}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 p-4 rounded-2xl flex space-x-1.5 shadow-sm">
                <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 bg-white border-t border-slate-50">
          <form onSubmit={(e) => handleSendMessage(e)} className="relative flex items-center space-x-2">
            <div className="relative flex-grow">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening..." : "Message Polaris Assistant..."}
                className={`w-full pl-6 pr-14 py-4 bg-slate-50 border ${isListening ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-100'} focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-[14px] font-medium rounded-full placeholder-slate-400 transition-all`}
              />
              <button
                type="button"
                onClick={startListening}
                className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all ${isListening ? 'bg-orange-500 text-white animate-pulse' : 'bg-slate-200 text-slate-500 hover:bg-emerald-100 hover:text-emerald-700'}`}
                title="Speak to Assistant"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 00-3 3v8a3 3 0 006 0V5a3 3 0 00-3-3z" />
                </svg>
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`p-3 bg-emerald-600 text-white rounded-full hover:bg-orange-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg ${isSpeaking ? 'ring-4 ring-emerald-500/20' : ''}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </button>
          </form>

          <div className="mt-4 flex items-center justify-center space-x-6 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            <a href="tel:+2348097081333" className="hover:text-emerald-600 flex items-center">
              <span className="mr-1.5">📞</span> Phone
            </a>
            <span className="opacity-20">|</span>
            <a href="#/contact" className="hover:text-emerald-600 flex items-center">
              <span className="mr-1.5">🤝</span> Quote
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChatbot;
