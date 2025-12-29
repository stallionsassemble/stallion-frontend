import { api } from '..'

import {
  UploadAudioResponse,
  UploadAudiosResponse,
  UploadDocumentResponse,
  UploadDocumentsResponse,
  UploadImageResponse,
  UploadImagesResponse,
  UploadVideoResponse,
  UploadVideosResponse,
} from '@/lib/types/upload'

class UploadService {
  private getHeaders() {
    return {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  }

  // --- Images ---
  async uploadImage(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post<UploadImageResponse>(
      '/upload/image',
      formData,
      this.getHeaders()
    )
    return response.data
  }

  async uploadImages(files: File[]) {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    const response = await api.post<UploadImagesResponse>(
      '/upload/images',
      formData,
      this.getHeaders()
    )
    return response.data
  }

  // --- Videos ---
  async uploadVideo(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post<UploadVideoResponse>(
      '/upload/video',
      formData,
      this.getHeaders()
    )
    return response.data
  }

  async uploadVideos(files: File[]) {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    const response = await api.post<UploadVideosResponse>(
      '/upload/videos',
      formData,
      this.getHeaders()
    )
    return response.data
  }

  // --- Audio ---
  async uploadAudio(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post<UploadAudioResponse>(
      '/upload/audio',
      formData,
      this.getHeaders()
    )
    return response.data
  }

  async uploadAudios(files: File[]) {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    const response = await api.post<UploadAudiosResponse>(
      '/upload/audios',
      formData,
      this.getHeaders()
    )
    return response.data
  }

  // --- Documents ---
  async uploadDocument(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post<UploadDocumentResponse>(
      '/upload/document',
      formData,
      this.getHeaders()
    )
    return response.data
  }

  async uploadDocuments(files: File[]) {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    const response = await api.post<UploadDocumentsResponse>(
      '/upload/documents',
      formData,
      this.getHeaders()
    )
    return response.data
  }
}

export const uploadService = new UploadService()
