﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
//using otherServices.Data;
using otherServices.Models;
using otherServices.Models.DTOs;
using otherServices.Services;
using WebAPIDotNet.DTOs;
using WebAPIDotNet.Services;

//using otherServices.Data.Models;

namespace otherServices.Controllers
{
    //[Authorize(Roles = "landlord")]
    [Route("api/[controller]")]
    [ApiController]
    public class LandlordController : ControllerBase
    {
        private readonly AppDbContext2 _db;
        private readonly ILandlordService landlordService;

        public LandlordController(AppDbContext2 db,ILandlordService landlordService)
        {
            this.landlordService = landlordService;
            this._db = db;
        }

        [HttpPost("create-post/{landlordId}")]

        public async Task<IActionResult> CreatePost(long landlordId,[FromForm] CreatePostDTO postDto)
        {
            try
            {
                var createdPost = await landlordService.Create_Post(landlordId,postDto);
                return CreatedAtAction(nameof(GetPostById), new { id = createdPost.PostId }, createdPost);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("get-post/{id}")]
        public async Task<IActionResult> GetPostById(long id)
        {
            try
            {
                var post = await landlordService.Get_Post_By_Id(id);
                return Ok(post);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the post" });
            }
        }

        [HttpGet("get-my-posts/{landlordId}")]
        public async Task<IActionResult> GetPostsByLandlord(long landlordId)
        {
            try
            {
                var posts = await landlordService.Get_Posts_By_LandlordId(landlordId);
                return Ok(posts);
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving posts" });
            }
        }

        [HttpDelete("delete-post/{id}")]
        public async Task<IActionResult> DeletePost(long id)
        {
            try
            {
                var result = await landlordService.Delete_Post(id);
                if (!result)
                    return NotFound(new { message = "Post not found" });

                return Ok(new { message = "Post deleted successfully" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the post" });
            }
        }

        [HttpPut("edit-post/{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdatePost(long id, [FromForm] UpdatePostDTO updateDto)
        {
            try
            {
                var updatedPost = await landlordService.Update_Post(id, updateDto);
                return Ok(updatedPost);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An error occurred while updating the post" });
            }
        }


        
        [HttpGet("proposals/{landlordId}")]
        public async Task<IActionResult> GetProposalsForLandlord(long landlordId)
        {
            try
            {
                var proposals = await landlordService.GetLandlordProposalsAsync(landlordId);
                if (proposals == null)
                {
                    return NotFound(new { message = "No proposals found for this landlord" });
                }
                return Ok(proposals);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving proposals", error = ex.Message });
            }
        }

        [HttpPut("accept-waiting-proposal/{id}")]
        public async Task<IActionResult> AcceptProposal(int id)
        {
            try
            {
                var acceptedProposal = await landlordService.AcceptProposal(id);
                return Ok(acceptedProposal);
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(new { message = e.Message });
            }
        }

        [HttpPut("reject-waiting-proposal/{id}")]
        public async Task<IActionResult> RejectProposal(int id)
        {
            try
            {
                var rejectedProposal = await landlordService.RejectProposal(id);
                return Ok(rejectedProposal);
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(new { message = e.Message });
            }
        }

        

        //[HttpGet("showPosts")]
        //public IActionResult showPosts()
        //{
        //    var posts = _db.Posts
        //.Where(p => (p.FlagWaitingPost == 0) && (p.RentalStatus == "available"))
        //.Include(p => p.Comments)  // Explicitly include Comments
        //.Select(p => new PostDTo
        //{
        //    Landlord = new UserDto  // since you have one object, I have moved up, because the order is important
        //    {
        //        UserId = p.Landlord.UserId,
        //        UserName = p.Landlord.UserName,
        //        FName = p.Landlord.FName,
        //        LName = p.Landlord.LName
        //    },
        //    PostId = p.PostId,
        //    Title = p.Title,
        //    Description = p.Description,
        //    Location = p.Location,
        //    DatePost = p.DatePost,
        //    Price = p.Price,
        //    Comments = p.Comments.Select(c => new CommentDto // since you have multiple objects
        //    {
        //        CommentId = c.CommentId,
        //        PostId = c.PostId,
        //        comment_written = c.Description,
        //        DateComment = c.DateComment

        //    }).ToList()
        //})
        //.ToList();

        //    ;
        //    if (posts == null)
        //    {
        //        return NotFound();
        //    }
        //    else return Ok(posts);
        //}

    }
}
