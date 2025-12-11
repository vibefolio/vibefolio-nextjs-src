// src/lib/getUserInfo.ts
// Auth에서 사용자 정보를 가져오는 유틸리티

export async function getUserInfo(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    
    if (response.ok && data.user) {
      return {
        username: data.user.nickname || data.user.email?.split('@')[0] || 'Unknown',
        profile_image_url: data.user.profile_image_url || '/globe.svg',
      };
    }
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
  }
  
  return {
    username: 'Unknown',
    profile_image_url: '/globe.svg',
  };
}
