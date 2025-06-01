using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace otherServices.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    userId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    fName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    lName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    flag_waiting_user = table.Column<int>(type: "int", nullable: false),
                    Role_name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Pass = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Users__CB9A1CFFDCE0066F", x => x.userId);
                });

            migrationBuilder.CreateTable(
                name: "messages",
                columns: table => new
                {
                    message_Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    senderId = table.Column<long>(type: "bigint", nullable: false),
                    recieverId = table.Column<long>(type: "bigint", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    date_messge = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__messages__0BBC6ACE1FC3A57E", x => x.message_Id);
                    table.ForeignKey(
                        name: "FK__messages__date_m__18EBB532",
                        column: x => x.senderId,
                        principalTable: "Users",
                        principalColumn: "userId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK__messages__tenant__19DFD96B",
                        column: x => x.recieverId,
                        principalTable: "Users",
                        principalColumn: "userId");
                });

            migrationBuilder.CreateTable(
                name: "posts",
                columns: table => new
                {
                    post_Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Landlord_id = table.Column<long>(type: "bigint", nullable: false),
                    title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Price = table.Column<double>(type: "float", nullable: false),
                    location = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    rental_status = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    flag_waiting_post = table.Column<long>(type: "bigint", nullable: false),
                    ImagePath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    date_post = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__posts__3ED48BBE6C5F48C0", x => x.post_Id);
                    table.ForeignKey(
                        name: "FK__posts__date_post__66603565",
                        column: x => x.Landlord_id,
                        principalTable: "Users",
                        principalColumn: "userId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    CommentId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Post_Id = table.Column<long>(type: "bigint", nullable: false),
                    user_Id = table.Column<long>(type: "bigint", nullable: false),
                    description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    date_comment = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Comments__99FC14DBFDFD4C38", x => x.CommentId);
                    table.ForeignKey(
                        name: "FK_Comments_PostId",
                        column: x => x.Post_Id,
                        principalTable: "posts",
                        principalColumn: "post_Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Comments_UserId",
                        column: x => x.user_Id,
                        principalTable: "Users",
                        principalColumn: "userId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Proposals",
                columns: table => new
                {
                    ProposalId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PostId = table.Column<long>(type: "bigint", nullable: false),
                    TenantId = table.Column<long>(type: "bigint", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    StartRentalDate = table.Column<DateTime>(type: "date", nullable: false),
                    EndRentalDate = table.Column<DateTime>(type: "date", nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    RentalStatus = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Proposals", x => x.ProposalId);
                    table.ForeignKey(
                        name: "FK_Proposals_Users_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Users",
                        principalColumn: "userId",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_Proposals_posts_PostId",
                        column: x => x.PostId,
                        principalTable: "posts",
                        principalColumn: "post_Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "reserved_Saved",
                columns: table => new
                {
                    tenant_Id = table.Column<long>(type: "bigint", nullable: false),
                    Post_Id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__reserved__1370CC3C9E94BEED", x => new { x.tenant_Id, x.Post_Id });
                    table.ForeignKey(
                        name: "FK__reserved___Post___7D439ABD",
                        column: x => x.Post_Id,
                        principalTable: "posts",
                        principalColumn: "post_Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK__reserved___tenan__7C4F7684",
                        column: x => x.tenant_Id,
                        principalTable: "Users",
                        principalColumn: "userId");
                });

            migrationBuilder.CreateTable(
                name: "Saved_Post",
                columns: table => new
                {
                    tenant_Id = table.Column<long>(type: "bigint", nullable: false),
                    Post_Id = table.Column<long>(type: "bigint", nullable: false),
                    date_saved = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Saved_Po__1370CC3CF5ACF434", x => new { x.tenant_Id, x.Post_Id });
                    table.ForeignKey(
                        name: "FK__Saved_Pos__Post___04E4BC85",
                        column: x => x.Post_Id,
                        principalTable: "posts",
                        principalColumn: "post_Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK__Saved_Pos__tenan__03F0984C",
                        column: x => x.tenant_Id,
                        principalTable: "Users",
                        principalColumn: "userId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Comments_Post_Id",
                table: "Comments",
                column: "Post_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_user_Id",
                table: "Comments",
                column: "user_Id");

            migrationBuilder.CreateIndex(
                name: "IX_messages_recieverId",
                table: "messages",
                column: "recieverId");

            migrationBuilder.CreateIndex(
                name: "IX_messages_senderId",
                table: "messages",
                column: "senderId");

            migrationBuilder.CreateIndex(
                name: "IX_posts_Landlord_id",
                table: "posts",
                column: "Landlord_id");

            migrationBuilder.CreateIndex(
                name: "IX_Proposals_PostId",
                table: "Proposals",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_Proposals_TenantId",
                table: "Proposals",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_reserved_Saved_Post_Id",
                table: "reserved_Saved",
                column: "Post_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Saved_Post_Post_Id",
                table: "Saved_Post",
                column: "Post_Id");

            migrationBuilder.CreateIndex(
                name: "UQ__Users__AB6E6164944D8BF6",
                table: "Users",
                column: "email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropTable(
                name: "messages");

            migrationBuilder.DropTable(
                name: "Proposals");

            migrationBuilder.DropTable(
                name: "reserved_Saved");

            migrationBuilder.DropTable(
                name: "Saved_Post");

            migrationBuilder.DropTable(
                name: "posts");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
