-- Fotografías oficiales entregadas para los seis productos iniciales.
update public.productos
set imagen_url = case slug
  when 'gomita-pinguino' then '/productos/gomita-pinguino.jpg'
  when 'gomita-diente' then '/productos/gomita-diente.jpg'
  when 'gomita-oso' then '/productos/gomita-oso.jpg'
  when 'gomita-lombriz' then '/productos/gomita-lombriz.jpg'
  when 'huevito-pinto' then '/productos/huevito-pinto.jpg'
  when 'bubulubu-ice' then '/productos/bubulubu-ice.jpg'
  else imagen_url
end
where slug in (
  'gomita-pinguino', 'gomita-diente', 'gomita-oso',
  'gomita-lombriz', 'huevito-pinto', 'bubulubu-ice'
);
