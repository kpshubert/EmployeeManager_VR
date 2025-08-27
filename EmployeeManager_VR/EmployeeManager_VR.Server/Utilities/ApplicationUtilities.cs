using EmployeeManager_VR.Server.Data;

namespace EmployeeManager_VR.Server.Utilities
{
    public static class ApplicationUtilities
    {
        public static Dictionary<int, string> GetDepartments(EmployeeManagerDbContext employeeManagerDbContext)
        {
            var returnValue = new Dictionary<int, string>();

            if (employeeManagerDbContext != null)
            {
                var departmentsFromTable = employeeManagerDbContext.TEmDepartments.ToList();

                if (departmentsFromTable != null && departmentsFromTable.Count > 0)
                {
                    foreach (var department in departmentsFromTable)
                    {
                        returnValue.Add(department.Id, department.Name);
                    }
                }
            }

            return returnValue;
        }
    }
}
