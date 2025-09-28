using EmployeeManager_VR.Server.Data;
using EmployeeManager_VR.Server.Models;
using EmployeeManager_VR.Server.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManager_VR.Server.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class EmployeeController(ILogger<EmployeeController> logger, EmployeeManagerDbContext employeeManagerDbContext) : ControllerBase
    {
        private readonly ILogger<EmployeeController> _logger = logger;

        [HttpGet(Name = "GetEmployee")]
        public async Task<IEnumerable<EmployeeViewModel>?> Get(int? id, string? mode, string? filter)
        {
            List<TEmEmployee>? employees = null;

            List<EmployeeViewModel>? returnValue = null;
            var fetchErrorMessage = "Employee(s) fetch failed";

            if (id != null && id != 0)
            {
                try
                {
                    employees = await employeeManagerDbContext.TEmEmployees.Include(dept => dept.Department).Where(e => e.Id == id).ToListAsync();
                }
                catch (Exception e)
                {
                    fetchErrorMessage = e.Message;
                }
            }
            else
            {
                if (mode != null && mode.ToLower() == "list")
                {
                    try
                    {
                        employees = await employeeManagerDbContext.TEmEmployees.Include(dept => dept.Department).ToListAsync();
                    }
                    catch (Exception e)
                    {
                        fetchErrorMessage = e.Message;
                    }
                }
            }

            if (employees != null && employees.Count > 0)
            {
                var currentRow = 0;
                foreach (var employee in employees)
                {
                    var newEmployeeViewModel = new EmployeeViewModel();

                    Utilities.Utilities.CopySharedPropertyValues<TEmEmployee, EmployeeViewModel>(employee, newEmployeeViewModel);
                    newEmployeeViewModel.DepartmentId = employee.DepartmentId;
                    newEmployeeViewModel.DepartmentIdString = newEmployeeViewModel.DepartmentId.ToString();
                    newEmployeeViewModel.RowNum = currentRow;

                    if (employee.Department != null && employee.Department.Name != null)
                    {
                        newEmployeeViewModel.DepartmentName = employee.Department.Name;
                        if (mode != "list")
                        {
                            newEmployeeViewModel.FormMode = "edit";
                        }
                    }

                    returnValue ??= [];

                    returnValue.Add(newEmployeeViewModel);
                    currentRow++;
                }
            }
            else
            {
                var newEmployeeViewModel = new EmployeeViewModel
                {
                    FormMode = "add",
                    DepartmentId = 0,
                    DepartmentIdString = ""
                };

                returnValue ??= [];

                returnValue.Add(new EmployeeViewModel());
            }

            return returnValue;
        }

        [HttpPost(Name = "PostEmployee")]
        public async Task<IActionResult> Post([FromBody] EmployeeViewModel employeeViewModel)
        {
            var errorMessage = "Employee Add or Update Failed";
            IActionResult? actionResult = null;

            if (employeeViewModel != null)
            {
                if (employeeViewModel.FormMode == "add")
                {
                    var newTEmEmployee = new TEmEmployee();

                    Utilities.Utilities.CopySharedPropertyValues<EmployeeViewModel, TEmEmployee>(employeeViewModel, newTEmEmployee);

                    employeeManagerDbContext.TEmEmployees.Add(newTEmEmployee);
                    var addResult = await employeeManagerDbContext.SaveChangesAsync(true);

                    if (addResult > 0)
                    {
                        var createdAtAction = new CreatedAtActionResult("post", "employee", new { id = newTEmEmployee.Id }, newTEmEmployee);
                        actionResult = createdAtAction;
                    }
                    else
                    {
                        actionResult = BadRequest("Could not be added.");
                    }
                }
                else
                {
                    TEmEmployee? rowToUpdate = null;

                    try
                    {
                        rowToUpdate = await employeeManagerDbContext.TEmEmployees.Where(e => e.Id == employeeViewModel.Id).FirstOrDefaultAsync();
                    }
                    catch (Exception e)
                    {
                        errorMessage = e.Message;
                    }

                    if (rowToUpdate != null)
                    {
                        int? updateResult = null;
                        Utilities.Utilities.CopySharedPropertyValues<EmployeeViewModel, TEmEmployee>(employeeViewModel, rowToUpdate);

                        employeeManagerDbContext.TEmEmployees.Update(rowToUpdate);

                        try
                        {
                            updateResult = await employeeManagerDbContext.SaveChangesAsync();
                        }
                        catch(Exception e)
                        {
                            errorMessage = e.Message;
                        }

                        if (updateResult != null && updateResult > 0)
                        {
                            var returnEmployeeViewModel = new EmployeeViewModel();
                            var usedDepartmentName = await employeeManagerDbContext.TEmDepartments.Where(department => department.Id == rowToUpdate.DepartmentId).Select(department => department.Name).FirstOrDefaultAsync();
                            Utilities.Utilities.CopySharedPropertyValues<TEmEmployee, EmployeeViewModel>(rowToUpdate, returnEmployeeViewModel);
                            returnEmployeeViewModel.DepartmentName = usedDepartmentName ?? "";
                            var updatedAtAction = new AcceptedAtActionResult("post", "employee", new { id = rowToUpdate.Id }, returnEmployeeViewModel);
                            actionResult = updatedAtAction;
                        }
                        else
                        {
                            errorMessage = "Employee Update Failed.";
                        }
                    }
                    else
                    {
                        errorMessage = "Employee Record not found.";
                    }
                }
            }

            actionResult ??= BadRequest(errorMessage);

            return actionResult;
        }

        [HttpDelete(Name = "DeleteEmployee")]
        public async Task<IActionResult> Delete(int? Id)
        {
            var deleteErrorMessage = "Employee Delete Failed";

            IActionResult? returnValue = null;

            if (Id == null)
            {
                deleteErrorMessage = "Must specify an ID.";
                returnValue = BadRequest(deleteErrorMessage);
            }
            else
            {
                TEmEmployee? employeeRow = null;

                try
                {
                    employeeRow = await employeeManagerDbContext.TEmEmployees.Where(e => e.Id == Id).FirstOrDefaultAsync();
                }
                catch (Exception ex)
                {
                    deleteErrorMessage += ex.Message;
                }

                if (employeeRow != null)
                {
                    int? deleteResult = null;
                    employeeManagerDbContext.TEmEmployees.Remove(employeeRow);
                    try
                    {
                        deleteResult = await employeeManagerDbContext.SaveChangesAsync();
                    }
                    catch (Exception e)
                    {
                        deleteErrorMessage += e.Message;
                    }

                    if (deleteResult != null && deleteResult > 0)
                    {
                        returnValue = Ok();
                    }
                    else
                    {
                        deleteErrorMessage = "Employee Delete Failed.";
                    }
                }
                else
                {
                    returnValue = NotFound("Employee Not Found.");
                }
            }

            returnValue ??= BadRequest(deleteErrorMessage);

            return returnValue;
        }
    }
}