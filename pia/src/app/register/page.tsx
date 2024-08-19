"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/ui/navbar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SeparatorDemo } from '@/components/ui/message-profil-type';
import { InputOTPForm } from '@/components/ui/input-otp-form';
import { toast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

const FormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  phone: z.string().min(10, "Invalid phone number"),
  company: z.string().min(1, "Company type is required"),
  pin: z.string().length(6, "OTP must be 6 characters long").optional(),
  terms: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
});

type FormData = z.infer<typeof FormSchema>;

type Step = 'personal' | 'account' | 'phone' | 'otp';

export default function RegisterForm() {
  const [step, setStep] = useState<Step>('personal');
  const [error, setError] = useState<string>('');
  const [companyDescription, setCompanyDescription] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      company: '',
      pin: '',
      terms: false,
    },
  });

  const { watch, setValue } = form;

  const handleCompanyChange = (value: string) => {
    setValue('company', value);
    if (value === 'business') {
      setCompanyDescription('Business accounts are intended for companies and organizations. They offer additional features and support tailored for business needs.');
    } else if (value === 'personal') {
      setCompanyDescription('Personal accounts are for individual use. They provide standard features for personal management.');
    } else {
      setCompanyDescription('');
    }
  };

  const isPersonalStepComplete = watch('firstName') && watch('lastName') && watch('company');
  const isAccountStepComplete = watch('email') && watch('password');
  const isPhoneStepComplete = watch('phone');
  const isOtpStepComplete = watch('pin')?.length === 6;

 // Exemple de mise à jour du champ `terms`
// Assurez-vous d'avoir une logique correcte pour le champ `terms`
const handleNext = async () => {
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
    if (!isPhoneStepComplete) {
      setError('Please enter a valid phone number.');
      return;
    }
    try {
      const response = await fetch('/api/otp/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: watch('phone') }),
      });

      if (response.ok) {
        setOtpSent(true);
        setStep('otp');
      } else {
        const data = await response.json();
        setError(data.message || 'An error occurred while sending OTP');
      }
    } catch (error) {
      setError('An error occurred while sending OTP');
    }
  }
};


  const handleBack = () => {
    if (step === 'account') {
      setStep('personal');
    } else if (step === 'phone') {
      setStep('account');
    } else if (step === 'otp') {
      setStep('phone');
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        window.location.replace('/login');
      } else {
        setError(result.message || 'Failed to create account');
      }
    } catch (error) {
      setError('An error occurred while creating the account');
    }
  };

  const handleVerificationComplete = async () => {
    const otp = form.getValues('pin');
    const phone = watch('phone');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid OTP.');
      return;
    }

    try {
      const verifyResponse = await fetch('/api/otp/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone,
          otp: otp,
        }),
      });

      const verifyResult = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyResult.message || 'Failed to verify OTP');
      }

      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form.getValues()),
      });

      const registerResult = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerResult.message || 'Failed to register user');
      }

      toast({
        title: "Registration Successful!",
        description: "Your account has been created successfully.",
      });
      window.location.replace('/login');
    } catch (error) {
      console.error('Error during verification or registration:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    }
  };

  return (
    <>
      <Navbar />
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
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              {error && <div className="text-red-500 text-center">{error}</div>}
              {step === 'personal' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input
                        id="firstName"
                        {...form.register("firstName")}
                        placeholder="Max"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        {...form.register("lastName")}
                        placeholder="Robinson"
                      />
                    </div>
                  </div>

                  <Select
                    onValueChange={handleCompanyChange}
                    value={watch('company')}
                  >
                    <SelectTrigger className="border-[0.5px] border-blue-300 bg-blue-50 rounded-md focus:outline-none focus:ring-0 text-blue-500">
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
                      <div className="space-y-1 text-blue-500 text-sm">
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
                      {...form.register("email")}
                      placeholder="m@example.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...form.register("password")}
                      placeholder="••••••••"
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
                      {...form.register("phone")}
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
                    Next
                  </Button>
                </>
              )}
              {step === 'otp' && (
                <>
                  <InputOTPForm onVerificationComplete={handleVerificationComplete} />
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full mt-4"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  <div className="items-top flex space-x-2">
                    <Checkbox id="terms" {...form.register("terms")} />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Accept terms and conditions
                      </label>
                      <p className="text-sm text-muted-foreground">
                        You agree to our Terms of Service and Privacy Policy.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </form>
          </FormProvider>
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
