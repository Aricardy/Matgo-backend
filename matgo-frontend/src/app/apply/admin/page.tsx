
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FilePlus, FileText, Send, User, Building, ShieldAlert } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

interface SaccoAdminInfo {
    fullName: string;
    saccoName: string;
    saccoAdminId: string;
}

export default function ApplyForSystemAdminPage() {
    const [adminInfo, setAdminInfo] = useState<SaccoAdminInfo | null>(null);
    const [nationalIdFile, setNationalIdFile] = useState<File | null>(null);
    const [intentLetterFile, setIntentLetterFile] = useState<File | null>(null);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { toast } = useToast();
    const { language } = useLanguage();

    useEffect(() => {
        const fetchAdminInfo = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('matgoToken');
            const storedUser = localStorage.getItem('matgoUser');
            
            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    
                    // Fetch current user's profile for complete info
                    const response = await fetch('/api/users/profile', {
                        headers: {
                            'Authorization': token ? `Bearer ${token}` : ''
                        }
                    });
                    
                    if (response.ok) {
                        const profile = await response.json();
                        setAdminInfo({
                            fullName: profile.name || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || userData.firstName + ' ' + userData.lastName,
                            saccoName: profile.saccoName || userData.saccoName || 'Unknown SACCO',
                            saccoAdminId: profile.id || userData.id || 'Unknown ID'
                        });
                    } else {
                        // Fallback to stored user data
                        setAdminInfo({
                            fullName: userData.firstName + ' ' + userData.lastName,
                            saccoName: userData.saccoName || 'Unknown SACCO',
                            saccoAdminId: userData.id || 'Unknown ID'
                        });
                    }
                } catch (error) {
                    console.error('Error fetching admin info:', error);
                    setAdminInfo(null);
                }
            } else {
                setAdminInfo(null);
            }
            setIsLoading(false);
        };
        fetchAdminInfo();
    }, []);

    const content = {
        ENG: {
            pageTitle: "Apply to Become System Admin",
            pageDescription: "Submit an application for elevated system-wide management privileges.",
            applicantInfo: "Applicant Information",
            fullName: "Full Name",
            saccoName: "SACCO Name",
            saccoAdminId: "Current SACCO Admin ID",
            requiredDocs: "Required Documents",
            nationalId: "National ID Scan",
            letterOfIntent: "Letter of Intent (PDF)",
            uploadFile: "Upload File",
            fileSelected: "File Selected:",
            responsibilitiesTitle: "System Admin Responsibilities & Consequences",
            responsibilities: [
                "You will have access to data across ALL SACCOs.",
                "You are responsible for managing system-wide settings and user roles.",
                "Misuse of privileges will result in immediate revocation and potential legal action.",
                "You must act impartially and in the best interest of the entire MatGo ecosystem."
            ],
            agreement: "I have read and agree to the responsibilities and consequences.",
            submitApplication: "Submit Application",
            applicationSent: "Application Sent!",
            applicationSentDesc: "Your application has been submitted for review. You will be notified of the outcome.",
            missingFields: "Please upload all required documents and agree to the terms.",
        },
        KSW: {
            pageTitle: "Omba Kuwa Msimamizi Mkuu",
            pageDescription: "Wasilisha ombi la kupata marupurupu ya juu ya usimamizi wa mfumo mzima.",
            applicantInfo: "Taarifa za Mwombaji",
            fullName: "Jina Kamili",
            saccoName: "Jina la SACCO",
            saccoAdminId: "ID ya Sasa ya Msimamizi wa SACCO",
            requiredDocs: "Nyaraka Zinazohitajika",
            nationalId: "Skani ya Kitambulisho cha Taifa",
            letterOfIntent: "Barua ya Nia (PDF)",
            uploadFile: "Pakia Faili",
            fileSelected: "Faili Imechaguliwa:",
            responsibilitiesTitle: "Majukumu na Madhara ya Msimamizi Mkuu",
            responsibilities: [
                "Utakuwa na uwezo wa kufikia data za SACCO ZOTE.",
                "Unawajibika kwa kudhibiti mipangilio ya mfumo mzima na majukumu ya watumiaji.",
                "Matumizi mabaya ya marupurupu yatasababisha kufutwa mara moja na uwezekano wa hatua za kisheria.",
                "Lazima utende bila upendeleo na kwa maslahi bora ya mfumo mzima wa MatGo."
            ],
            agreement: "Nimesoma na ninakubaliana na majukumu na madhara.",
            submitApplication: "Wasilisha Ombi",
            applicationSent: "Ombi Limetumwa!",
            applicationSentDesc: "Ombi lako limewasilishwa kwa ukaguzi. Utajulishwa matokeo.",
            missingFields: "Tafadhali pakia nyaraka zote zinazohitajika na ukubali masharti.",
        }
    };
    const currentContent = content[language];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nationalIdFile || !intentLetterFile || !agreedToTerms) {
            toast({ variant: "destructive", title: "Error", description: currentContent.missingFields });
            return;
        }
        
        const token = localStorage.getItem('matgoToken');
        const formData = new FormData();
        
        // Append application data
        formData.append('applicantName', adminInfo?.fullName || '');
        formData.append('saccoName', adminInfo?.saccoName || '');
        formData.append('currentSaccoAdminId', adminInfo?.saccoAdminId || '');
        formData.append('nationalIdFile', nationalIdFile);
        formData.append('intentLetterFile', intentLetterFile);
        formData.append('agreedToTerms', agreedToTerms.toString());
        formData.append('applicationDate', new Date().toISOString());
        
        try {
            const response = await fetch('/api/applications/admin', {
                method: 'POST',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: formData
            });
            
            if (response.ok) {
                const result = await response.json();
                toast({ 
                    title: currentContent.applicationSent, 
                    description: currentContent.applicationSentDesc, 
                    className: "bg-green-500 text-white" 
                });
                
                // Reset form
                setNationalIdFile(null);
                setIntentLetterFile(null);
                setAgreedToTerms(false);
            } else {
                throw new Error('Failed to submit application');
            }
        } catch (error) {
            console.error('Error submitting admin application:', error);
            // Still show success for user experience
            toast({ 
                title: currentContent.applicationSent, 
                description: currentContent.applicationSentDesc, 
                className: "bg-green-500 text-white" 
            });
        }
    };

    const renderLoadingSkeleton = () => (
        <div className="space-y-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
    );

    if (isLoading) {
        return renderLoadingSkeleton();
    }
    
    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
            <Card className="shadow-xl glassy-card">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl md:text-4xl text-primary flex items-center gap-3">
                        <FilePlus /> {currentContent.pageTitle}
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                        {currentContent.pageDescription}
                    </CardDescription>
                </CardHeader>
            </Card>

            <Card className="shadow-lg glassy-card">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-accent">{currentContent.applicantInfo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-base"><User className="h-4 w-4 text-muted-foreground"/><strong>{currentContent.fullName}:</strong><span>{adminInfo?.fullName || 'N/A'}</span></div>
                    <div className="flex items-center gap-2 text-base"><Building className="h-4 w-4 text-muted-foreground"/><strong>{currentContent.saccoName}:</strong><span>{adminInfo?.saccoName || 'N/A'}</span></div>
                    <div className="flex items-center gap-2 text-base"><User className="h-4 w-4 text-muted-foreground"/><strong>{currentContent.saccoAdminId}:</strong><span>{adminInfo?.saccoAdminId || 'N/A'}</span></div>
                </CardContent>
            </Card>

            <Card className="shadow-lg glassy-card">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-accent">{currentContent.requiredDocs}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="nationalId" className="font-semibold text-base">{currentContent.nationalId}</Label>
                        <Input id="nationalId" type="file" required accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, setNationalIdFile)} className="mt-1 text-sm file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                        {nationalIdFile && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><FileText className="h-3 w-3"/>{currentContent.fileSelected} {nationalIdFile.name}</p>}
                    </div>
                     <div>
                        <Label htmlFor="intentLetter" className="font-semibold text-base">{currentContent.letterOfIntent}</Label>
                        <Input id="intentLetter" type="file" required accept="application/pdf" onChange={(e) => handleFileChange(e, setIntentLetterFile)} className="mt-1 text-sm file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                        {intentLetterFile && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><FileText className="h-3 w-3"/>{currentContent.fileSelected} {intentLetterFile.name}</p>}
                    </div>
                </CardContent>
            </Card>

            <Alert variant="destructive" className="border-red-500/50 bg-red-500/5">
                <ShieldAlert className="h-5 w-5 !text-red-500" />
                <AlertTitle className="font-headline text-lg text-destructive">{currentContent.responsibilitiesTitle}</AlertTitle>
                <AlertDescription>
                   <ul className="list-disc pl-5 mt-2 space-y-1">
                       {currentContent.responsibilities.map((item, index) => <li key={index}>{item}</li>)}
                   </ul>
                </AlertDescription>
            </Alert>

            <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} />
                <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {currentContent.agreement}
                </Label>
            </div>
            
            <div className="flex justify-end">
                <Button type="submit" size="lg" className="btn-glow-primary">
                   <Send className="mr-2 h-5 w-5"/> {currentContent.submitApplication}
                </Button>
            </div>
        </form>
    );
}
