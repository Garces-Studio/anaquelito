-- Sustituye las fotos con fondo blanco por los PNG transparentes entregados por el negocio.
update public.productos
set imagen_url = case slug
  when 'gomita-pinguino' then '/productos/gomita-pinguino.png'
  when 'gomita-diente' then '/productos/gomita-diente.png'
  when 'gomita-oso' then '/productos/gomita-oso.png'
  when 'gomita-lombriz' then '/productos/gomita-lombriz.png'
  when 'huevito-pinto' then '/productos/huevito-pinto.png'
  when 'bubulubu-ice' then '/productos/bubulubu-ice.png'
  else imagen_url
end
where slug in (
  'gomita-pinguino', 'gomita-diente', 'gomita-oso',
  'gomita-lombriz', 'huevito-pinto', 'bubulubu-ice'
);
