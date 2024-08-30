'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SeparatorDemo } from '@/components/ui/message-profil-type';
import { InputOTPForm } from '@/components/ui/input-otp-form';
import { toast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
// Supprimer l'importation de PhoneInput
// import { PhoneInput } from '@/components/phone-input';
import { useUserRegister } from '@/hook/useUserRegister';

export default function RegisterForm() {
  const {
    form,
    step,
    error,
    companyDescription,
    userImage,
    isStepComplete,
    watch,
    handleCompanyChange,
    handleFileChange,
    handleRemoveImage,
    handleNext,
    handleBack,
    handleVerificationComplete,
    setError,
  } = useUserRegister();
  
  return (
    <>
      <div className="flex flex-col min-h-screen items-center py-12">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-2">Create Your Account</h1>
          <p className="text-center text-muted-foreground mb-8">Enter your information to create an account</p>

          <FormProvider {...form}>
            <form className="grid gap-4">
              {error && <div className="text-red-500 text-center mb-4">{error}</div>}

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

                  <div className="mt-4">
                    <Label htmlFor="company">Company Type</Label>
                    <Select onValueChange={handleCompanyChange} value={watch('company')}>
                      <SelectTrigger className="border-blue-500 text-blue-500">
                        <SelectValue placeholder="Select Company Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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
                  <div className="flex items-end gap-4 mt-4">
                    <div className="flex flex-col w-full max-w-sm gap-1.5">
                      <Label htmlFor="userImage">Profile Picture</Label>
                      <Input id="userImage" type="file" accept="image/*" onChange={handleFileChange} />
                    </div>
                    <div className="flex items-end">
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
                  </div>
                  {userImage && (
                    <Button type="button" variant="secondary" onClick={handleRemoveImage}>
                      Remove Image
                    </Button>
                  )}
                </>
              )}

              {step === 'otp' && (
                <>
                  <InputOTPForm onVerificationComplete={handleVerificationComplete} />
                  <div className="items-top flex space-x-2 mt-4">
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
                className={`w-full ${isStepComplete[step as keyof typeof isStepComplete] ? '' : 'opacity-50 cursor-not-allowed'} mt-4`}
                onClick={handleNext}
                disabled={!isStepComplete[step as keyof typeof isStepComplete]}
              >
                {step === 'email' ? 'Verify Email' : 'Continue'}
              </Button>

              {step !== 'personal' && (
                <Button variant="outline" type="button" className="w-full mt-2" onClick={handleBack}>
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
