import {instance} from "./api.ts";

export interface Author {
    id: string;
    name: string;
    username: string;
    avatarUrl: string | null;
}

export interface Post {
    id: string;
    author: Author;
    imageUrl: string | null;
    durationSeconds: number;
    type: 'walking' | 'running';
    distanceMeters: number;
    calories: number;
    heartRateBpm: number;
    description: string;
    likesCount: number;
    likedByMe: boolean;
    commentsCount: number;
    createdAt: string;
}

export interface NewPostPayload {
    durationSeconds: number;
    type: "walking" | "running";
    distanceMeters: number;
    calories: number;
    heartRateBpm: number;
    description: string;
    image?: File;
}

export async function fetchPosts(): Promise<Post[]> {

    const response = await instance.get<{
        data: Post[];
    }>('/posts');
    return response.data.data;
}


export async function fetchPostsCreatedByTheLoggedUser(): Promise<Post[]> {

    const response = await instance.get<{
        data: Post[];
    }>('/posts?createdBy=me');
    return response.data.data;
}


export async function fetchPostsLikedByTheLoggedUser(): Promise<Post[]> {

    const response = await instance.get<{
        data: Post[];
    }>('/posts?likedBy=me');
    return response.data.data;
}


export async function createPost(post: NewPostPayload): Promise<Post> {
    const body = new FormData()

    body.append('durationSeconds', post.durationSeconds.toString())
    body.append('type', post.type)
    body.append('distanceMeters', post.distanceMeters.toString())
    body.append('calories', post.calories.toString())
    body.append('heartRateBpm', post.heartRateBpm.toString())
    body.append('description', post.description)

    if (post.image) {
        body.append('image', post.image)
    }

    const response = await instance.post<Post>('/posts', body)
    return response.data
}


export interface LikeState {
    postId: string;
    likesCount: number;
    likedByMe: boolean;
}

export async function likePost(postId: string): Promise<LikeState> {
    const response = await instance.post<LikeState>(`/posts/${postId}/likes`)
    return response.data
}

export async function unlikePost(postId: string): Promise<LikeState> {
    const response = await instance.delete<LikeState>(`/posts/${postId}/likes`)
    return response.data
}