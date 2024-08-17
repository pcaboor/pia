"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/ui/navbar'; 
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SeparatorDemo } from '@/components/ui/message-profil-type';

type Step = 'personal' | 'account' | 'phone';

export default function RegisterForm() {
  const [step, setStep] = useState<Step>('personal');
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    company: '',
  });

  const [error, setError] = useState<string>('');
  const [companyDescription, setCompanyDescription] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleCompanyChange = (value: string) => {
    setUser((prevState) => ({
      ...prevState,
      company: value,
    }));

    if (value === 'business') {
      setCompanyDescription('Business accounts are intended for companies and organizations. They offer additional features and support tailored for business needs.');
    } else if (value === 'personal') {
      setCompanyDescription('Personal accounts are for individual use. They provide standard features for personal management.');
    } else {
      setCompanyDescription(''); // Clear description if no valid option is selected
    }
  };

  const isPersonalStepComplete = user.firstName && user.lastName && user.company;
  const isAccountStepComplete = user.email && user.password;
  const isPhoneStepComplete = user.phone;

  const handleNext = () => {
    if (step === 'personal') {
      if (!isPersonalStepComplete) {
        setError('Please fill in all personal information.');
        return;
      }
      setError('');
      setStep('account');
    } else if (step === 'account') {
      if (!isAccountStepComplete) {
        setError('Please fill in all account information.');
        return;
      }
      setError('');
      setStep('phone');
    } else if (step === 'phone') {
      onSubmit();
    }
  };

  const handleBack = () => {
    if (step === 'account') {
      setStep('personal');
    } else if (step === 'phone') {
      setStep('account');
    }
  };

  const onSubmit = async () => {
    setError('');
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('User registered:', data);
      window.location.href = '/dashboard';
    } else {
      setError(data.message || 'An error occurred');
    }
  };

  return (
    <>
      <Navbar /> {/* Ajoute la Navbar */}
      <div className="flex flex-col min-h-screen items-center py-12">
        <div className="w-full max-w-md">
          <div className="grid gap-2 text-center mb-8">
            <h1 className="text-4xl leading-tight tracking-tight font-bold text-center">
              Create Your<br />user&nbsp;Account
            </h1>
            <p className="text-muted-foreground">
              Enter your information to create an account
            </p>
          </div>
          <form className="grid gap-4">
            {error && <div className="text-red-500 text-center">{error}</div>}
            {step === 'personal' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={user.firstName}
                      onChange={handleChange}
                      placeholder="Max"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={user.lastName}
                      onChange={handleChange}
                      placeholder="Robinson"
                      required
                    />
                  </div>
                </div>

                <Select
                  value={user.company}
                  onValueChange={handleCompanyChange}
                >
                  <SelectTrigger
                    className="border-[0.5px] border-blue-300 bg-blue-50 rounded-md focus:outline-none focus:ring-0 text-blue-500"
                  >
                    <SelectValue placeholder="Select Company Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Company Type</SelectLabel>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {companyDescription && (
                  <div className="mt-4">
                    <SeparatorDemo />
                    <Separator className="my-4" />
                    <div className="space-y-1 text-blue-500 text-sm text-center">
                      <p>{companyDescription}</p>
                    </div>
                  </div>
                )}

                <Button
                  type="button"
                  className="w-full"
                  onClick={handleNext}
                  disabled={!isPersonalStepComplete}
                >
                  Next
                </Button>
              </>
            )}
            {step === 'account' && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={handleChange}
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={user.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleNext}
                  disabled={!isAccountStepComplete}
                >
                  Next
                </Button>
              </>
            )}
            {step === 'phone' && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    value={user.phone}
                    onChange={handleChange}
                    placeholder="123-456-7890"
                  />
                </div>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleNext}
                  disabled={!isPhoneStepComplete}
                >
                  Submit
                </Button>
              </>
            )}
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
