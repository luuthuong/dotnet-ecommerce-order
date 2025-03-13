using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ecommerce_order.Migrations.Pgql.QueryStore
{
    /// <inheritdoc />
    public partial class InitQueryStore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OrderViews",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CustomerName = table.Column<string>(type: "text", nullable: false),
                    OrderDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Street = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    City = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    State = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    ZipCode = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Country = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    TotalAmount = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    PaymentDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ShippingDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    TrackingNumber = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Carrier = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Version = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderViews", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OrderItemViews",
                columns: table => new
                {
                    OrderId = table.Column<Guid>(type: "uuid", nullable: false),
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    UnitPrice = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    TotalPrice = table.Column<decimal>(type: "numeric(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItemViews", x => new { x.OrderId, x.Id });
                    table.ForeignKey(
                        name: "FK_OrderItemViews_OrderViews_OrderId",
                        column: x => x.OrderId,
                        principalTable: "OrderViews",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemViews_OrderId",
                table: "OrderItemViews",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderViews_CustomerName",
                table: "OrderViews",
                column: "CustomerName");

            migrationBuilder.CreateIndex(
                name: "IX_OrderViews_Status",
                table: "OrderViews",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderItemViews");

            migrationBuilder.DropTable(
                name: "OrderViews");
        }
    }
}
