import { useNavigate } from 'react-router-dom'
import CommentIcon from '../assets/icons/icon-comment.svg'
import { FaRegHeart, FaHeart  } from "react-icons/fa";
import { useAuth } from '../hooks/useAuth'
import { useSocket } from '../hooks/useSocket'
import CommentSection from './CommentSection';
import { useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import Loading from '../components/fallbacks/Loading'
import ErrorFallback from './fallbacks/ErrorFallback';
import usePostData from '../hooks/usePostData';

const Post = ({post}) => {
  const [isCommentSectionOn, setIsCommentSectionOn] = useState(false);

  const navigate = useNavigate();
  const { auth } = useAuth();
  const { sendPrivateNotification } = useSocket();

  const { 
    postData, 
    isPostLoading, 
    isPostError, 
    postError, 
    likePostMutation, 
    unlikePostMutation
  } = usePostData(post.id, auth?.user);

  const handleLike = () => {
    likePostMutation({postId: post.id, username: auth?.user});
    sendPrivateNotification(
      { 
        message: `${auth?.user} liked your post!`, 
        type: "Like", 
        source: "Feed", 
        recipientName: post.authorName 
      }
    );
  }

  const handleUnike = () => {
    unlikePostMutation({postId: post.id, username: auth?.user});
  }

  const toggleComment = () =>{
    setIsCommentSectionOn(!isCommentSectionOn);
  }

  if(isPostError){
    return <ErrorFallback error={postError.message}/>
  }

  if(isPostLoading){
    return <Loading/>
  }

  return (
    <div className='post-container'>
      <div className='line'>&nbsp;</div>
      <div className='post'>
        <div className='post-author'>
          <div className='author-profile-picture'></div>
          <span onClick={() => navigate(`/profile/${post.authorName}`)}>{post.authorName}</span>
        </div>
        <div className='post-content'>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          {post.imageData && postData.postImage && <img className='post-image' src={URL.createObjectURL(postData.postImage)} alt='postImage'/>} 
        </div>
        <div className='interaction-container'>
          <span>
            {postData.isLiked ? 
            <FaHeart onClick={handleUnike} className='interaction-icon'/>
            :
            <FaRegHeart onClick={handleLike} className='interaction-icon'/>
            }
            {postData.postLikes}
          </span>
          <span style={{cursor: "pointer", userSelect: "none"}} onClick={toggleComment} >
            <img className='interaction-icon' src={CommentIcon}/>
            {postData.postCommentCount} Comments {isCommentSectionOn ? 
            <IoIosArrowDown className='arrow-icon-down'/> 
            : 
            <IoIosArrowForward className='arrow-icon-forward'/>}
          </span>
        </div>
      </div>
      {isCommentSectionOn && <CommentSection post={post}/>}
    </div>
  )
}

export default Post
