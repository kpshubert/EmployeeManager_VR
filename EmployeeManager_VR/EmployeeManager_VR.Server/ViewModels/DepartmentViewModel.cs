namespace EmployeeManager_VR.Server.ViewModels
{
    public class DepartmentViewModel
    {
        public int Id { get; set; } = 0;
        public string IdString { get; set; } = "0";
        public string Name { get; set; } = string.Empty;
        public string FormMode { get; set; } = "add";

        public bool IsAssigned { get; set; } = false;
    }
}
