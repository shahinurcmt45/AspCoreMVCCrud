using Microsoft.EntityFrameworkCore;
using ReactAspCrud.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. CORS Policy Service
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("http://localhost:85")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 2. EF Core Database Context Configuration
builder.Services.AddDbContext<StudentDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("StudentDbContext")));

var app = builder.Build();

// 3. Swagger Middleware
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    c.RoutePrefix = "swagger";
});

// 4. Middleware Pipeline Order
app.UseRouting();
app.UseCors("AllowAll"); // Placed after UseRouting and before UseAuthorization
app.UseAuthorization();

app.MapControllers();

app.Run();