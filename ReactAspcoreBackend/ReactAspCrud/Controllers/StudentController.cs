using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactAspCrud.Models;

namespace ReactAspCrud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly StudentDbContext _studentDbContext;

        public StudentController(StudentDbContext studentDbContext)
        {
            this._studentDbContext = studentDbContext;
        }

        // GET: api/Student/GetStudent
        [HttpGet]
        [Route("GetStudent")]
        public async Task<IEnumerable<Student>> GetStudents()
        {
            return await _studentDbContext.Student.ToListAsync();
        }

        // POST: api/Student/AddStudent
        [HttpPost]
        [Route("AddStudent")]
        public async Task<Student> AddStudent([FromBody] Student objStudent)
        {
            _studentDbContext.Student.Add(objStudent);
            await _studentDbContext.SaveChangesAsync();
            return objStudent;
        }

        // PATCH: api/Student/UpdateStudent/5
        [HttpPatch]
        [Route("UpdateStudent/{id}")]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] Student objStudent)
        {
            var existingStudent = await _studentDbContext.Student.FindAsync(id);
            if (existingStudent == null)
            {
                return NotFound("Student not found");
            }

            existingStudent.stname = objStudent.stname;
            existingStudent.course = objStudent.course;

            await _studentDbContext.SaveChangesAsync();
            return Ok(existingStudent);
        }

        // DELETE: api/Student/DeleteStudent/5
        [HttpDelete]
        [Route("DeleteStudent/{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _studentDbContext.Student.FindAsync(id);
            if (student == null)
            {
                return NotFound("Student not found");
            }

            _studentDbContext.Student.Remove(student);
            await _studentDbContext.SaveChangesAsync();
            return Ok(true);
        }
    }
}