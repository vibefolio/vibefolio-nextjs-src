// src/lib/comments.ts

/**
 * 댓글 관리 유틸리티
 * 로컬 스토리지를 사용하여 댓글을 영구 저장
 */

export interface Comment {
  id: string;
  projectId: string;
  username: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

const COMMENTS_KEY = "project_comments";

/**
 * 프로젝트의 모든 댓글 가져오기
 */
export function getProjectComments(projectId: string): Comment[] {
  try {
    const commentsData = localStorage.getItem(COMMENTS_KEY);
    if (!commentsData) return [];

    const allComments: Comment[] = JSON.parse(commentsData);
    return allComments
      .filter((comment) => comment.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error("댓글 로드 실패:", error);
    return [];
  }
}

/**
 * 댓글 추가
 */
export function addComment(
  projectId: string,
  content: string,
  username: string = "현재 사용자",
  userAvatar: string = "/globe.svg"
): Comment {
  try {
    const commentsData = localStorage.getItem(COMMENTS_KEY);
    const allComments: Comment[] = commentsData ? JSON.parse(commentsData) : [];

    const newComment: Comment = {
      id: Date.now().toString(),
      projectId,
      username,
      userAvatar,
      content,
      createdAt: new Date().toISOString(),
    };

    allComments.push(newComment);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));

    return newComment;
  } catch (error) {
    console.error("댓글 추가 실패:", error);
    throw error;
  }
}

/**
 * 댓글 삭제
 */
export function deleteComment(commentId: string): void {
  try {
    const commentsData = localStorage.getItem(COMMENTS_KEY);
    if (!commentsData) return;

    const allComments: Comment[] = JSON.parse(commentsData);
    const filteredComments = allComments.filter((comment) => comment.id !== commentId);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(filteredComments));
  } catch (error) {
    console.error("댓글 삭제 실패:", error);
  }
}

/**
 * 프로젝트의 댓글 수 가져오기
 */
export function getCommentCount(projectId: string): number {
  const comments = getProjectComments(projectId);
  return comments.length;
}
