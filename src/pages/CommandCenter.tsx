import { Link } from "react-router-dom";
import { ArrowLeft, Phone, FileText, FolderOpen, RotateCcw, Palette, Users, ChevronRight, Sparkles, MessageCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Lead {
  id: string;
  source: string;
  intent: string;
  caller_name: string | null;
  caller_company: string | null;
  summary: string | null;
  status: string;
  created_at: string;
}

// Real data panel - fetches from leads_inbox
const RecentLeadsPanel = ({ leads, isLoading }: { leads: Lead[]; isLoading: boolean }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="secondary" className="text-xs">New</Badge>;
      case "followup_sent":
        return <Badge variant="outline" className="text-xs text-green-600 border-green-600">Followed Up</Badge>;
      case "human_review":
        return <Badge variant="destructive" className="text-xs">Review</Badge>;
      case "converted":
        return <Badge className="text-xs bg-green-600">Converted</Badge>;
      case "closed":
        return <Badge variant="outline" className="text-xs">Closed</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  };

  const getIntentLabel = (intent: string) => {
    switch (intent) {
      case "quote_request":
        return "Quote Request";
      case "pricing_question":
        return "Pricing Question";
      case "reorder":
        return "Reorder";
      case "info_only":
        return "Info Request";
      default:
        return "Inquiry";
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Phone className="h-4 w-4 text-primary" />
          Recent Leads
        </CardTitle>
        <CardDescription>Phone calls & chat inquiries</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No leads yet</p>
            <p className="text-xs">Leads from phone calls and chats will appear here</p>
          </div>
        ) : (
          leads.slice(0, 5).map((lead) => (
            <div key={lead.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {lead.caller_name || lead.caller_company || getIntentLabel(lead.intent)}
                </p>
                <p className="text-xs text-muted-foreground">
                  via {lead.source === "phone" ? "Phone" : "Chat"} • {getTimeAgo(lead.created_at)}
                </p>
                {lead.summary && (
                  <p className="text-xs text-muted-foreground truncate mt-1">{lead.summary}</p>
                )}
              </div>
              {getStatusBadge(lead.status)}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

// Lead stats summary
const LeadStatsPanel = ({ leads }: { leads: Lead[] }) => {
  const newLeads = leads.filter(l => l.status === "new").length;
  const followedUp = leads.filter(l => l.status === "followup_sent").length;
  const needsReview = leads.filter(l => l.status === "human_review").length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4 text-primary" />
          Lead Stats (This Week)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">{leads.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{followedUp}</p>
            <p className="text-xs text-muted-foreground">Followed Up</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-600">{needsReview + newLeads}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Placeholder panels (to be wired later)
const SavedQuotesPanel = () => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base">
        <FileText className="h-4 w-4 text-primary" />
        Saved Quotes
      </CardTitle>
      <CardDescription>Your recent quote history</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-center py-6 text-muted-foreground">
        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Coming soon</p>
        <p className="text-xs">Quote history will sync from WPW</p>
      </div>
    </CardContent>
  </Card>
);

const WrapBoxPanel = () => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base">
        <FolderOpen className="h-4 w-4 text-primary" />
        WrapBox Files
      </CardTitle>
      <CardDescription>Past WPW orders & artwork</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-center py-6 text-muted-foreground">
        <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Coming soon</p>
        <p className="text-xs">Past orders will sync from WPW</p>
      </div>
    </CardContent>
  </Card>
);

const ApproveProStatusPanel = () => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base">
        <Palette className="h-4 w-4 text-primary" />
        ApprovePro Plus Status
      </CardTitle>
      <CardDescription>3D proof generation queue</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-center py-6 text-muted-foreground">
        <Palette className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No active proofs</p>
        <p className="text-xs">3D proof status will appear here</p>
      </div>
    </CardContent>
  </Card>
);

const CommandCenter = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("leads_inbox")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching leads:", error);
      } else {
        setLeads((data as Lead[]) || []);
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-foreground">Command Center</span>
                <Badge variant="outline" className="ml-2 text-[10px] font-normal">
                  Powered by WrapCommand™
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={fetchLeads} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Your Operations Hub</h1>
          <p className="text-muted-foreground">
            Track leads, quotes, files, and proofs — all in one place.
          </p>
        </div>

        {/* Dashboard Grid */}
        <h2 className="text-lg font-semibold text-foreground mb-4">Dashboard overview</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <RecentLeadsPanel leads={leads} isLoading={isLoading} />
          <LeadStatsPanel leads={leads} />
          <SavedQuotesPanel />
          <WrapBoxPanel />
          <ApproveProStatusPanel />
          
          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-sm h-9" asChild>
                <Link to="/#pricing">
                  <FileText className="h-4 w-4 mr-2" />
                  New Quote
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm h-9" asChild>
                <Link to="/approvepro">
                  <Palette className="h-4 w-4 mr-2" />
                  Request 3D Proof
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm h-9">
                <RotateCcw className="h-4 w-4 mr-2" />
                Quick Reorder
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade CTA */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">
            Need custom workflows, client portals, or automation?
          </h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Upgrade to WrapCommandAI OS for advanced features like automated follow-ups, 
            client self-service portals, and smart workflow automation.
          </p>
          <Button size="lg" className="font-medium">
            Upgrade to WrapCommandAI OS
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CommandCenter;
