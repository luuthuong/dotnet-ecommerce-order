using MediatR;

namespace ecommerce_order.Application.Commands;

public class SetShippingAddressCommand(
    Guid orderId,
    string street,
    string city,
    string state,
    string zipCode,
    string country)
    : IRequest
{
    public Guid OrderId { get; } = orderId;
    public string Street { get; } = street;
    public string City { get; } = city;
    public string State { get; } = state;
    public string ZipCode { get; } = zipCode;
    public string Country { get; } = country;
}