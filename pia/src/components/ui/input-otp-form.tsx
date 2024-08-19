import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const FormSchema = z.object({
  pin: z.string().length(6, {
    message: "Your one-time password must be 6 characters.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type FormValues = z.infer<typeof FormSchema>;

interface InputOTPFormProps {
  onVerificationComplete: () => void;
}

export function InputOTPForm({ onVerificationComplete }: InputOTPFormProps) {
  const form = useFormContext<FormValues>();

  const { watch, setValue } = form;

  const pin = watch('pin');
  const termsAccepted = watch('terms');

  const handleButtonClick = async () => {
    if (pin.length === 6) {
      const phone = watch('phone');
      try {
        const response = await fetch('/api/otp/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone, otp: pin }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Verification failed');
        }

        toast({
          title: "OTP Verified!",
          description: "Your phone number has been successfully verified.",
        });
        onVerificationComplete();
      } catch (error) {
        console.error('OTP verification error:', error);
        toast({
          title: "OTP Verification Failed",
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid OTP before verifying.",
      });
    }
  };

  return (
    <FormField
      control={form.control}
      name="pin"
      render={({ field }) => (
        <FormItem>
          <FormLabel>One-Time Password</FormLabel>
          <FormControl>
            <InputOTP
              maxLength={6}
              {...field}
              onComplete={(value: string) => {
                setValue('pin', value);
              }}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </FormControl>
          <FormDescription>
            Please enter the one-time password sent to your phone.
          </FormDescription>
          <Button
            type="button"
            className="w-full"
            onClick={handleButtonClick}
           
          >
            Verify account
          </Button>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
