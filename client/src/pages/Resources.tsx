import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Phone, Globe, ShieldAlert, UserCheck } from "lucide-react";

export default function Resources() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-heading font-bold mb-4">Support Hub</h1>
        <p className="text-muted-foreground text-lg">
          You are not alone. Access immediate help, educational resources, and digital safety guides.
        </p>
      </div>

      {/* Emergency Banner */}
      <div className="mb-12 p-6 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-red-500/20 text-red-400">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-200">Immediate Danger?</h3>
            <p className="text-red-200/70">If you are in immediate physical danger, please contact local authorities.</p>
          </div>
        </div>
        <Button variant="destructive" className="whitespace-nowrap">Call Emergency Services</Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
        <ResourceCard 
          icon={<BookOpen className="w-6 h-6 text-blue-400" />}
          title="Digital Safety Course"
          description="Learn how to secure your accounts, spot phishing, and lock down your privacy settings."
          action="Start Learning"
        />
        <ResourceCard 
          icon={<Globe className="w-6 h-6 text-green-400" />}
          title="Regional Directory"
          description="Find NGOs, shelters, and legal aid tailored to your location and language."
          action="Find Help"
        />
        <ResourceCard 
          icon={<UserCheck className="w-6 h-6 text-purple-400" />}
          title="Psychological Support"
          description="Connect with counselors specializing in digital trauma and cyberbullying recovery."
          action="Connect Now"
        />
      </div>

      <h2 className="text-2xl font-heading font-bold mb-6">Quick Safety Guides</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <GuideItem 
          title="How to Document Online Harassment" 
          time="5 min read"
        />
        <GuideItem 
          title="Securing Your Social Media Profiles" 
          time="8 min read"
        />
        <GuideItem 
          title="Recognizing Signs of Cyberstalking" 
          time="6 min read"
        />
        <GuideItem 
          title="Legal Rights Against Digital Abuse" 
          time="10 min read"
        />
      </div>
    </div>
  );
}

function ResourceCard({ icon, title, description, action }: { icon: any, title: string, description: string, action: string }) {
  return (
    <Card className="glass-panel border-0 flex flex-col h-full">
      <CardHeader>
        <div className="mb-4 w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-base mt-2">{description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto pt-4">
        <Button variant="secondary" className="w-full bg-white/5 hover:bg-white/10 text-primary-foreground border border-white/10">
          {action}
        </Button>
      </CardFooter>
    </Card>
  )
}

function GuideItem({ title, time }: { title: string, time: string }) {
  return (
    <div className="p-4 rounded-xl bg-card border border-white/5 hover:border-primary/30 transition-colors cursor-pointer flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <BookOpen className="w-4 h-4" />
        </div>
        <span className="font-medium group-hover:text-primary transition-colors">{title}</span>
      </div>
      <span className="text-xs text-muted-foreground">{time}</span>
    </div>
  )
}
