using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManager_VR.Server.Models;

[Table("tEM_Employee")]
public partial class TEmEmployee
{
    [Key]
    public int Id { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string FirstName { get; set; } = null!;

    [StringLength(100)]
    [Unicode(false)]
    public string LastName { get; set; } = null!;

    [StringLength(100)]
    [Unicode(false)]
    public string Email { get; set; } = null!;

    [StringLength(12)]
    [Unicode(false)]
    public string Phone { get; set; } = null!;

    public int DepartmentId { get; set; }

    [ForeignKey("DepartmentId")]
    [InverseProperty("TEmEmployees")]
    public virtual TEmDepartment Department { get; set; } = null!;
}
