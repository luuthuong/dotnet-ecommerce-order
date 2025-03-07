using ecommerce_order;
using ecommerce_order.Core.Diagnostic;
using OpenTelemetry;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("appsettings.json", false);

if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddJsonFile("appsettings.Development.json", true, true);
}


builder.Services.AddInfrastructureServices(builder.Configuration);

builder.Services.AddOpenTelemetry()
    .ConfigureResource(
        rb => rb.AddService(DiagnosticConfig.Source.Name)
    )
    .WithTracing(
        tracing => tracing.AddAspNetCoreInstrumentation().AddSource(DiagnosticConfig.Source.Name))
    .UseOtlpExporter();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "E-Commerce Event Sourcing API v1"));

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseRouting();
app.UseAuthorization();
app.MapControllers();

await app.MigrateDatabaseAsync();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.Run();