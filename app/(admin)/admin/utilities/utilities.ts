import { NewItemType } from "../type/items";

export function getUserToken() {
    if (typeof window === 'undefined') return;
    let token = null;

    const storage = localStorage.getItem('token');
    if (storage){
        const parsed = JSON.parse(storage);
        if ('token' in parsed){
            return token = parsed;
        }
    }

    return token;
}

export function toBoolean (value:string): boolean {
    return value === 'true';
}

export function validateImage(file:File): string | null {
    if (!file) return 'no image prvided';

    if (!file.type.startsWith('image/')) return 'File must be Image';

    if (!['image/jpg', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return 'Unsupported image format';

    if (file.size > 5 * 1024 * 1024) return 'Image size exceeded 5MB';
    
    return null;
}

async function blobsAreEqual(blob1:Blob, blob2:Blob) {
  const [buf1, buf2] = await Promise.all([
    blob1.arrayBuffer(),
    blob2.arrayBuffer()
  ]);

  const a = new Uint8Array(buf1);
  const b = new Uint8Array(buf2);

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }

  return true;
}

export async function areDifferentBlobs(arr1: Blob[], arr2: Blob[]) {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    return await blobsAreEqual(arr1[i], arr2[i]);
    // if (!same) return false;
  }

  return false;
}

export function isFormValid (keys:(keyof NewItemType)[], form:NewItemType) {
  const isFormValid = keys.every(field => {
    const value = form[field];
    
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object") return Object.values(value).every(v => v?.trim());
    return value;
  });
  return isFormValid;
}
