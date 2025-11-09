import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Key, Copy, Check, Loader2 } from "lucide-react";
import { mailTmService, type MailAccount } from "@/services/mailTmService";
import { useToast } from "@/hooks/use-toast";

interface EmailGeneratorProps {
  onAccountCreated: (account: MailAccount) => void;
}

export const EmailGenerator = ({ onAccountCreated }: EmailGeneratorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState<MailAccount | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const { toast } = useToast();

  const generateEmail = async () => {
    setIsLoading(true);
    try {
      const newAccount = await mailTmService.createAccount();
      setAccount(newAccount);
      onAccountCreated(newAccount);
      toast({
        title: "Success!",
        description: "Disposable email created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: "email" | "password") => {
    await navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
    toast({
      description: `${type === "email" ? "Email" : "Password"} copied to clipboard`,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4">
          <Mail className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Disposable Email Generator
        </h1>
        <p className="text-muted-foreground text-lg">
          Create temporary email addresses in seconds
        </p>
      </div>

      {!account ? (
        <Button
          onClick={generateEmail}
          disabled={isLoading}
          size="lg"
          className="w-full h-14 text-lg bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-5 w-5" />
              Generate Email
            </>
          )}
        </Button>
      ) : (
        <Card className="p-6 space-y-4 backdrop-blur-sm bg-gradient-card shadow-soft border-border/50">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </div>
                <p className="text-lg font-mono break-all">{account.email}</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(account.email, "email")}
                className="shrink-0"
              >
                {copiedEmail ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Key className="w-4 h-4" />
                  <span>Password</span>
                </div>
                <p className="text-lg font-mono">{account.password}</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(account.password, "password")}
                className="shrink-0"
              >
                {copiedPassword ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button
            onClick={generateEmail}
            disabled={isLoading}
            variant="secondary"
            className="w-full"
          >
            Generate New Email
          </Button>
        </Card>
      )}
    </div>
  );
};
