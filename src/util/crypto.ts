const CLAVE = '2fC8#n9QeL@xR7VmZ4wTuP1$gHsJ6bEk'; 

export async function decryptAESBase64Url(encoded: string): Promise<string> {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const pad = '='.repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(base64 + pad);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));

    const iv = bytes.slice(0, 16);
    const data = bytes.slice(16);

    const keyBytes = new TextEncoder().encode(CLAVE);
    const key = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-CBC' },
      false,
      ['decrypt']
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv },
      key,
      data
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption failed', error);
    throw new Error('No se pudo desencriptar');
  }
}

export function parseInterviewData(query: string) {
  const params = new URLSearchParams(query);
  return {
    interviewId: params.get('interviewId')!,
    email: params.get('email')!,
    fecha: params.get('fecha')!,
    participants: params.get('participants')?.split(',') || [],
  };
}


