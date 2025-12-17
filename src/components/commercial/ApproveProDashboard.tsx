import { Clock, CheckCircle, Eye, Download, Loader2, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProofRequest {
  id: string;
  projectName: string;
  companyName: string;
  vehicleType: string;
  submittedAt: string;
  status: "pending" | "in_progress" | "ready" | "approved";
}

const MOCK_REQUESTS: ProofRequest[] = [
  {
    id: "APP-847291",
    projectName: "Q1 Fleet Rebrand",
    companyName: "Arizona Rodent Solutions",
    vehicleType: "Van / Sprinter",
    submittedAt: "Dec 15, 2025",
    status: "ready",
  },
  {
    id: "APP-847156",
    projectName: "Holiday Campaign",
    companyName: "Peak HVAC Services",
    vehicleType: "Box Truck",
    submittedAt: "Dec 14, 2025",
    status: "approved",
  },
  {
    id: "APP-847089",
    projectName: "New Logo Update",
    companyName: "Swift Plumbing Co.",
    vehicleType: "Pickup Truck",
    submittedAt: "Dec 16, 2025",
    status: "in_progress",
  },
  {
    id: "APP-847320",
    projectName: "Fleet Vehicle #12",
    companyName: "Green Lawn Care",
    vehicleType: "Van / Sprinter",
    submittedAt: "Dec 17, 2025",
    status: "pending",
  },
];

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock,
    variant: "secondary" as const,
    className: "bg-muted text-muted-foreground",
  },
  in_progress: {
    label: "In Progress",
    icon: Loader2,
    variant: "outline" as const,
    className: "bg-primary/10 text-primary border-primary/30",
  },
  ready: {
    label: "Ready for Review",
    icon: Eye,
    variant: "default" as const,
    className: "bg-success/10 text-success border-success/30",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle,
    variant: "default" as const,
    className: "bg-success text-success-foreground",
  },
};

export const ApproveProDashboard = () => {
  return (
    <div className="space-y-4">
      {MOCK_REQUESTS.map((request) => {
        const config = STATUS_CONFIG[request.status];
        const StatusIcon = config.icon;

        return (
          <div
            key={request.id}
            className="bg-background border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileImage className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground">
                      {request.projectName}
                    </h4>
                    <Badge variant="outline" className={config.className}>
                      <StatusIcon className={`w-3 h-3 mr-1 ${request.status === "in_progress" ? "animate-spin" : ""}`} />
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {request.companyName} • {request.vehicleType}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="font-mono">{request.id}</span> • Submitted {request.submittedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:flex-shrink-0">
                {(request.status === "ready" || request.status === "approved") && (
                  <>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View Proof
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </>
                )}
                {request.status === "in_progress" && (
                  <span className="text-sm text-muted-foreground">
                    Est. 24-48 hours
                  </span>
                )}
                {request.status === "pending" && (
                  <span className="text-sm text-muted-foreground">
                    In queue
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {MOCK_REQUESTS.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FileImage className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No proof requests yet</p>
          <p className="text-sm">Submit your first 2D design above to get started</p>
        </div>
      )}
    </div>
  );
};

export default ApproveProDashboard;
