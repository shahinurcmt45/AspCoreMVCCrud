import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentCrud() {
  const [id, setId] = useState(0);
  const [stname, setName] = useState("");
  const [course, setCourse] = useState("");
  const [students, setUsers] = useState([]);

  // Backend API URL
  const API_BASE_URL = "http://localhost:2030/api/Student";

  // =====================================
  // Load Students
  // =====================================
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/GetStudent`
      );

      console.log("GET Students:", response.data);

      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Load Students Error:", error);

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      } else {
        console.error("Message:", error.message);
      }
    }
  };

  // =====================================
  // Register Student
  // =====================================
  const saveStudent = async (event) => {
    event.preventDefault();

    if (!stname.trim() || !course.trim()) {
      alert("Please fill all fields");
      return;
    }

    const studentData = {
      id: 0,
      stname: stname.trim(),
      course: course.trim(),
    };

    try {
      console.log("POST:", studentData);

      const response = await axios.post(
        `${API_BASE_URL}/AddStudent`,
        studentData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("POST Response:", response.data);

      alert("Student Registered Successfully!");

      resetForm();
      await loadStudents();

    } catch (error) {
      console.error("Registration Error:", error);

      showError("Registration failed", error);
    }
  };

  // =====================================
  // Update Student
  // =====================================
  const updateStudent = async (event) => {
    event.preventDefault();

    if (!id || id === 0) {
      alert("Please select a student first");
      return;
    }

    if (!stname.trim() || !course.trim()) {
      alert("Please fill all fields");
      return;
    }

    const studentData = {
      id: Number(id),
      stname: stname.trim(),
      course: course.trim(),
    };

    try {
      console.log("PATCH:", studentData);

      const response = await axios.patch(
        `${API_BASE_URL}/UpdateStudent/${id}`,
        studentData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("PATCH Response:", response.data);

      alert("Student Updated Successfully!");

      resetForm();
      await loadStudents();

    } catch (error) {
      console.error("Update Error:", error);

      showError("Update failed", error);
    }
  };

  // =====================================
  // Edit Student
  // =====================================
  const editStudent = (student) => {
    const studentId = student.id ?? student.Id;
    const studentName = student.stname ?? student.Stname;
    const studentCourse = student.course ?? student.Course;

    setId(Number(studentId));
    setName(studentName || "");
    setCourse(studentCourse || "");
  };

  // =====================================
  // Delete Student
  // =====================================
  const deleteStudent = async (studentId) => {
    const deleteId = Number(studentId);

    if (!deleteId || deleteId <= 0) {
      alert("Invalid student ID");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete student ID ${deleteId}?`
    );

    if (!confirmed) {
      return;
    }

    const deleteUrl =
      `${API_BASE_URL}/DeleteStudent/${deleteId}`;

    try {
      console.log("DELETE URL:", deleteUrl);

      const response = await axios.delete(deleteUrl, {
        headers: {
          Accept: "*/*",
        },
      });

      console.log("DELETE Response:", response);

      alert("Student Deleted Successfully!");

      resetForm();
      await loadStudents();

    } catch (error) {
      console.error("========== DELETE ERROR ==========");
      console.error("URL:", deleteUrl);
      console.error("Error:", error);

      if (error.response) {
        console.error(
          "HTTP Status:",
          error.response.status
        );

        console.error(
          "Response Data:",
          error.response.data
        );

        console.error(
          "Response Headers:",
          error.response.headers
        );

        alert(
          `Delete failed!\nHTTP Status: ${error.response.status}\n${
            typeof error.response.data === "string"
              ? error.response.data
              : JSON.stringify(error.response.data)
          }`
        );
      } else if (error.request) {
        console.error(
          "Request was sent but no response received:",
          error.request
        );

        alert(
          "Delete failed: No response from server.\n" +
          "Please check the backend DELETE endpoint and CORS."
        );
      } else {
        alert(
          "Delete failed: " + error.message
        );
      }
    }
  };

  // =====================================
  // Reset Form
  // =====================================
  const resetForm = () => {
    setId(0);
    setName("");
    setCourse("");
  };

  // =====================================
  // Show Error
  // =====================================
  const showError = (title, error) => {
    if (error.response) {
      const data = error.response.data;

      alert(
        `${title}\nHTTP ${error.response.status}\n` +
        (
          data?.message ||
          (typeof data === "string"
            ? data
            : JSON.stringify(data))
        )
      );
    } else if (error.request) {
      alert(
        `${title}: No response from server`
      );
    } else {
      alert(
        `${title}: ${error.message}`
      );
    }
  };

  // =====================================
  // Form Submit
  // =====================================
  const handleSubmit = (event) => {
    event.preventDefault();

    if (id === 0) {
      saveStudent(event);
    } else {
      updateStudent(event);
    }
  };

  // =====================================
  // UI
  // =====================================
  return (
    <div className="container mt-4">

      <h1>Student Details</h1>

      <form onSubmit={handleSubmit}>

        {/* Student Name */}
        <div className="form-group mb-3">
          <label>Student Name</label>

          <input
            type="text"
            className="form-control"
            value={stname}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Enter student name"
          />
        </div>

        {/* Course */}
        <div className="form-group mb-3">
          <label>Course</label>

          <input
            type="text"
            className="form-control"
            value={course}
            onChange={(event) =>
              setCourse(event.target.value)
            }
            placeholder="Enter course"
          />
        </div>

        {/* Buttons */}
        <div>

          {id === 0 ? (
            <button
              type="submit"
              className="btn btn-primary mt-2"
            >
              Register
            </button>
          ) : (
            <>
              <button
                type="submit"
                className="btn btn-warning mt-2 me-2"
              >
                Update
              </button>

              <button
                type="button"
                className="btn btn-secondary mt-2"
                onClick={resetForm}
              >
                Cancel
              </button>
            </>
          )}

        </div>
      </form>

      <br />

      {/* Students Table */}
      <table className="table table-dark text-center">

        <thead>
          <tr>
            <th>Student Id</th>
            <th>Student Name</th>
            <th>Course</th>
            <th>Option</th>
          </tr>
        </thead>

        <tbody>

          {students.length > 0 ? (

            students.map((student, index) => {

              const studentId =
                student.id ?? student.Id;

              const studentName =
                student.stname ?? student.Stname;

              const studentCourse =
                student.course ?? student.Course;

              return (
                <tr key={studentId || index}>

                  <td>{studentId}</td>

                  <td>{studentName}</td>

                  <td>{studentCourse}</td>

                  <td>

                    <button
                      type="button"
                      className="btn btn-warning me-2"
                      onClick={() =>
                        editStudent(student)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() =>
                        deleteStudent(studentId)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              );
            })

          ) : (

            <tr>
              <td colSpan="4">
                No Students Found
              </td>
            </tr>

          )}

        </tbody>
      </table>

    </div>
  );
}

export default StudentCrud;