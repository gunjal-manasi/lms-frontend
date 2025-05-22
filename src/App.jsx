import "./App.css";
import Register from "./pages/auth/register/register";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/login/login";
import InstructorDashboard from "./pages/instructor-dashboard/dashboard/InstructorDashboard";
import StudentDashboard from "./pages/student-dashboard/dashboard/StudentDashboard";
import Lesson from "./pages/student-dashboard/lessons/Lesson";

function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Register />}></Route>
        <Route path="/login" element={<Login />} />
        <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
         <Route path="/lessons/:courseId" element={<Lesson />} />
         <Route path="/lessons.html" element={<Lesson />} />

      </Routes>
    </>
  );
}

export default App;
