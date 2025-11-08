-- Create students_enrollments table
CREATE TABLE public.students_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  education TEXT NOT NULL,
  interested_course TEXT NOT NULL,
  appointment_scheduled BOOLEAN DEFAULT FALSE,
  form_submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  appointment_confirmed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.students_enrollments ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert (allows anyone to submit enrollment form)
CREATE POLICY "Anyone can submit enrollment" 
ON public.students_enrollments 
FOR INSERT 
WITH CHECK (true);

-- Create policy for authenticated users to view all enrollments (for admin dashboard)
CREATE POLICY "Authenticated users can view all enrollments" 
ON public.students_enrollments 
FOR SELECT 
TO authenticated
USING (true);

-- Create policy for authenticated users to update enrollments
CREATE POLICY "Authenticated users can update enrollments" 
ON public.students_enrollments 
FOR UPDATE 
TO authenticated
USING (true);

-- Add index for faster queries
CREATE INDEX idx_students_email ON public.students_enrollments(email);
CREATE INDEX idx_students_appointment ON public.students_enrollments(appointment_scheduled);
CREATE INDEX idx_students_created_at ON public.students_enrollments(created_at DESC);