using Message_app.Data;
using Message_app.Data.Service;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database context
var connectionString = builder.Configuration.GetConnectionString("constr");
builder.Services.AddDbContext<AppDbContext>(option =>
    option.UseSqlServer(connectionString)
);

// Kafka services
builder.Services.AddSingleton<KafkaConsumerService>();
builder.Services.AddHostedService<KafkaBackgroundConsumer>();

// ? CORS setup to allow React frontend access
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // ?? ??????? Authentication ?? Cookies
    });
});

var app = builder.Build();

// ? Use CORS before routing
app.UseCors("AllowReactApp");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

//  migration to make db first time in sql container, then we will comment it

// using (var scope = app.Services.CreateScope())
// {
//     var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
//     dbContext.Database.Migrate();
// }

app.Run();
