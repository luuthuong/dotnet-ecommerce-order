using System.Reflection;
using System.Text.Json.Serialization;
using ecommerce_order.Application.Interfaces;
using ecommerce_order.Infrastructure.EventStore;
using ecommerce_order.Infrastructure.QueryStore;
using ecommerce_order.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Serilog;

namespace ecommerce_order;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddSerilog((sp, lc) => lc
            .ReadFrom.Configuration(configuration)
            .ReadFrom.Services(sp)
            .Enrich.FromLogContext()
            .WriteTo.Console());

        services.AddOpenApi();

        services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
            });


        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            // cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
        });

        string dbProvider = configuration.GetValue<string>("DatabaseProvider") ?? "Mssql";
        
        string? eventStoreConnectionString = configuration.GetConnectionString("EventStore");
        string? queryStoreConnectionString = configuration.GetConnectionString("QueryStore");

        Console.WriteLine("Event Store ConnectionString: {0}", eventStoreConnectionString);
        Console.WriteLine("Query Store ConnectionString: {0}", queryStoreConnectionString);

        services.AddDbContext<EventStoreDbContext>(options =>
        {
            if (dbProvider == "Mssql")
            {
                options.UseSqlServer(
                        eventStoreConnectionString,
                        sqlOptions =>
                        {
                            sqlOptions.EnableRetryOnFailure(
                                maxRetryCount: 10,
                                maxRetryDelay: TimeSpan.FromSeconds(30),
                                errorNumbersToAdd: null);

                            sqlOptions.CommandTimeout(60);
                        })
                    .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            }
            else
            {
                options.UseNpgsql(eventStoreConnectionString, pgOptions =>
                {
                    pgOptions.EnableRetryOnFailure(maxRetryCount: 10, maxRetryDelay: TimeSpan.FromSeconds(30), null);
                    pgOptions.CommandTimeout(60);
                }).ConfigureWarnings(warnings => 
                    warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning)).UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            }
        });

        services.AddDbContext<QueryDbContext>(options =>
        {
            if (dbProvider == "Mssql")
            {
                options.UseSqlServer(
                        queryStoreConnectionString,
                        sqlOptions =>
                        {
                            sqlOptions.EnableRetryOnFailure(
                                maxRetryCount: 10,
                                maxRetryDelay: TimeSpan.FromSeconds(30),
                                errorNumbersToAdd: null);

                            sqlOptions.CommandTimeout(60);
                        })
                    .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            }
            else
            {
                options.UseNpgsql(queryStoreConnectionString, pgOptions =>
                {
                    pgOptions.EnableRetryOnFailure(maxRetryCount: 10, maxRetryDelay: TimeSpan.FromSeconds(30), null);
                    pgOptions.CommandTimeout(60);
                }).UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            }
        });

        // Register repositories and services
        services.AddScoped<IEventStore, EventStore>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IQueryStore, QueryStore>();

        services.AddApiVersioning(options =>
        {
            options.ReportApiVersions = true;
            options.AssumeDefaultVersionWhenUnspecified = true;
            options.DefaultApiVersion = new Microsoft.AspNetCore.Mvc.ApiVersion(1, 0);
        });

        services.AddVersionedApiExplorer(options =>
        {
            options.GroupNameFormat = "'v'VVV";
            options.SubstituteApiVersionInUrl = true;
        });

        services.AddEndpointsApiExplorer();

        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "E-Commerce Event Sourcing API",
                Version = "v1",
                Description = "API for E-Commerce system using Event Sourcing",
                Contact = new OpenApiContact
                {
                    Name = "API Support",
                    Email = "support@ecommerce-eventsourcing.com"
                }
            });
        });

        services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", builder =>
            {
                builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .DisallowCredentials()
                    .AllowAnyHeader();
            });
        });


        return services;
    }

    public static async Task MigrateDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var services = scope.ServiceProvider;

        var eventStoreContext = services.GetRequiredService<EventStoreDbContext>();
        var queryStoreContext = services.GetRequiredService<QueryDbContext>();

        await eventStoreContext.Database.MigrateAsync();
        await queryStoreContext.Database.MigrateAsync();
    }
}