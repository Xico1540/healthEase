using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace healthEase_backend.Migrations
{
    /// <inheritdoc />
    public partial class HealthEaseMigration__v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ResourceContent",
                table: "resources",
                type: "text",
                maxLength: 2147483647,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100000)",
                oldMaxLength: 100000);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ResourceContent",
                table: "resources",
                type: "character varying(100000)",
                maxLength: 100000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text",
                oldMaxLength: 2147483647);
        }
    }
}
