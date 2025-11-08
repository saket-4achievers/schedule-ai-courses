import { Code, Palette, Server, Workflow, Brain, TestTube } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const courses = [
  {
    icon: Brain,
    title: "Data Science",
    description: "Master Python, machine learning, and data visualization to unlock insights from complex datasets.",
    color: "text-primary",
  },
  {
    icon: TestTube,
    title: "AI Automation Testing",
    description: "Learn cutting-edge AI-powered testing with Playwright and Cypress for robust applications.",
    color: "text-secondary",
  },
  {
    icon: Palette,
    title: "UI/UX Designing",
    description: "Create stunning user experiences with modern design principles and industry-standard tools.",
    color: "text-accent",
  },
  {
    icon: Server,
    title: "DevOps",
    description: "Build, deploy, and scale applications with CI/CD, containerization, and cloud infrastructure.",
    color: "text-primary",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "Streamline business processes and boost productivity with no-code automation solutions.",
    color: "text-secondary",
  },
  {
    icon: Code,
    title: "Full Stack Development",
    description: "Become a versatile developer with expertise in both frontend and backend technologies.",
    color: "text-accent",
  },
];

const CoursesSection = () => {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Popular Courses
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Industry-aligned curriculum designed to give you practical skills and real-world experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <Card
              key={index}
              className="group hover:shadow-card-lg transition-all duration-300 border-2 hover:border-primary/20"
            >
              <CardHeader>
                <div className={`w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${course.color}`}>
                  <course.icon className="w-7 h-7" />
                </div>
                <CardTitle className="text-xl">{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{course.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
