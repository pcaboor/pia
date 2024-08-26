// hooks/useUserRegister.ts
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/components/ui/use-toast';

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
}).refine(data => data.company !== 'business' || data.teamName, {
  message: "Team name is required for business accounts",
  path: ["teamName"],
});

type FormData = z.infer<typeof FormSchema>;
type Step = 'personal' | 'account' | 'phone' | 'otp';

export const useUserRegister = () => {
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

  const { watch, setValue } = form;

  const handleCompanyChange = (value: string) => {
    setValue('company', value);
    setCompanyDescription(value === 'business'
      ? 'Business accounts are for companies and organizations with additional features.'
      : value === 'personal'
        ? 'Personal accounts are for individual use with standard features.'
        : '');
  };

  const handleFileChange = (file: File | null) => {
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

  const handleRemoveImage = () => {
    setProfileImage(null);
    setValue('userImage', '');
  };

  const isStepComplete = {
    personal: watch('firstName') && watch('lastName') && watch('company') && (watch('company') !== 'business' || watch('teamName')),
    account: watch('email') && watch('password'),
    phone: watch('phone'),
    otp: watch('pin')?.length === 6 && watch('terms'),
  };

  const handleNext = async () => {
    if (!isStepComplete[step]) {
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

  return {
    form,
    step,
    watch,
    error,
    companyDescription,
    userImage,
    isStepComplete,
    handleCompanyChange,
    handleFileChange,
    handleRemoveImage,
    handleNext,
    handleBack,
    handleVerificationComplete,
    setError,
  };
};