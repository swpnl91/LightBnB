SELECT properties.*, reservations.*, AVG(rating) AS average_rating
FROM properties
JOIN property_reviews ON properties.id = property_reviews.property_id
JOIN reservations ON properties.id = reservations.property_id
WHERE reservations.guest_id = 15 AND reservations.end_date < now()::date 
GROUP BY properties.id, reservations.id
ORDER BY reservations.start_date
LIMIT 10;