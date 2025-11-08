import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  studentName: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20),
  education: z.string().min(2, "Education is required").max(200),
  interestedCourse: z.string().min(1, "Please select a course"),
});

type FormData = z.infer<typeof formSchema>;

const courses = [
  "Data Science",
  "AI Based Automation Testing in Playwright",
  "AI Based Automation Testing in Cypress",
  "UI/UX Designing",
  "Devops",
  "Workflow Automation",
];

const EnrollmentForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [appointmentScheduled, setAppointmentScheduled] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const selectedCourse = watch("interestedCourse");

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    console.log("Form submitted:", data);

    try {
      // Save to database
      const { data: enrollment, error } = await supabase
        .from("students_enrollments")
        .insert({
          student_name: data.studentName,
          email: data.email,
          phone: data.phone,
          education: data.education,
          interested_course: data.interestedCourse,
          appointment_scheduled: false,
          form_submitted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        toast({
          title: "Error",
          description: "Failed to save your application. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("Enrollment saved to database:", enrollment);
      setEnrollmentId(enrollment.id);

      toast({
        title: "Application Received! 📋",
        description: "Now schedule your appointment in the calendar below.",
      });

      setFormData(data);
      setShowCalendar(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppointmentConfirm = async () => {
    setIsConfirming(true);
    console.log("Appointment confirmed with complete data");

    try {
      // Update database record
      if (enrollmentId) {
        const { error: dbError } = await supabase
          .from("students_enrollments")
          .update({
            appointment_scheduled: true,
            appointment_confirmed_at: new Date().toISOString(),
          })
          .eq("id", enrollmentId);

        if (dbError) {
          console.error("Database update error:", dbError);
        } else {
          console.log("Database updated successfully");
        }
      }

      // Send to webhook
      await fetch(
        "https://aaqibabbas03.app.n8n.cloud/webhook-test/ea8546ad-fadc-4207-a41a-576ebcd7cb74",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "no-cors",
          body: JSON.stringify({
            studentName: formData?.studentName,
            email: formData?.email,
            phone: formData?.phone,
            education: formData?.education,
            interestedCourse: formData?.interestedCourse,
            appointmentScheduled: true,
            enrollmentId: enrollmentId,
            formSubmittedAt: new Date().toISOString(),
            appointmentConfirmedAt: new Date().toISOString(),
          }),
        }
      );

      toast({
        title: "All Set! 🎉",
        description: "Your appointment has been confirmed. We'll contact you shortly!",
      });

      setAppointmentScheduled(true);
      setShowCalendar(false);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        reset();
        setAppointmentScheduled(false);
        setFormData(null);
        setEnrollmentId(null);
      }, 3000);
    } catch (error) {
      console.error("Error confirming appointment:", error);
      toast({
        title: "Confirmation Received",
        description: "Thank you! We've received your appointment confirmation.",
      });
      setAppointmentScheduled(true);
      setShowCalendar(false);
      
      setTimeout(() => {
        reset();
        setAppointmentScheduled(false);
        setFormData(null);
        setEnrollmentId(null);
      }, 3000);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-card rounded-2xl shadow-card-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Start Your Learning Journey
            </h2>
            <p className="text-muted-foreground text-lg">
              Fill out the form below and schedule a consultation with our team
            </p>
          </div>

          {appointmentScheduled ? (
            <div className="text-center py-12 space-y-6">
              <div className="w-20 h-20 mx-auto bg-secondary/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-3">
                  Success! 🎉
                </h3>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Your application and appointment have been confirmed. Our team will reach out to you soon!
                </p>
              </div>
            </div>
          ) : !showCalendar ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name *</Label>
                <Input
                  id="studentName"
                  placeholder="Enter your full name"
                  {...register("studentName")}
                  className="h-12"
                />
                {errors.studentName && (
                  <p className="text-sm text-destructive">{errors.studentName.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    {...register("email")}
                    className="h-12"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    {...register("phone")}
                    className="h-12"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education Background *</Label>
                <Input
                  id="education"
                  placeholder="e.g., Bachelor's in Computer Science"
                  {...register("education")}
                  className="h-12"
                />
                {errors.education && (
                  <p className="text-sm text-destructive">{errors.education.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="interestedCourse">Interested Course *</Label>
                <Select onValueChange={(value) => setValue("interestedCourse", value)}>
                  <SelectTrigger className="h-12 bg-background">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {courses.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.interestedCourse && (
                  <p className="text-sm text-destructive">{errors.interestedCourse.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Submit Application
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-primary/10 border-2 border-primary/20 rounded-xl p-6 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Next Step: Schedule Your Appointment
                </h3>
                <p className="text-muted-foreground mb-4">
                  Choose a convenient time to speak with our admissions team
                </p>
              </div>

              <div className="rounded-xl overflow-hidden shadow-card-lg border-2 border-primary/10">
                <iframe
                  src="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3PR-1ThwqqJ07Q1Ij4zFxoSYJhR6RktilNAnFvwFqTgPGZLUT7gQXRKQA1cdKIQg4g0f6Lon4D"
                  className="w-full h-[600px] border-0"
                  title="Schedule Appointment"
                ></iframe>
              </div>

              <div className="bg-accent/10 rounded-xl p-6 border-2 border-accent/20">
                <p className="text-center text-foreground font-medium mb-4">
                  After scheduling your appointment in the calendar above, click the button below to confirm:
                </p>
                <Button
                  className="w-full h-12 text-lg font-semibold"
                  onClick={handleAppointmentConfirm}
                  disabled={isConfirming}
                >
                  {isConfirming ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <Calendar className="mr-2 h-5 w-5" />
                      I've Scheduled My Appointment
                    </>
                  )}
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => {
                  setShowCalendar(false);
                  setFormData(null);
                  setEnrollmentId(null);
                  reset();
                }}
              >
                Go Back to Form
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EnrollmentForm;
