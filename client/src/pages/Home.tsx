import { Shield, Lock, Heart, ArrowRight, Eye, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ToxicityTester } from "@/components/ToxicityTester";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-70"></div>
        
        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-sm font-medium text-primary-foreground/80">UNiTE to End Digital Violence</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6 leading-tight"
          >
            Your Digital Safety <br />
            <span className="text-gradient">Is Non-Negotiable.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            SafeSpace AI provides real-time protection against online harassment, 
            secure evidence collection, and instant access to survivor support.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="h-14 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-full">
              <Shield className="mr-2 h-5 w-5" /> Add to Browser
            </Button>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/10 hover:bg-white/5 rounded-full">
                Launch Dashboard
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Eye className="h-8 w-8 text-blue-400" />}
              title="Real-Time Detection"
              description="Our local-first AI scans content instantly to warn you of threats, harassment, and coercive language before it harms."
            />
            <FeatureCard 
              icon={<Lock className="h-8 w-8 text-purple-400" />}
              title="Encrypted Evidence"
              description="Securely capture and encrypt proof of abuse. Stored locally with AES encryption. Only you hold the key."
            />
            <FeatureCard 
              icon={<Heart className="h-8 w-8 text-pink-400" />}
              title="Survivor Support"
              description="Immediate access to mental health resources, digital literacy guides, and emergency contacts tailored to your region."
            />
          </div>
        </div>
      </section>

      {/* Live Demo */}
      <section className="py-24 px-4 bg-black/10">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">See It In Action</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Test our real-time toxicity detection. Try typing harmful or safe messages 
              to see how the AI responds instantly.
            </p>
          </div>
          <ToxicityTester />
        </div>
      </section>

      {/* Mission/Stats */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-heading font-bold">Why SafeSpace Exists</h2>
            <p className="text-lg text-muted-foreground">
              Digital violence against women and girls is an escalating crisis. 
              SafeSpace AI bridges the gap between technology and safety, providing 
              tools that empower rather than control.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span>Detects 95% of toxic language offline</span>
              </li>
              <li className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-green-500" />
                <span>Zero-knowledge encryption architecture</span>
              </li>
            </ul>
          </div>
          <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-purple-900/10 border border-white/5 relative">
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,transparent)]"></div>
            <div className="relative z-10 space-y-4">
              <div className="glass-panel p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <span className="text-xs font-mono text-muted-foreground">THREAT DETECTED</span>
                </div>
                <p className="text-sm italic text-white/80">"You should be careful what you say online..."</p>
                <div className="mt-3 flex gap-2">
                  <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">Intimidation: 89%</span>
                  <span className="text-xs bg-white/10 text-white/60 px-2 py-1 rounded">Hide</span>
                </div>
              </div>
              <div className="glass-panel p-6 rounded-xl opacity-60 scale-95">
                 <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-xs font-mono text-muted-foreground">SAFE</span>
                </div>
                <p className="text-sm text-white/80">"Hey, just wanted to check in and see how you are!"</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-panel p-8 rounded-2xl transition-all hover:bg-white/5"
    >
      <div className="mb-6 p-4 bg-white/5 rounded-xl w-fit border border-white/5">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}
