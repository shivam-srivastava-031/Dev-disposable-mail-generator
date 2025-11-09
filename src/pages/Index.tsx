import { useState } from "react";
import { EmailGenerator } from "@/components/EmailGenerator";
import { InboxView } from "@/components/InboxView";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { MailAccount } from "@/services/mailTmService";

const Index = () => {
  const [account, setAccount] = useState<MailAccount | null>(null);

  return (
    <div className="min-h-screen bg-background transition-colors">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <EmailGenerator onAccountCreated={setAccount} />
        
        {account && (
          <div className="mt-12">
            <InboxView token={account.token} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
