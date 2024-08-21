'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/ui/navbar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SeparatorDemo } from '@/components/ui/message-profil-type';
import { InputOTPForm } from '@/components/ui/input-otp-form';
import { toast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const FormSchema = z.object({
  teamName: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  phone: z.string().min(10, "Invalid phone number"),
  company: z.string().min(1, "Company type is required"),
  pin: z.string().length(6, "OTP must be 6 characters long").optional(),
  terms: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
  userImage: z.string().optional() 
})
  .refine(data => data.company !== 'business' || data.teamName, {
    message: "Team name is required for business accounts",
    path: ["teamName"],
  });

type FormData = z.infer<typeof FormSchema>;

type Step = 'personal' | 'account' | 'phone' | 'otp';

export default function RegisterForm() {
  const [step, setStep] = useState<Step>('personal');
  const [error, setError] = useState<string>('');
  const [companyDescription, setCompanyDescription] = useState<string>('');
  const [userImage, setProfileImage] = useState<string | ArrayBuffer | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: '', lastName: '', email: '', password: '', teamName: '', userImage: '',
      phone: '', company: '', pin: '', terms: false,
    },
  });

  const { watch, setValue, formState: { isValid } } = form;

  const handleCompanyChange = (value: string) => {
    setValue('company', value);
    setCompanyDescription(value === 'business'
      ? 'Business accounts are for companies and organizations with additional features.'
      : value === 'personal'
        ? 'Personal accounts are for individual use with standard features.'
        : '');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        setError('File size exceeds 1 MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Invalid file type. Please upload an image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setProfileImage(imageUrl);
        setValue('userImage', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  

  const isStepComplete = {
    personal: watch('firstName') && watch('lastName') && watch('company') && (watch('company') !== 'business' || watch('teamName')),
    account: watch('email') && watch('password'),
    phone: watch('phone'),
    otp: watch('pin')?.length === 6 && watch('terms'),
  };

  const handleNext = async () => {
    if (!isStepComplete[step as keyof typeof isStepComplete]) {
      setError(`Please fill in all required information for the ${step} step.`);
      return;
    }
    setError('');
    if (step === 'phone') {
      try {
        const response = await fetch('/api/otp/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: watch('phone') }),
        });
        if (!response.ok) throw new Error('Failed to send OTP');
        setStep('otp');
      } catch (error) {
        setError('An error occurred while sending OTP');
      }
    } else {
      setStep(step === 'personal' ? 'account' : 'phone');
    }
  };

  const handleBack = () => {
    setStep(step === 'account' ? 'personal' : step === 'phone' ? 'account' : 'phone');
  };

  const handleVerificationComplete = async () => {
    const { pin, phone, ...userData } = form.getValues();
    if (!pin || pin.length !== 6) {
      setError('Please enter a valid OTP.');
      return;
    }
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, pin, phone }),
      });
      if (!response.ok) throw new Error('Registration failed');
      toast({
        title: "Registration Successful!",
        description: "Your account has been created successfully.",
      });
      window.location.replace('/login');
    } catch (error) {
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
          <h1 className="text-4xl font-bold text-center mb-2">Create Your Account</h1>
          <p className="text-center text-muted-foreground mb-8">Enter your information to create an account</p>

          <FormProvider {...form}>
            <form className="grid gap-4">
              {error && <div className="text-red-500 text-center">{error}</div>}

              {step === 'personal' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" {...form.register("firstName")} placeholder="Max" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" {...form.register("lastName")} placeholder="Robinson" />
                    </div>
                  </div>

                  <Select onValueChange={handleCompanyChange} value={watch('company')}>
                    <SelectTrigger className="border-blue-500 text-blue-500">
                      <SelectValue placeholder="Select Company Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>

                  {watch('company') === 'business' && (
                    <div className="grid gap-2 mt-4">
                      <Label htmlFor="teamName">Team Name</Label>
                      <Input id="teamName" {...form.register("teamName")} placeholder="Your team name" />
                    </div>
                  )}

                  {companyDescription && (
                    <div className="mt-4">
                      <SeparatorDemo />
                      <Separator className="my-4" />
                      <p className="text-blue-500 text-sm">{companyDescription}</p>
                    </div>
                  )}
                </>
              )}

              {step === 'account' && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...form.register("email")} placeholder="m@example.com" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" {...form.register("password")} placeholder="••••••••" />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="userImage">Profile Picture</Label>
                    <Input id="userImage" type="file" accept="image/*" onChange={handleFileChange} />
                    <Avatar>
                      {userImage ? (
                        <AvatarImage src={userImage as string} />
                      ) : (
                        <AvatarFallback>
                          {watch('firstName')[0]}{watch('lastName')[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                </>
              )}

              {step === 'phone' && (
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" {...form.register("phone")} placeholder="123-456-7890" />
                </div>
              )}

              {step === 'otp' && (
                <>
                  <InputOTPForm onVerificationComplete={handleVerificationComplete} />
                  <div className="items-top flex space-x-2">
                    <Checkbox id="terms" {...form.register("terms")} />
                    <div className="grid gap-1.5 leading-none">
                      <label htmlFor="terms" className="text-sm font-medium">
                        Accept terms and conditions
                      </label>
                      <p className="text-sm text-muted-foreground">
                        You agree to our Terms of Service and Privacy Policy.
                      </p>
                    </div>
                  </div>
                </>
              )}

              <Button
                type="button"
                className={`w-full ${isStepComplete[step as keyof typeof isStepComplete] ? '' : 'opacity-50 cursor-not-allowed'}`}
                onClick={handleNext}
                disabled={!isStepComplete[step as keyof typeof isStepComplete]}
              >
                Continue
              </Button>

              {step !== 'personal' && (
                <Button variant="outline" type="button" className="w-full" onClick={handleBack}>
                  Back
                </Button>
              )}
            </form>
          </FormProvider>

          <div className="mt-4 text-center text-sm">
            Already have an account? <Link href="/login" className="underline">Sign in</Link>
          </div>
        </div>
      </div>
    </>
  );
}
