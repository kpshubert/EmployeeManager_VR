using EmployeeManager_VR.Server.Data;
using EmployeeManager_VR.Server.Models;
using EmployeeManager_VR.Server.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManager_VR.Server.Controllers
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

                    Utilities.Utilities.CopySharedPropertyValues<TEmDepartment, DepartmentViewModel>(department, newDepartmentViewModel);

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

                    Utilities.Utilities.CopySharedPropertyValues<DepartmentViewModel, TEmDepartment>(departmentViewModel, newTEmDepartment);

                    int? addResult = null;
                    string addResultError = "Department Add Failed.";

                    employeeManagerDbContext.TEmDepartments.Add(newTEmDepartment);
                    try
                    {
                        addResult = await employeeManagerDbContext.SaveChangesAsync(true);
                    }
                    catch (Exception e)
                    {
                        addResultError = e.Message;
                    }

                    if (addResult != null && addResult > 0)
                    {
                        var createdAtAction = new CreatedAtActionResult("post", "department", new { id = newTEmDepartment.Id }, newTEmDepartment);
                        actionResult = createdAtAction;
                    }
                    else
                    {
                        actionResult = BadRequest(addResultError);
                    }
                }
                else
                {
                    var rowToUpdate = await employeeManagerDbContext.TEmDepartments.Where(e => e.Id == departmentViewModel.Id).FirstOrDefaultAsync();

                    if (rowToUpdate != null)
                    {
                        var addResultError = "Department Update Failed.";
                        int? updateResult = null;

                        Utilities.Utilities.CopySharedPropertyValues<DepartmentViewModel, TEmDepartment>(departmentViewModel, rowToUpdate);

                        employeeManagerDbContext.TEmDepartments.Update(rowToUpdate);
                        try
                        {
                            updateResult = await employeeManagerDbContext.SaveChangesAsync();
                        }
                        catch (Exception e)
                        {
                            addResultError = e.Message;
                        }

                        if (updateResult != null && updateResult > 0)
                        {
                            var updatedAtAction = new AcceptedAtActionResult("post", "department", new { id = rowToUpdate.Id }, rowToUpdate);
                            actionResult = updatedAtAction;
                        }
                        else
                        {
                            actionResult = BadRequest(addResultError);
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
            IActionResult? returnValue = null;
            var deleteErrorMessage = "Department Delete Failed.";

            if (Id == null)
            {
                deleteErrorMessage = "Must specify a Department ID.";
            }
            else
            {
                TEmDepartment? departmentRow = null;

                try
                {
                    departmentRow = await employeeManagerDbContext.TEmDepartments.Where(e => e.Id == Id).FirstOrDefaultAsync();
                }
                catch (Exception e)
                {
                    deleteErrorMessage = e.Message;
                }

                if (departmentRow != null)
                {
                    if (departmentRow.TEmEmployees.Count == 0)
                    {
                        int? deleteResult = null;
                        deleteErrorMessage = "Department Delete Failed.";

                        employeeManagerDbContext.TEmDepartments.Remove(departmentRow);

                        try
                        {
                            deleteResult = await employeeManagerDbContext.SaveChangesAsync();
                        }
                        catch (Exception e)
                        {
                            deleteErrorMessage = e.Message;
                        }

                        if (deleteResult != null && deleteResult > 0)
                        {
                            returnValue = Ok();
                        }
                    }
                    else
                    {
                        deleteErrorMessage = "Department has employees assigned";
                    }

                }
                else
                {
                    returnValue = NotFound(deleteErrorMessage);
                }
            }

            returnValue ??= BadRequest(deleteErrorMessage);

            return returnValue;
        }
    }
}