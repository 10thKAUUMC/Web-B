// 목록 조회 시 넘겨줄 파라미터 타입
export interface PaginationDto {
  cursor?: number;
  limit?: number;
  search?: string;
  order?: 'asc' | 'desc';
}

// LP 생성/수정 요청 타입
export interface RequestLpDto {
  title: string;
  content: string;
  thumbnail?: string;
  tags?: string[];
  published?: boolean;
}

// LP 기본 데이터 타입
export interface Lp {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  tags: { id: number; name: string }[];
  likes: { id: number; userId: number; lpId: number }[];
}

// LP 상세 데이터 타입 (author 정보 포함)
export interface LpDetail extends Lp {
  author: {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

// API 기본 응답 포맷
export interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// 목록 조회 응답 데이터 타입
export interface LpListResponse {
  data: Lp[];
  nextCursor: number | null;
  hasNext: boolean;
}

// 추가할 댓글 관련 타입
export interface CommentAuthor {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthor;
}

export interface CommentListResponse {
  data: Comment[];
  nextCursor: number | null;
  hasNext: boolean;
}