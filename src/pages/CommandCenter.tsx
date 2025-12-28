import { Link } from "react-router-dom";
import { ArrowLeft, Phone, FileText, FolderOpen, RotateCcw, Palette, Users, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Placeholder panels - will be replaced with real data from WrapCommandAI APIs
const RecentLeadsPanel = () => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base">
        <Phone className="h-4 w-4 text-primary" />
        Recent Leads
      </CardTitle>
      <CardDescription>Phone calls & chat inquiries</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div>
          <p className="font-medium text-sm">Fleet Quote Request</p>
          <p className="text-xs text-muted-foreground">via Phone • 2 hours ago</p>
        </div>
        <Badge variant="secondary" className="text-xs">Pending</Badge>
      </div>
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div>
          <p className="font-medium text-sm">Pricing Question</p>
          <p className="text-xs text-muted-foreground">via Chat • 5 hours ago</p>
        </div>
        <Badge variant="outline" className="text-xs">Followed Up</Badge>
      </div>
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div>
          <p className="font-medium text-sm">Reorder Inquiry</p>
          <p className="text-xs text-muted-foreground">via Phone • Yesterday</p>
        </div>
        <Badge className="text-xs bg-green-600">Converted</Badge>
      </div>
    </CardContent>
  </Card>
);

const SavedQuotesPanel = () => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base">
        <FileText className="h-4 w-4 text-primary" />
        Saved Quotes
      </CardTitle>
      <CardDescription>Your recent quote history</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div>
          <p className="font-medium text-sm">Ford Transit - 800 sq ft</p>
          <p className="text-xs text-muted-foreground">$4,216 • Dec 26</p>
        </div>
        <Button size="sm" variant="outline" className="text-xs h-7">View</Button>
      </div>
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div>
          <p className="font-medium text-sm">Sprinter Fleet (x5)</p>
          <p className="text-xs text-muted-foreground">$18,750 • Dec 24</p>
        </div>
        <Button size="sm" variant="outline" className="text-xs h-7">View</Button>
      </div>
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div>
          <p className="font-medium text-sm">Box Truck - 1200 sq ft</p>
          <p className="text-xs text-muted-foreground">$6,324 • Dec 20</p>
        </div>
        <Button size="sm" variant="outline" className="text-xs h-7">View</Button>
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
    <CardContent className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div>
          <p className="font-medium text-sm">Viking Fleet - Transit</p>
          <p className="text-xs text-muted-foreground">Completed Dec 15</p>
        </div>
        <Button size="sm" variant="ghost" className="text-xs h-7">
          <RotateCcw className="h-3 w-3 mr-1" />
          Reorder
        </Button>
      </div>
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div>
          <p className="font-medium text-sm">Ghost Industries - Sprinter</p>
          <p className="text-xs text-muted-foreground">Completed Dec 10</p>
        </div>
        <Button size="sm" variant="ghost" className="text-xs h-7">
          <RotateCcw className="h-3 w-3 mr-1" />
          Reorder
        </Button>
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
    <CardContent className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div>
          <p className="font-medium text-sm">Transit Full Wrap</p>
          <p className="text-xs text-muted-foreground">In Progress</p>
        </div>
        <Badge variant="secondary" className="text-xs animate-pulse">Rendering</Badge>
      </div>
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div>
          <p className="font-medium text-sm">Sprinter Partial</p>
          <p className="text-xs text-muted-foreground">Awaiting Files</p>
        </div>
        <Badge variant="outline" className="text-xs">Upload Art</Badge>
      </div>
    </CardContent>
  </Card>
);

const AffiliateStatsPanel = () => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base">
        <Users className="h-4 w-4 text-primary" />
        MightyAffiliate Stats
      </CardTitle>
      <CardDescription>Your referral performance</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-foreground">12</p>
          <p className="text-xs text-muted-foreground">Referrals</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-600">$1,840</p>
          <p className="text-xs text-muted-foreground">Earned</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">3</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const CommandCenter = () => {
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <RecentLeadsPanel />
          <SavedQuotesPanel />
          <WrapBoxPanel />
          <ApproveProStatusPanel />
          <AffiliateStatsPanel />
          
          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-sm h-9">
                <FileText className="h-4 w-4 mr-2" />
                New Quote
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm h-9">
                <Palette className="h-4 w-4 mr-2" />
                Request 3D Proof
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
          <h3 className="text-xl font-semibold text-white mb-2">
            Need custom workflows, client portals, or automation?
          </h3>
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
