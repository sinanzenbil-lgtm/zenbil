-- Şişli şubesinin adresini ve telefonunu güncelle
UPDATE "Location"
SET 
  address = 'Fulya, Mehmetçik Cd. No:48/D, 34394 Şişli/İstanbul',
  phone = '0530 131 32 58'
WHERE id = 'sisli';

-- Sabiha Gökçen şubesinin telefonunu güncelle
UPDATE "Location"
SET phone = '0530 131 32 58'
WHERE id = 'sabiha-gokcen';

-- İstanbul Havalimanı şubesinin telefonunu güncelle
UPDATE "Location"
SET phone = '0530 131 32 58'
WHERE id = 'istanbul-havalimani';


