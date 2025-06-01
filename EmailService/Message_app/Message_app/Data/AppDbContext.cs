using System;
using System.Collections.Generic;
using Message_app.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Message_app.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Email> Email { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Server =message_app_sql ; Database =email_service;User=sa; Password=YourStrong!Password123;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        
        OnModelCreatingPartial(modelBuilder);
    }


partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

