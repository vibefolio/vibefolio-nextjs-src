// src/lib/bookmarks.ts

/**
 * 북마크 관리 유틸리티
 * 로컬 스토리지를 사용하여 북마크 상태를 영구 저장
 */

export interface BookmarkData {
  projectId: string;
  bookmarkedAt: string;
}

const BOOKMARKS_KEY = "user_bookmarks";
const PROJECTS_KEY = "projects";

/**
 * 사용자가 북마크한 프로젝트 목록 가져오기
 */
export function getUserBookmarks(): BookmarkData[] {
  try {
    const bookmarks = localStorage.getItem(BOOKMARKS_KEY);
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch (error) {
    console.error("북마크 목록 로드 실패:", error);
    return [];
  }
}

/**
 * 프로젝트 북마크 여부 확인
 */
export function isProjectBookmarked(projectId: string): boolean {
  const bookmarks = getUserBookmarks();
  return bookmarks.some((bookmark) => bookmark.projectId === projectId);
}

/**
 * 프로젝트 북마크 추가
 */
export function addBookmark(projectId: string): void {
  try {
    const bookmarks = getUserBookmarks();
    
    // 이미 북마크한 경우 중복 방지
    if (isProjectBookmarked(projectId)) {
      return;
    }

    // 북마크 추가
    const newBookmark: BookmarkData = {
      projectId,
      bookmarkedAt: new Date().toISOString(),
    };
    bookmarks.push(newBookmark);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error("북마크 추가 실패:", error);
  }
}

/**
 * 프로젝트 북마크 제거
 */
export function removeBookmark(projectId: string): void {
  try {
    const bookmarks = getUserBookmarks();
    const filteredBookmarks = bookmarks.filter(
      (bookmark) => bookmark.projectId !== projectId
    );
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filteredBookmarks));
  } catch (error) {
    console.error("북마크 제거 실패:", error);
  }
}

/**
 * 프로젝트 북마크 토글
 */
export function toggleBookmark(projectId: string): boolean {
  const isBookmarked = isProjectBookmarked(projectId);
  
  if (isBookmarked) {
    removeBookmark(projectId);
    return false;
  } else {
    addBookmark(projectId);
    return true;
  }
}

/**
 * 사용자가 북마크한 프로젝트 목록 가져오기
 */
export function getBookmarkedProjects(): any[] {
  try {
    const bookmarks = getUserBookmarks();
    const projectsData = localStorage.getItem(PROJECTS_KEY);
    if (!projectsData) return [];

    const projects = JSON.parse(projectsData);
    const bookmarkedProjectIds = bookmarks.map((bookmark) => bookmark.projectId);
    
    return projects.filter((project: any) => 
      bookmarkedProjectIds.includes(project.id)
    );
  } catch (error) {
    console.error("북마크한 프로젝트 조회 실패:", error);
    return [];
  }
}

/**
 * 전체 북마크 수 가져오기
 */
export function getTotalBookmarksCount(): number {
  const bookmarks = getUserBookmarks();
  return bookmarks.length;
}
