using System.Net;
using System.Text;
using healthEase_backend.Config.Email;
using healthEase_backend.Config.Token;
using healthEase_backend.Filter.Auth;
using healthEase_backend.Infrastructure;
using healthEase_backend.Infrastructure.FhirResourceRepository;
using healthEase_backend.Mappers;
using healthEase_backend.Model.Interfaces;
using healthEase_backend.Model.Interfaces.Auth;
using healthEase_backend.Model.Interfaces.Email;
using healthEase_backend.Model.Interfaces.Fhir;
using healthEase_backend.Model.Interfaces.Infrastructure;
using healthEase_backend.Services.Auth;
using healthEase_backend.Services.Email;
using healthEase_backend.Services.Fhir;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

var connectionString = configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ConnectionContext>(options =>
    options.UseNpgsql(connectionString)
);

var allowedResourceTypes = configuration["AllowedResourceTypes"];
if (string.IsNullOrEmpty(allowedResourceTypes))
{
    throw new Exception(
        "AllowedResourceTypes configuration is missing. Please set it in the environment or appsettings.json");
}

builder.Services.AddHttpContextAccessor();

builder.Services.Configure<JwtConfig>(configuration.GetSection("Jwt"));
builder.Services.Configure<EmailConfig>(configuration.GetSection("EmailSettings"));
builder.Services.AddScoped<ISmtpClient>(provider =>
{
    var emailConfig = provider.GetRequiredService<IOptions<EmailConfig>>().Value;
    return new SmtpClient(emailConfig.SmtpServer, emailConfig.Port)
    {
        Credentials = new NetworkCredential(emailConfig.FromEmail, emailConfig.AppPassword),
        EnableSsl = emailConfig.EnableSsl
    };
});

builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IFhirResourceRepository, FhirResourceRepository>();
builder.Services.AddScoped<IFhirResourceService, FhirResourceService>();
builder.Services.AddScoped<IAllowedResourcesService, AllowedResourcesService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<FhirPatientMapper>();
builder.Services.AddScoped<IFhirService, FhirService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAuthorizationService, AuthorizationService>();
builder.Services.AddScoped<UserClaimsFilter>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException("JWT key is missing in configuration.");
}

var keyBytes = Encoding.ASCII.GetBytes(jwtKey);
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: 'Authorization: Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policyBuilder =>
    {
        policyBuilder.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ConnectionContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
