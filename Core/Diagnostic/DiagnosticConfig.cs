using System.Diagnostics;

namespace ecommerce_order.Core.Diagnostic;

public class DiagnosticConfig
{
    public static readonly ActivitySource Source = new ActivitySource("EcommerceOrder");
}