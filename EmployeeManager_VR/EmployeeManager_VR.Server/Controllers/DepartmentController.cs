using EmployeeManager_VR.Server.Data;
using EmployeeManager_VR.Server.Models;
using EmployeeManager_VR.Server.ViewModels;
using EmployeeManager_VR.Server.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManager_VA.Server.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class DepartmentController(ILogger<DepartmentController> logger, EmployeeManagerDbContext employeeManagerDbContext) : ControllerBase
    {
        private readonly ILogger<DepartmentController> _logger = logger;

        [HttpGet(Name = "GetDepartment")]
        public async Task<IEnumerable<DepartmentViewModel>?> Get(int? id, string? mode, string? filter)
        {
            var departments = new List<TEmDepartment>();
            List<DepartmentViewModel>? returnValue = null;

            if (id != null && id != 0)
            {
                departments = await employeeManagerDbContext.TEmDepartments.Include(employees => employees.TEmEmployees).Where(e => e.Id == id).ToListAsync();
            }
            else
            {
                if (mode != null && mode.Equals("list", StringComparison.CurrentCultureIgnoreCase))
                {
                    departments = await employeeManagerDbContext.TEmDepartments.Include(employees => employees.TEmEmployees).ToListAsync();
                }
            }

            if (departments != null && departments.Count > 0)
            {
                var currentRow = 0;
                foreach (var department in departments)
                {
                    var newDepartmentViewModel = new DepartmentViewModel();

                    Utilities.CopySharedPropertyValues<TEmDepartment, DepartmentViewModel>(department, newDepartmentViewModel);

                    if (department.Name != null)
                    {
                        newDepartmentViewModel.IsAssigned = department.TEmEmployees != null && department.TEmEmployees.Count != 0;
                        newDepartmentViewModel.IdString = department.Id.ToString();
                        if (mode != "list")
                        {
                            newDepartmentViewModel.FormMode = "edit";
                        }
                    }

                    returnValue ??= [];

                    returnValue.Add(newDepartmentViewModel);
                    currentRow++;
                }
            }
            else
            {
                var newDepartmentViewModel = new DepartmentViewModel
                {
                    FormMode = "add",
                };

                returnValue ??= [];

                returnValue.Add(new DepartmentViewModel());
            }

            return returnValue;
        }

        [HttpPost(Name = "PostDepartment")]
        public async Task<IActionResult> Post([FromBody] DepartmentViewModel departmentViewModel)
        {
            IActionResult actionResult = BadRequest("Unknown Error");

            if (departmentViewModel != null)
            {
                if (departmentViewModel.FormMode == "add")
                {
                    var newTEmDepartment = new TEmDepartment();

                    Utilities.CopySharedPropertyValues<DepartmentViewModel, TEmDepartment>(departmentViewModel, newTEmDepartment);

                    employeeManagerDbContext.TEmDepartments.Add(newTEmDepartment);
                    var addResult = await employeeManagerDbContext.SaveChangesAsync(true);

                    if (addResult > 0)
                    {
                        var createdAtAction = new CreatedAtActionResult("post", "department", new { id = newTEmDepartment.Id }, newTEmDepartment);
                        actionResult = createdAtAction;
                    }
                    else
                    {
                        actionResult = BadRequest("Could not be added.");
                    }
                }
                else
                {
                    var rowToUpdate = await employeeManagerDbContext.TEmDepartments.Where(e => e.Id == departmentViewModel.Id).FirstOrDefaultAsync();

                    if (rowToUpdate != null)
                    {
                        Utilities.CopySharedPropertyValues<DepartmentViewModel, TEmDepartment>(departmentViewModel, rowToUpdate);

                        employeeManagerDbContext.TEmDepartments.Update(rowToUpdate);

                        var updateResult = await employeeManagerDbContext.SaveChangesAsync();

                        if (updateResult > 0)
                        {
                            var updatedAtAction = new AcceptedAtActionResult("post", "department", new { id = rowToUpdate.Id }, rowToUpdate);
                            actionResult = updatedAtAction;
                        }
                        else
                        {
                            actionResult = BadRequest("Department Update Failed.");
                        }
                    }
                    else
                    {
                        actionResult = BadRequest("Department Record not found.");
                    }
                }
            }
            return actionResult;
        }

        [HttpDelete(Name = "DeleteDepartment")]
        public async Task<IActionResult> Delete(int? Id)
        {
            IActionResult returnValue;

            if (Id == null)
            {
                returnValue = BadRequest("Must specify an ID.");
            }
            else
            {
                var departmentRow = await employeeManagerDbContext.TEmDepartments.Where(e => e.Id == Id).FirstOrDefaultAsync();

                if (departmentRow != null)
                {
                    if (departmentRow.TEmEmployees.Count == 0)
                    {
                        employeeManagerDbContext.TEmDepartments.Remove(departmentRow);
                        var deleteResult = await employeeManagerDbContext.SaveChangesAsync();

                        if (deleteResult > 0)
                        {
                            returnValue = Ok();
                        }
                        else
                        {
                            returnValue = NotFound("Department Delete Failed.");
                        }
                    }
                    else
                    {
                        returnValue = BadRequest("Department has employees assigned");
                    }
                }
                else
                {
                    returnValue = NotFound("Department Not Found.");
                }
            }
            return returnValue;
        }
    }
}