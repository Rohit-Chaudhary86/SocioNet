import React, { useEffect, useState } from 'react'
import { Container, PostForm } from '../components'
import appwriteService from "../appwrite/conf";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function EditPost() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { slug } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((postData) => {
                if (postData) {
                    setPost(postData);
                } else {
                    toast.error("Post not found");
                    navigate('/');
                }
            }).catch((error) => {
                console.error("Error fetching post:", error);
                toast.error("Failed to load post");
                navigate('/');
            }).finally(() => {
                setLoading(false);
            });
        } else {
            navigate('/');
        }
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className='py-8'>
                <Container>
                    <div className="text-center">Loading...</div>
                </Container>
            </div>
        );
    }

    return post ? (
        <div className='py-8'>
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    ) : null;
}

export default EditPost;