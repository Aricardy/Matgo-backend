
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Edit, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: string;
  name: string;
  role: "Passenger" | "Sacco Admin" | "Driver" | "Conductor" | "admin";
  phone: string;
  status: "Active" | "Suspended" | "Banned";
}

export default function UsersPage() {
    const { language } = useLanguage();
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setUsers([]);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const content = {
        ENG: {
            pageTitle: "User Management",
            pageDescription: "View and manage all user accounts across the platform.",
            name: "Name",
            role: "Role",
            phone: "Phone",
            status: "Status",
            actions: "Actions",
            noUsers: "No users found.",
        },
        KSW: {
            pageTitle: "Usimamizi wa Watumiaji",
            pageDescription: "Tazama na dhibiti akaunti zote za watumiaji kwenye jukwaa.",
            name: "Jina",
            role: "Wadhifa",
            phone: "Simu",
            status: "Hali",
            actions: "Vitendo",
            noUsers: "Hakuna watumiaji waliopatikana.",
        }
    };
    const currentContent = content[language];

    const renderLoadingSkeleton = () => (
        <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <Card className="shadow-xl glassy-card">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl md:text-4xl text-primary flex items-center gap-3">
                        <Users /> {currentContent.pageTitle}
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                        {currentContent.pageDescription}
                    </CardDescription>
                </CardHeader>
            </Card>
            <Card className="shadow-lg glassy-card">
                <CardContent className="pt-6">
                    {isLoading ? renderLoadingSkeleton() : (
                    <Table>
                        <TableHeader><TableRow><TableHead>{currentContent.name}</TableHead><TableHead>{currentContent.role}</TableHead><TableHead>{currentContent.phone}</TableHead><TableHead>{currentContent.status}</TableHead><TableHead className="text-right">{currentContent.actions}</TableHead></TableRow></TableHeader>
                        <TableBody>
                        {users.length > 0 ? users.map(user => (
                            <TableRow key={user.id} className="hover:bg-primary/5">
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell className="font-mono">{user.phone}</TableCell>
                            <TableCell>
                                <Badge variant={user.status === "Active" ? "default" : (user.status === "Suspended" ? "secondary" : "destructive")} 
                                        className={cn(user.status === "Active" && "bg-green-500/80 text-white", user.status === "Suspended" && "bg-yellow-500/80 text-black")}>
                                    {user.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-1">
                                <Button variant="ghost" size="icon" className="hover:text-primary"><Edit className="h-4 w-4"/></Button>
                                <Button variant="ghost" size="icon" className="hover:text-destructive"><Trash2 className="h-4 w-4"/></Button>
                            </TableCell>
                            </TableRow>
                        )) : <TableRow><TableCell colSpan={5} className="text-center">{currentContent.noUsers}</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
