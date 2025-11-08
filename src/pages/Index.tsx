import HeroSection from "@/components/HeroSection";
import EnrollmentForm from "@/components/EnrollmentForm";
import CoursesSection from "@/components/CoursesSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CoursesSection />
      <EnrollmentForm />
    </div>
  );
};

export default Index;
