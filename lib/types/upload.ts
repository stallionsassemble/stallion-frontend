export interface UploadFileResponse {
  originalName: string
  filename: string
  path: string
  url: string
  size: number
  mimetype: string
}

// Single file responses
export type UploadImageResponse = UploadFileResponse
export type UploadVideoResponse = UploadFileResponse
export type UploadAudioResponse = UploadFileResponse
export type UploadDocumentResponse = UploadFileResponse

// Multi file responses
export interface UploadImagesResponse {
  images: UploadImageResponse[]
}

export interface UploadVideosResponse {
  videos: UploadVideoResponse[]
}

export interface UploadAudiosResponse {
  audios: UploadAudioResponse[]
}

export interface UploadDocumentsResponse {
  documents: UploadDocumentResponse[]
}
