import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Post = {
    post_id: string;
    user_id: number;
    username: string;
    content: string;
    created_at: string;
    content_type: string;
    title: string;
    likes: number;
};
const PostPage: React.FC = () => {
    const { postID } = useParams<{ postID: string }>();
    const [post, setPost] = useState<Post>();
    useEffect(() => {
        const getforums = async () => {
            const response = await fetch(`http://localhost:8000/posts/${postID}`); // get no need method cause fetch inherently already is get
            // fetch need
            const result = await response.json();
            setPost(result.payload.data);
            console.log(result.payload.data);
        };
        getforums();
    }, [postID]);
    if (!post) return <div>Loading post...</div>;

    return (
        <div>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>Author: {post.username}</p>
            <p>Tag: {post.content_type}</p>
            <p>Likes: {post.likes}</p>
        </div>
    );
};

export default PostPage;
