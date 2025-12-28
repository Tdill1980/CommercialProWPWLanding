import { useState, useCallback } from "react";
import { useConversation } from "@elevenlabs/react";
import { Phone, PhoneOff, Loader2, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VoiceAgentButtonProps {
  variant?: "default" | "hero";
  className?: string;
}

export function VoiceAgentButton({ variant = "default", className = "" }: VoiceAgentButtonProps) {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log("[VoiceAgent] Connected");
      toast({
        title: "Connected",
        description: "You're now talking to our sales assistant. Speak naturally!",
      });
    },
    onDisconnect: () => {
      console.log("[VoiceAgent] Disconnected");
    },
    onMessage: (message) => {
      console.log("[VoiceAgent] Message:", message);
    },
    onError: (error) => {
      console.error("[VoiceAgent] Error:", error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect to voice agent. Please try again.",
      });
    },
  });

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get token from edge function
      const { data, error } = await supabase.functions.invoke("elevenlabs-conversation-token");

      if (error) {
        throw new Error(error.message || "Failed to get conversation token");
      }

      if (!data?.token) {
        throw new Error("No token received");
      }

      // Start the conversation with WebRTC
      await conversation.startSession({
        conversationToken: data.token,
        connectionType: "webrtc",
      });
    } catch (error) {
      console.error("[VoiceAgent] Failed to start:", error);
      
      let description = "Please check your microphone and try again.";
      if (error instanceof Error) {
        if (error.message.includes("not configured")) {
          description = "Voice agent is not configured yet.";
        } else if (error.message.includes("Permission denied")) {
          description = "Please allow microphone access to use voice.";
        }
      }
      
      toast({
        variant: "destructive",
        title: "Couldn't Start Voice",
        description,
      });
    } finally {
      setIsConnecting(false);
    }
  }, [conversation, toast]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
    toast({
      title: "Call Ended",
      description: "Thanks for chatting! We'll follow up if needed.",
    });
  }, [conversation, toast]);

  const isConnected = conversation.status === "connected";
  const isSpeaking = conversation.isSpeaking;

  if (variant === "hero") {
    return (
      <Button
        onClick={isConnected ? stopConversation : startConversation}
        disabled={isConnecting}
        size="lg"
        variant={isConnected ? "destructive" : "secondary"}
        className={`gap-2 ${className}`}
      >
        {isConnecting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Connecting...
          </>
        ) : isConnected ? (
          <>
            {isSpeaking ? <Mic className="h-5 w-5 animate-pulse" /> : <MicOff className="h-5 w-5" />}
            End Call
          </>
        ) : (
          <>
            <Phone className="h-5 w-5" />
            Talk to Sales
          </>
        )}
      </Button>
    );
  }

  return (
    <button
      onClick={isConnected ? stopConversation : startConversation}
      disabled={isConnecting}
      className={`flex items-center gap-2 text-sm transition-colors ${
        isConnected 
          ? "text-destructive hover:text-destructive/80" 
          : "text-muted-foreground hover:text-foreground"
      } ${className}`}
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Connecting...</span>
        </>
      ) : isConnected ? (
        <>
          {isSpeaking ? (
            <Mic className="h-4 w-4 animate-pulse text-primary" />
          ) : (
            <PhoneOff className="h-4 w-4" />
          )}
          <span>End Call</span>
        </>
      ) : (
        <>
          <Phone className="h-4 w-4" />
          <span>Talk to Sales</span>
        </>
      )}
    </button>
  );
}
