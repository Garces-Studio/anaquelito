import { permanentRedirect } from 'next/navigation';

export default async function ProductoAnterior({ params }: { params: Promise<{ id: string }> }) {
  permanentRedirect(`/productos/${(await params).id}`);
}
