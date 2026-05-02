import { FetchWrapper } from '@/lib/fetch-wrapper';

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_UPLOAD_API as string);

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return fetchWrapper.upload<{
    message: string;
    data: { url: string };
  }>('/uploads/single', formData);
}
