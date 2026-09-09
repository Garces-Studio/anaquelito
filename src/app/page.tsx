import HomeExperiencia from '@/componentes/HomeExperiencia';
import PieDePagina from '@/componentes/PieDePagina';

export default function Inicio() {
  const organizacion = { '@context': 'https://schema.org', '@type': 'Organization', name: 'Anaquelito', url: 'https://anaquelito.vercel.app', description: 'Dulces y botanas al mayoreo para negocios en México.' };
  return <><HomeExperiencia /><div className="tema-tienda home-pie"><PieDePagina /></div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizacion).replace(/</g, '\\u003c') }} /></>;
}
