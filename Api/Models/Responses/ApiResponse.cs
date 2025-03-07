namespace ecommerce_order.Api.Models.Responses;

public class ApiResponse<T>
{
    public bool IsSuccess { get; init; } 
    public string? Message { get; set; }
    public T? Data { get; set; }
        
    public static ApiResponse<T> Success(T data, string message = "Operation completed successfully")
    {
        return new ApiResponse<T>
        {
            IsSuccess = true,
            Message = message,
            Data = data
        };
    }
        
    public static ApiResponse<T> Fail(string message)
    {
        return new ApiResponse<T>
        {
            IsSuccess = false,
            Message = message,
            Data = default
        };
    }
}