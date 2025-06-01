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

    public virtual DbSet<Message> Messages { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Server =message_app_sql ; Database =message_service;User=sa;Password=YourStrong!Password123;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PK_Message");

            entity.ToTable("Message");

            entity.Property(e => e.MessageId).HasColumnName("MessageId");
            entity.Property(e => e.SenderId).HasColumnName("SenderId");
            entity.Property(e => e.ReceiverId).HasColumnName("ReceiverId");

            entity.Property(e => e.Content)
                .HasMaxLength(255)
                .HasColumnName("Content");

            entity.Property(e => e.DateMessage)
                .HasColumnType("datetime")
                .HasColumnName("DateMessage");
        });

        OnModelCreatingPartial(modelBuilder);
    }


partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

