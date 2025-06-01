namespace otherServices.Models.DTOs
{
    public class UserDto
    {
        public long UserId { get; set; }
        public string UserName { get; set; }
        public required string FName { get; set; }
        public required string LName { get; set; }
    }
}
