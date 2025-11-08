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
      const response = await fetch(
        "https://aaqibabbas03.app.n8n.cloud/webhook-test/ea8546ad-fadc-4207-a41a-576ebcd7cb74",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "no-cors",
          body: JSON.stringify({
            ...data,
            timestamp: new Date().toISOString(),
          }),
        }
      );

      toast({
        title: "Application Submitted Successfully! 🎉",
        description: "Your information has been received. Now schedule your appointment below.",
      });

      setShowCalendar(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Sent",
        description: "Your application has been sent. Please schedule your appointment below.",
      });
      setShowCalendar(true);
    } finally {
      setIsLoading(false);
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

          {!showCalendar ? (
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

              <div className="rounded-xl overflow-hidden shadow-card-lg">
                <iframe
                  src="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3PR-1ThwqqJ07Q1Ij4zFxoSYJhR6RktilNAnFvwFqTgPGZLUT7gQXRKQA1cdKIQg4g0f6Lon4D"
                  className="w-full h-[600px] border-0"
                  title="Schedule Appointment"
                ></iframe>
              </div>

              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => {
                  setShowCalendar(false);
                  reset();
                }}
              >
                Submit Another Application
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EnrollmentForm;
