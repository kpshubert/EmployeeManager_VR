namespace EmployeeManager_VR.Server.ViewModels
{
    public class EmployeeViewModel
    {
        public int RowNum { get; set; } = 0;
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Phone {  get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int DepartmentId { get; set; } = 0;
        public string DepartmentIdString { get; set; } = string.Empty;
        public string DepartmentName {  get; set; } = string.Empty;
        public string FormMode { get; set; } = "add";
    }
}
