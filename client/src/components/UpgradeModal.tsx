import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Check } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpgradeModal({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-2xl streak-badge flex items-center justify-center mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <DialogTitle className="text-center text-xl">Upgrade to Pro</DialogTitle>
          <DialogDescription className="text-center">
            You've reached the 25-habit limit on the free plan. Upgrade to unlock unlimited habits.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {["Unlimited habits", "Priority support", "Advanced statistics", "Export data"].map((f) => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center">
                <Check className="w-3 h-3 text-success" />
              </div>
              <span className="text-sm">{f}</span>
            </div>
          ))}
        </div>
        <Button className="w-full streak-badge border-0 font-semibold" size="lg">
          Coming Soon — Stripe Integration
        </Button>
      </DialogContent>
    </Dialog>
  );
}
