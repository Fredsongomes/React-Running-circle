import {instance} from "./api.ts";
import type {Author} from "./posts.ts";

export interface Comment {
    id: string;
    postId: string;
    author: Author;
    text: string;
    createdAt: string;
}

export async function getComments(postId: string): Promise<Comment[]> {
    const response = await instance.get<{
        data: Comment[];
    }>(`/posts/${postId}/comments`, {params: {limit: 100}}); // API pagina em 10 por padrão
    return response.data.data;
}

export async function createComment(postId: string, text: string): Promise<Comment> {
    const response = await instance.post<Comment>(`/posts/${postId}/comments`, {text});
    return response.data;
}

export async function deleteComment(postId: string, commentId: string): Promise<void> {
    await instance.delete(`/posts/${postId}/comments/${commentId}`);
}
