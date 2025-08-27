using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManager_VR.Server.Models;

[Table("tEM_Department")]
public partial class TEmDepartment
{
    [Key]
    public int Id { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string Name { get; set; } = null!;

    [InverseProperty("Department")]
    public virtual ICollection<TEmEmployee> TEmEmployees { get; set; } = new List<TEmEmployee>();
}
