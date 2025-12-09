// src/lib/likes.ts

/**
 * 좋아요 관리 유틸리티
 * 로컬 스토리지를 사용하여 좋아요 상태를 영구 저장
 */

export interface LikeData {
  projectId: string;
  likedAt: string;
}

const LIKES_KEY = "user_likes";
const PROJECTS_KEY = "projects";

/**
 * 사용자가 좋아요한 프로젝트 목록 가져오기
 */
export function getUserLikes(): LikeData[] {
  try {
    const likes = localStorage.getItem(LIKES_KEY);
    return likes ? JSON.parse(likes) : [];
  } catch (error) {
    console.error("좋아요 목록 로드 실패:", error);
    return [];
  }
}

/**
 * 프로젝트 좋아요 여부 확인
 */
export function isProjectLiked(projectId: string): boolean {
  const likes = getUserLikes();
  return likes.some((like) => like.projectId === projectId);
}

/**
 * 프로젝트 좋아요 추가
 */
export function addLike(projectId: string): void {
  try {
    const likes = getUserLikes();
    
    // 이미 좋아요한 경우 중복 방지
    if (isProjectLiked(projectId)) {
      return;
    }

    // 좋아요 추가
    const newLike: LikeData = {
      projectId,
      likedAt: new Date().toISOString(),
    };
    likes.push(newLike);
    localStorage.setItem(LIKES_KEY, JSON.stringify(likes));

    // 프로젝트의 좋아요 수 증가
    updateProjectLikeCount(projectId, 1);
  } catch (error) {
    console.error("좋아요 추가 실패:", error);
  }
}

/**
 * 프로젝트 좋아요 제거
 */
export function removeLike(projectId: string): void {
  try {
    const likes = getUserLikes();
    const filteredLikes = likes.filter((like) => like.projectId !== projectId);
    localStorage.setItem(LIKES_KEY, JSON.stringify(filteredLikes));

    // 프로젝트의 좋아요 수 감소
    updateProjectLikeCount(projectId, -1);
  } catch (error) {
    console.error("좋아요 제거 실패:", error);
  }
}

/**
 * 프로젝트 좋아요 토글
 */
export function toggleLike(projectId: string): boolean {
  const isLiked = isProjectLiked(projectId);
  
  if (isLiked) {
    removeLike(projectId);
    return false;
  } else {
    addLike(projectId);
    return true;
  }
}

/**
 * 프로젝트의 좋아요 수 업데이트
 */
function updateProjectLikeCount(projectId: string, delta: number): void {
  try {
    const projectsData = localStorage.getItem(PROJECTS_KEY);
    if (!projectsData) return;

    const projects = JSON.parse(projectsData);
    const projectIndex = projects.findIndex((p: any) => p.id === projectId);

    if (projectIndex !== -1) {
      projects[projectIndex].likes = Math.max(0, (projects[projectIndex].likes || 0) + delta);
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    }
  } catch (error) {
    console.error("좋아요 수 업데이트 실패:", error);
  }
}

/**
 * 프로젝트의 현재 좋아요 수 가져오기
 */
export function getProjectLikeCount(projectId: string): number {
  try {
    const projectsData = localStorage.getItem(PROJECTS_KEY);
    if (!projectsData) return 0;

    const projects = JSON.parse(projectsData);
    const project = projects.find((p: any) => p.id === projectId);
    return project?.likes || 0;
  } catch (error) {
    console.error("좋아요 수 조회 실패:", error);
    return 0;
  }
}

/**
 * 사용자가 좋아요한 프로젝트 목록 가져오기
 */
export function getLikedProjects(): any[] {
  try {
    const likes = getUserLikes();
    const projectsData = localStorage.getItem(PROJECTS_KEY);
    if (!projectsData) return [];

    const projects = JSON.parse(projectsData);
    const likedProjectIds = likes.map((like) => like.projectId);
    
    return projects.filter((project: any) => 
      likedProjectIds.includes(project.id)
    );
  } catch (error) {
    console.error("좋아요한 프로젝트 조회 실패:", error);
    return [];
  }
}

/**
 * 전체 좋아요 수 가져오기
 */
export function getTotalLikesCount(): number {
  const likes = getUserLikes();
  return likes.length;
}
