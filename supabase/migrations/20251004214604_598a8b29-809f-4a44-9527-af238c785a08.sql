-- Fix views by granting proper permissions
GRANT SELECT ON provider_stats TO authenticated;
GRANT SELECT ON consumer_stats TO authenticated;