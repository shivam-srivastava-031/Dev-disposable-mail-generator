import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Inbox, Mail, RefreshCw, Clock, User } from "lucide-react";
import { mailTmService, type Message, type MessageDetail } from "@/services/mailTmService";
import { MessageDetailView } from "./MessageDetailView";

interface InboxViewProps {
  token: string;
}

export const InboxView = ({ token }: InboxViewProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMessages = async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setIsLoading(true);
    
    try {
      const msgs = await mailTmService.getMessages(token);
      setMessages(msgs);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleMessageClick = async (messageId: string) => {
    try {
      const messageDetail = await mailTmService.getMessage(token, messageId);
      setSelectedMessage(messageDetail);
    } catch (error) {
      console.error("Failed to fetch message:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => fetchMessages(true), 5000);
    return () => clearInterval(interval);
  }, [token]);

  if (selectedMessage) {
    return (
      <MessageDetailView
        message={selectedMessage}
        onBack={() => setSelectedMessage(null)}
      />
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Inbox className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold">Inbox</h2>
          {messages.length > 0 && (
            <span className="text-sm text-muted-foreground">
              ({messages.length} {messages.length === 1 ? "message" : "messages"})
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => fetchMessages(true)}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading messages...</p>
        </Card>
      ) : messages.length === 0 ? (
        <Card className="p-8 text-center backdrop-blur-sm bg-gradient-card">
          <Mail className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-lg font-medium mb-1">No messages yet</p>
          <p className="text-sm text-muted-foreground">
            Messages will appear here when someone sends an email to your address
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {messages.map((message) => (
            <Card
              key={message.id}
              className="p-4 cursor-pointer hover:shadow-soft transition-all backdrop-blur-sm bg-gradient-card border-border/50"
              onClick={() => handleMessageClick(message.id)}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <User className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="font-medium truncate">
                      {message.from.name || message.from.address}
                    </span>
                    {!message.seen && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <Clock className="w-3 h-3" />
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </div>
                </div>
                <h3 className="font-semibold line-clamp-1">{message.subject}</h3>
                {message.intro && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {message.intro}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
