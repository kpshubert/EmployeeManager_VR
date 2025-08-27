using EmployeeManager_VR.Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace EmployeeManager_VR.Server.Data;

public partial class EmployeeManagerDbContext : DbContext
{
    private readonly string employeeManagerConnectionString = string.Empty;
    private readonly string appConfigConnectionName = "EmployeeManagerConnection";

    public EmployeeManagerDbContext()
    {
        var employeeManagerConnectionStringToUse = Utilities.Utilities.GetAppSetting($"ConnectionStrings:{appConfigConnectionName}");

        if (!string.IsNullOrWhiteSpace(employeeManagerConnectionStringToUse))
        {
            employeeManagerConnectionString += employeeManagerConnectionStringToUse;
        }
    }

    public EmployeeManagerDbContext(DbContextOptions<EmployeeManagerDbContext> options)
        : base(options)
    {
        var employeeManagerConnectionStringToUse = Utilities.Utilities.GetAppSetting($"ConnectionStrings:{appConfigConnectionName}");

        if (!string.IsNullOrWhiteSpace(employeeManagerConnectionStringToUse))
        {
            employeeManagerConnectionString += employeeManagerConnectionStringToUse;
        }
    }

    public virtual DbSet<TEmDepartment> TEmDepartments { get; set; }

    public virtual DbSet<TEmEmployee> TEmEmployees { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer(employeeManagerConnectionString);

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TEmEmployee>(entity =>
        {
            entity.HasOne(d => d.Department).WithMany(p => p.TEmEmployees)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tEM_Department_Id");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
