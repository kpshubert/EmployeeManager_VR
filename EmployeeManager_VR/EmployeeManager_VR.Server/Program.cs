using EmployeeManager_VR.Server.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var EmployeeMangerConnection = builder.Configuration.GetConnectionString("EmployeeManagerConnection") ?? throw new InvalidOperationException("Connection string 'EmployeeManagerConnection' not found");

builder.Services.AddDbContext<EmployeeManagerDbContext>(
    options => options.UseSqlServer(EmployeeMangerConnection));


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
