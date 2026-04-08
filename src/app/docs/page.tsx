"use client";

import React from 'react';
import { 
  BookOpen, 
  Settings, 
  Users, 
  GraduationCap, 
  FileText, 
  Server, 
  Code, 
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const DOC_CATEGORIES = [
  {
    title: "User Manuals",
    description: "Step-by-step guides for every stakeholder role in the system.",
    items: [
      { name: "Administrator Guide", href: "/manuals/AdminGuide.html", icon: Settings, color: "text-accent" },
      { name: "Supervisor Guide", href: "/manuals/SupervisorGuide.html", icon: Users, color: "text-info" },
      { name: "Learner Guide", href: "/manuals/LearnerGuide.html", icon: GraduationCap, color: "text-warning" },
    ]
  },
  {
    title: "System Documentation",
    description: "Deep-dives into the architecture and design philosophy.",
    items: [
      { name: "System Architecture", href: "https://github.com/BhekumusaEric/AI-learning-system/blob/main/docs/ARCHITECTURE_GUIDE.md", icon: FileText, color: "text-secondary-text" },
      { name: "Technical PRD", href: "https://github.com/BhekumusaEric/AI-learning-system/blob/main/docs/TECHNICAL_PRD.md", icon: Code, color: "text-secondary-text" },
    ]
  },
  {
    title: "Deployment & Infrastructure",
    description: "Guides for hosting and maintaining the platform on AWS.",
    items: [
      { name: "Handover Guide", href: "https://github.com/BhekumusaEric/AI-learning-system/blob/main/HANDOVER.md", icon: ShieldCheck, color: "text-accent" },
      { name: "EC2 Setup Guide", href: "https://github.com/BhekumusaEric/AI-learning-system/blob/main/docs/ec2_api_setup.md", icon: Server, color: "text-secondary-text" },
    ]
  }
];

export default function DocsPortal() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30">
      {/* Header */}
      <nav className="h-20 border-b border-border-subtle bg-secondary/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="bg-accent/20 p-2.5 rounded-xl">
            <BookOpen className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">SAAIO Documentation Portal</h1>
            <p className="text-[10px] text-secondary-text uppercase tracking-widest font-semibold">Intelligence Hub</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs font-medium text-secondary-text">
          <span>Release 1.0.0</span>
          <span className="w-1 h-1 bg-border-subtle rounded-full" />
          <span>Handover Date: 2026-04-08</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 mb-16 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Centralized Knowledge <br />
            <span className="text-accent underline decoration-accent/30 decoration-4 underline-offset-8 italic">for the Future of AI Learning.</span>
          </h2>
          <p className="text-secondary-text text-lg leading-relaxed">
            Welcome to the SAAIO Knowledge Portal. This unified dashboard provides direct access to all high-fidelity user manuals, technical architecture guides, and deployment orchestrated scripts for your training ecosystem.
          </p>
        </div>

        {/* Documentation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DOC_CATEGORIES.map((category, idx) => (
            <div key={idx} className="flex flex-col gap-6 p-8 bg-secondary border border-border-subtle rounded-3xl shadow-xl hover:border-accent/40 transition-all group">
              <div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">{category.title}</h3>
                <p className="text-sm text-secondary-text leading-relaxed">{category.description}</p>
              </div>

              <div className="flex flex-col gap-3 mt-auto">
                {category.items.map((item, i) => (
                  <a 
                    key={i} 
                    href={item.href} 
                    target={item.href.startsWith('http') ? "_blank" : "_self"}
                    className="flex items-center justify-between p-4 bg-background border border-border-subtle rounded-2xl hover:bg-accent/10 hover:border-accent/30 transition-all group/item"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-secondary ${item.color}`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-semibold text-foreground group-hover/item:text-white transition-colors">{item.name}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-secondary-text group-hover/item:text-accent transition-colors opacity-0 group-hover/item:opacity-100" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* API Reference Banner */}
        <div className="mt-16 p-8 bg-accent/5 border border-accent/20 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="bg-accent p-4 rounded-2xl">
              <Code className="w-8 h-8 text-black" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">API Reference & Performance</h3>
              <p className="text-sm text-secondary-text max-w-md">Detailed endpoint documentation for the internal application API and the mobile-api-server. Available via Postman collections in the repository.</p>
            </div>
          </div>
          <a 
            href="https://github.com/BhekumusaEric/AI-learning-system/tree/main/postman" 
            target="_blank"
            className="px-8 py-4 bg-accent text-black font-extrabold rounded-2xl hover:scale-105 transition-all text-sm uppercase tracking-widest active:scale-95 whitespace-nowrap"
          >
            Access API Collections
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border-subtle bg-secondary/30 mt-20">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <BookOpen className="w-5 h-5 text-secondary-text" />
             <span className="text-xs text-secondary-text font-bold uppercase tracking-widest">SAAIO Training Grounds &copy; 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/login" className="text-xs text-secondary-text hover:text-accent transition-colors font-bold uppercase tracking-widest">Back to Dashboard</a>
            <a href="https://github.com/BhekumusaEric/AI-learning-system" className="text-xs text-secondary-text hover:text-accent transition-colors font-bold uppercase tracking-widest">Repository</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
