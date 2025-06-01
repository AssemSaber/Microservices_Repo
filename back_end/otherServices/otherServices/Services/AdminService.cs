using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using otherServices.Models;
using otherServices.Models.DTOs;
using otherServices.Repositories;
using otherServices.Services;
using WebAPIDotNet.DTOs;

namespace WebAPIDotNet.Services
{
    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPostRepository _postRepository;

        public AdminService( IUserRepository userRepository, IPostRepository postRepository)
        {
            _userRepository = userRepository;
            _postRepository = postRepository;

        }

        public async Task<Post> AcceptPost(long postId)
        {
           return await _postRepository.AcceptPostAsync(postId);
        }
        
        public async Task<Post> RejectPost(long postId)
        {
            return await _postRepository.RejectPostAsync(postId);
        }

        public async Task<User> AcceptUser(long userId)
        {
            return await _userRepository.AcceptUserAsync(userId);
        }


        public async Task<User> RejectUser(long userId)
        {
            return await _userRepository.RejectUserAsync(userId);
        }

        public async Task<IEnumerable<PostDTo>> GetWaitingPosts()
        {
            var posts = await _postRepository.NestedFind(p => p.FlagWaitingPost == 1, p => p.Landlord);
                

            return posts.Select(p => new PostDTo
            {
                PostId = p.PostId,
                Title = p.Title,
                Description = p.Description,
                Price = p.Price,
                Location = p.Location,
                RentalStatus = p.RentalStatus,
                DatePost = p.DatePost,
                FlagWaitingPost = p.FlagWaitingPost,
                UserId = p.Landlord.UserId,
                UserName = p.Landlord.UserName,
                Email = p.Landlord.Email,
                ImagePath = p.ImagePath,
                FileBase64 = !string.IsNullOrEmpty(p.ImagePath) && File.Exists(p.ImagePath)
                    ? Convert.ToBase64String(File.ReadAllBytes(p.ImagePath))
                    : null
            });
        }



        public async Task<IEnumerable<User>> GetWaitingLandlord()
        {
            return await _userRepository.FindAsync(p => p.FlagWaitingUser == 1);
        }
        public async Task<IEnumerable<User>> GetLandlordStatus(long userid)
        {
            return await _userRepository.FindAsync(p => p.UserId == userid);
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _userRepository.GetAllAsync();
        }

        //private PostDTo MapToDTO(Post post, User landlord)
        //{
        //    return new PostDTo
        //    {
        //        PostId = post.PostId,
        //        Title = post.Title,
        //        Description = post.Description,
        //        Price = post.Price,
        //        Location = post.Location,
        //        RentalStatus = post.RentalStatus,
        //        DatePost = post.DatePost,
        //        FlagWaitingPost = post.FlagWaitingPost,

        //        UserId = landlord.UserId,
        //        UserName = landlord.UserName,
        //        Email = landlord.Email
        //    };
        //}

    }
}