import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useHabits } from "@/hooks/useHabits";
import AppLayout from "@/components/AppLayout";
import UpgradeModal from "@/components/UpgradeModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Sparkles, User } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { habitsQuery } = useHabits();
  const [showUpgrade, setShowUpgrade] = useState(false);

  const isPro = false;
  const habitCount = habitsQuery.data?.length ?? 0;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold font-heading">Settings</h1>

        <Card className="glass-card">
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Account</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Plan</span>
              <Badge variant={isPro ? "default" : "secondary"}>
                {isPro ? "Pro" : "Free"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-success" />
            </div>
            <div>
              <CardTitle className="text-base">Usage</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Active habits
              </span>
              <span className="text-sm font-medium">
                {habitCount}
                {!isPro && " / 25"}
              </span>
            </div>
          </CardContent>
        </Card>

        {!isPro && (
          <Card className="border-accent/30 bg-accent/5">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="w-12 h-12 rounded-2xl streak-badge flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold">Upgrade to Pro</h3>
                <p className="text-sm text-muted-foreground">
                  Unlimited habits and advanced features
                </p>
              </div>
              <Button
                onClick={() => setShowUpgrade(true)}
                className="streak-badge border-0"
              >
                Upgrade
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} />
    </AppLayout>
  );
}
