FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER root
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["ecommerce-order.csproj", "./"]
RUN dotnet restore "ecommerce-order.csproj"
COPY . .

WORKDIR "/src/"
RUN dotnet build "ecommerce-order.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "ecommerce-order.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app

EXPOSE 8080
EXPOSE 443

COPY --from=publish /app/publish .

RUN mkdir -p /app/https

COPY ./mycert.pfx /app/https/mycert.pfx

ENV ASPNETCORE_Kestrel__Certificates__Default__Password=@123
ENV ASPNETCORE_Kestrel__Certificates__Default__Path=/app/https/mycert.pfx

ENTRYPOINT ["dotnet", "ecommerce-order.dll"]
