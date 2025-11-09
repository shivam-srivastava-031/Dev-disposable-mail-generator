import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Clock, Mail } from "lucide-react";
import type { MessageDetail } from "@/services/mailTmService";

interface MessageDetailViewProps {
  message: MessageDetail;
  onBack: () => void;
}

export const MessageDetailView = ({ message, onBack }: MessageDetailViewProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <Button
        variant="ghost"
        onClick={onBack}
        className="gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Inbox
      </Button>

      <Card className="p-6 space-y-6 backdrop-blur-sm bg-gradient-card shadow-soft">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{message.subject}</h1>
          
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">From:</span>
              <span className="text-muted-foreground">
                {message.from.name || message.from.address}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">To:</span>
              <span className="text-muted-foreground">
                {message.to.map(t => t.address).join(", ")}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Date:</span>
              <span className="text-muted-foreground">
                {new Date(message.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="prose prose-sm dark:prose-invert max-w-none">
          {message.html && message.html.length > 0 ? (
            <div dangerouslySetInnerHTML={{ __html: message.html[0] }} />
          ) : (
            <div className="whitespace-pre-wrap">{message.text}</div>
          )}
        </div>
      </Card>
    </div>
  );
};
