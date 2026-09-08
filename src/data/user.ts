export interface User {
  name: string;
  enrollmentNumber: string;
  email: string;
  phone: string;
  department: string;
  semester: string;
}

export const mockUser: User = {
  name: "Rudra Patel",
  enrollmentNumber: "22CE001",
  email: "rudra.patel@ckpcet.ac.in",
  phone: "+91 98765 43210",
  department: "Computer Engineering",
  semester: "5th Semester",
};
