-- Create a view for provider statistics
CREATE OR REPLACE VIEW provider_stats AS
SELECT 
  p.id as provider_id,
  COUNT(DISTINCT fl.id) as total_listings,
  COUNT(DISTINCT CASE WHEN fl.status = 'available' THEN fl.id END) as active_listings,
  COUNT(DISTINCT c.id) as total_claims,
  COUNT(DISTINCT CASE WHEN c.status = 'picked_up' THEN c.id END) as completed_donations
FROM profiles p
LEFT JOIN food_listings fl ON p.id = fl.provider_id
LEFT JOIN claims c ON fl.id = c.listing_id
WHERE p.role = 'provider'
GROUP BY p.id;

-- Create a view for consumer statistics
CREATE OR REPLACE VIEW consumer_stats AS
SELECT 
  p.id as consumer_id,
  COUNT(DISTINCT c.id) as total_claims,
  COUNT(DISTINCT CASE WHEN c.status = 'picked_up' THEN c.id END) as meals_received,
  COUNT(DISTINCT CASE WHEN c.status = 'pending' THEN c.id END) as pending_pickups
FROM profiles p
LEFT JOIN claims c ON p.id = c.consumer_id
WHERE p.role = 'consumer'
GROUP BY p.id;