
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Settings, BellRing, Power } from "lucide-react";
import React, { useState } from "react";

export default function MaintenancePage() {
  const { language } = useLanguage();
  const { toast } = useToast();

  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const content = {
    ENG: {
      pageTitle: "System Maintenance",
      pageDescription: "Manage system-wide maintenance mode and send alerts to all users.",
      maintenanceMode: "Maintenance Mode",
      maintenanceDesc: "When enabled, non-essential services like new bookings and live tracking will be temporarily disabled. Fare payment will remain active.",
      enableMode: "Enable Maintenance Mode",
      sendAlert: "Send System-Wide Alert",
      alertTitleLabel: "Alert Title",
      alertTitlePlaceholder: "e.g., System Maintenance Alert",
      alertMessageLabel: "Alert Message",
      alertMessagePlaceholder: "e.g., MatGo will be undergoing scheduled maintenance on...",
      sendNow: "Send Alert Now",
      modeToggled: "Maintenance Mode Updated",
      modeEnabled: "System is now in maintenance mode.",
      modeDisabled: "System is now back to normal operation.",
      alertSent: "Alert Sent",
      alertSentDesc: "Your system-wide alert has been broadcast to all users.",
      fillFields: "Please fill both title and message for the alert.",
    },
    KSW: {
      pageTitle: "Matengenezo ya Mfumo",
      pageDescription: "Dhibiti hali ya matengenezo ya mfumo mzima na tuma arifa kwa watumiaji wote.",
      maintenanceMode: "Hali ya Matengenezo",
      maintenanceDesc: "Ikiwashwa, huduma zisizo muhimu kama vile uhifadhi mpya na ufuatiliaji wa moja kwa moja zitazimwa kwa muda. Malipo ya nauli yataendelea kufanya kazi.",
      enableMode: "Washa Hali ya Matengenezo",
      sendAlert: "Tuma Arifa kwa Mfumo Mzima",
      alertTitleLabel: "Kichwa cha Arifa",
      alertTitlePlaceholder: "k.m., Arifa ya Matengenezo ya Mfumo",
      alertMessageLabel: "Ujumbe wa Arifa",
      alertMessagePlaceholder: "k.m., MatGo itakuwa inafanyiwa matengenezo yaliyoratibiwa mnamo...",
      sendNow: "Tuma Arifa Sasa",
      modeToggled: "Hali ya Matengenezo Imesasishwa",
      modeEnabled: "Mfumo sasa uko katika hali ya matengenezo.",
      modeDisabled: "Mfumo sasa umerudi katika hali ya kawaida.",
      alertSent: "Arifa Imetumwa",
      alertSentDesc: "Arifa yako ya mfumo mzima imetumwa kwa watumiaji wote.",
      fillFields: "Tafadhali jaza kichwa na ujumbe wa arifa.",
    },
  };
  const currentContent = content[language];

  const handleModeToggle = (checked: boolean) => {
    setIsMaintenanceMode(checked);
    // In a real app, this would be an API call to update system state
    toast({
      title: currentContent.modeToggled,
      description: checked ? currentContent.modeEnabled : currentContent.modeDisabled,
      className: checked ? "bg-yellow-500 text-black" : "bg-green-500 text-white"
    });
  };

  const handleSendAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle || !alertMessage) {
      toast({ variant: "destructive", title: currentContent.fillFields });
      return;
    }
    // API call to broadcast the message
    toast({
      title: currentContent.alertSent,
      description: currentContent.alertSentDesc,
      className: "bg-blue-500 text-white"
    });
    setAlertTitle("");
    setAlertMessage("");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="shadow-xl glassy-card">
        <CardHeader>
          <CardTitle className="font-headline text-3xl md:text-4xl text-primary flex items-center gap-3">
            <Settings /> {currentContent.pageTitle}
          </CardTitle>
          <CardDescription className="text-base mt-1">
            {currentContent.pageDescription}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="shadow-lg glassy-card border-yellow-500/50">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-yellow-600 flex items-center gap-2">
            <Power /> {currentContent.maintenanceMode}
          </CardTitle>
          <CardDescription>{currentContent.maintenanceDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3 rounded-lg border p-4">
            <Switch
              id="maintenance-mode-switch"
              checked={isMaintenanceMode}
              onCheckedChange={handleModeToggle}
              aria-label={currentContent.enableMode}
            />
            <Label htmlFor="maintenance-mode-switch" className="text-lg font-medium">
              {currentContent.enableMode}
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg glassy-card">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
            <BellRing /> {currentContent.sendAlert}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendAlert} className="space-y-4">
            <div>
              <Label htmlFor="alertTitle" className="font-semibold text-base">{currentContent.alertTitleLabel}</Label>
              <Input
                id="alertTitle"
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
                placeholder={currentContent.alertTitlePlaceholder}
                required
              />
            </div>
            <div>
              <Label htmlFor="alertMessage" className="font-semibold text-base">{currentContent.alertMessageLabel}</Label>
              <Textarea
                id="alertMessage"
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                placeholder={currentContent.alertMessagePlaceholder}
                required
                rows={4}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="btn-glow-primary">
                {currentContent.sendNow}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
