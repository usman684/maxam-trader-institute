// Shrinks big phone photos before upload (Vercel allows about 4.5 MB per request).
export async function prep(list) {
  const out = []
  for (const f of Array.from(list || [])) {
    if (!f.type.startsWith('image/') || f.size < 600 * 1024) { out.push(f); continue }
    try {
      const bmp = await createImageBitmap(f), sc = Math.min(1, 1600 / Math.max(bmp.width, bmp.height))
      const c = document.createElement('canvas'); c.width = Math.round(bmp.width * sc); c.height = Math.round(bmp.height * sc)
      c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height)
      const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.8))
      out.push(blob && blob.size < f.size ? new File([blob], f.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' }) : f)
    } catch { out.push(f) }
  }
  return out
}
