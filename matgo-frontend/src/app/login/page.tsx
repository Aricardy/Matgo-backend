
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/layout/Header";
import MatGoIcon from "@/components/icons/MatGoIcon";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { api } from "@/lib/api";
import axios from 'axios';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const { language } = useLanguage(); 

  const content = {
    ENG: {
      loginFailed: "Login Failed",
      pleaseEnterCredentials: "Please enter both email/phone and password.",
      loginSuccess: "Login Successful",
      loginRedirect: "Redirecting to dashboard...",
      invalidCredentials: "Invalid credentials. Please try again.",
      welcomeBack: "Welcome Back!",
      loginToAccount: "Login to your MatGo account and hit the road.",
      phoneEmailLabel: "Phone / Email",
      phoneEmailPlaceholder: "e.g., 0712345678 or user@matgo.co.ke",
      passwordLabel: "Password",
      forgotPassword: "Forgot password?",
      passwordPlaceholder: "Enter your password",
      loginButton: "Login",
      newToMatGo: "New to MatGo?",
      createAccount: "Create Account",
    },
    KSW: {
      loginFailed: "Kuingia Imeshindwa",
      pleaseEnterCredentials: "Tafadhali ingiza barua pepe/simu na nenosiri.",
      loginSuccess: "Kuingia Kumefaulu",
      loginRedirect: "Inaelekeza kwenye dashibodi...",
      invalidCredentials: "Vitambulisho si sahihi. Tafadhali jaribu tena.",
      welcomeBack: "Karibu Tena!",
      loginToAccount: "Ingia kwenye akaunti yako ya MatGo na uanze safari.",
      phoneEmailLabel: "Simu / Barua Pepe",
      phoneEmailPlaceholder: "k.m., 0712345678 au mtumiaji@matgo.co.ke",
      passwordLabel: "Nenosiri",
      forgotPassword: "Umesahau nenosiri?",
      passwordPlaceholder: "Weka nenosiri lako",
      loginButton: "Ingia",
      newToMatGo: "Mgeni kwa MatGo?",
      createAccount: "Fungua Akaunti",
    }
  };
  const currentContent = content[language];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    console.log('Login attempt started');
    console.log('Username:', username);
    console.log('Password length:', password.length);

    if (!username || !password) {
      const errorMsg = !username ? 'Username is required' : 'Password is required';
      console.error('Validation error:', errorMsg);
      toast({
        variant: "destructive",
        title: currentContent.loginFailed,
        description: errorMsg,
      });
      return;
    }

    try {
      // Clear any existing auth data
      localStorage.removeItem('matgoUser');
      localStorage.removeItem('matgoToken');

      // Determine if input is email or phone
      const isEmail = username.includes('@');
      const loginPayload = isEmail
        ? { email: username, password }
        : { phone: username, password };

      console.log('Sending login request to backend...', loginPayload);
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, 
        loginPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': 'http://localhost:9002'
          },
          withCredentials: true
        }
      );

      console.log('Login response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      });

      if (!response.data || !response.data.user || !response.data.token) {
        console.error('Invalid response format from server:', response.data);
        throw new Error('Invalid response from server');
      }

      const { data } = response;
      
      // Store user data and token
      localStorage.setItem('matgoUser', JSON.stringify(data.user));
      localStorage.setItem('matgoToken', data.token);
      
      toast({
        title: currentContent.loginSuccess,
        description: currentContent.loginRedirect,
        className: "bg-green-500 text-white",
      });
      
      // Ensure user role is correctly set
      if (data.user.role === "system_admin") {
        data.user.role = "admin"; // Map system_admin to admin in localStorage
      }

      // Store updated user data
      localStorage.setItem('matgoUser', JSON.stringify(data.user));

      // Redirect based on user role
      const dashboardPaths = {
        'admin': '/dashboard/admin',
        'sacco_admin': '/dashboard/sacco',
        'driver': '/dashboard/driver',
        'conductor': '/dashboard/conductor',
        'passenger': '/dashboard/passenger'
      } as const;

      type RoleKey = keyof typeof dashboardPaths;
      const role: RoleKey = (Object.keys(dashboardPaths).includes(data.user.role) ? data.user.role : 'passenger') as RoleKey;

      // Set target path based on role
      const targetPath = dashboardPaths[role];
      window.location.href = targetPath;
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      let errorMessage = currentContent.invalidCredentials;
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        
        // Provide more specific error messages based on the response
        if (error.response.status === 401) {
          // Handle 401 Unauthorized specifically
          if (error.response.data) {
            // Check for different possible error message formats
            if (typeof error.response.data === 'string') {
              errorMessage = error.response.data;
            } else if (error.response.data.message) {
              errorMessage = error.response.data.message;
            } else if (error.response.data.error) {
              errorMessage = error.response.data.error;
            } else {
              // If we get an object but can't find a message, stringify it
              try {
                errorMessage = JSON.stringify(error.response.data);
              } catch (e) {
                errorMessage = 'Invalid credentials. Please check your username and password.';
              }
            }
          } else {
            errorMessage = 'Invalid credentials. Please check your username and password.';
          }
        } else if (error.response.status === 403) {
          errorMessage = 'Your account is pending approval. Please contact support.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
        errorMessage = `Error: ${error.message}`;
      }
      
      toast({
        variant: "destructive",
        title: currentContent.loginFailed,
        description: errorMessage,
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-muted/30 to-background dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
      <Header />
      <main className="flex flex-1 items-center justify-center p-4 md:p-6">
        <Card className="w-full max-w-md shadow-2xl animate-fade-in rounded-xl glassy-card">
          <CardHeader className="text-center space-y-3 pt-8">
            <MatGoIcon className="mx-auto h-20 w-20 text-primary nganya-flash" />
            <CardTitle className="font-headline text-4xl text-primary">{currentContent.welcomeBack}</CardTitle>
            <CardDescription className="text-muted-foreground text-base">{currentContent.loginToAccount}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-8 px-6 md:px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-base font-semibold">{currentContent.phoneEmailLabel}</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder={currentContent.phoneEmailPlaceholder}
                  required
                  className="text-base py-3 px-4 rounded-lg border-2 focus:border-primary focus:ring-primary"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-base font-semibold">{currentContent.passwordLabel}</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline font-medium">
                    {currentContent.forgotPassword}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder={currentContent.passwordPlaceholder}
                  className="text-base py-3 px-4 rounded-lg border-2 focus:border-primary focus:ring-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full font-bold text-lg py-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 ease-in-out transform hover:scale-105 btn-glow-primary">
                {currentContent.loginButton} <ArrowRight className="ml-2 h-5 w-5"/>
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-3 pb-8">
            <p className="text-sm text-muted-foreground">
              {currentContent.newToMatGo}{" "}
              <Button variant="link" asChild className="text-primary p-0 h-auto font-semibold text-base hover:underline">
                <Link href="/signup">{currentContent.createAccount}</Link>
              </Button>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
