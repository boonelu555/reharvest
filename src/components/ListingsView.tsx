import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation, MapPin, Package, Calendar } from 'lucide-react';
import { format } from 'date-fns';

import type { FoodListing } from '@/types/listings';

interface ListingsViewProps {
  listings: FoodListing[];
  onClaimClick: (listing: FoodListing) => void;
}

const ListingsView = ({ listings, onClaimClick }: ListingsViewProps) => {
  // Check if a listing is expired
  const isExpired = (availableUntil: string) => {
    return new Date(availableUntil) < new Date();
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
        <p className="font-semibold mb-2">📍 Available Food Listings</p>
        <p className="text-sm">Click "Navigate" to open Google Maps directions to each pickup location.</p>
      </div>

      {listings.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No food listings available at the moment.
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => {
            const expired = isExpired(listing.available_until);
            return (
            <Card 
              key={listing.id} 
              className={`transition-shadow ${
                expired 
                  ? 'opacity-60 grayscale' 
                  : 'hover:shadow-lg'
              }`}
            >
              {listing.image_url && (
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={listing.image_url}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex gap-2 mb-2">
                  <Badge variant="secondary">{listing.category}</Badge>
                  <Badge variant={expired ? "destructive" : "outline"}>
                    {expired ? "expired" : listing.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{listing.title}</CardTitle>
                <CardDescription className="line-clamp-2">{listing.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>{listing.quantity}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">{listing.pickup_location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Until {format(new Date(listing.available_until), 'MMM d, h:mm a')}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const destination = encodeURIComponent(listing.pickup_location + ', Vancouver');
                      window.open(`https://www.google.com/maps/search/?api=1&query=${destination}`, '_blank');
                    }}
                    className="flex-1"
                    disabled={expired}
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Navigate
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onClaimClick(listing)}
                    className="flex-1"
                    disabled={expired}
                  >
                    {expired ? "Expired" : "Claim"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
          })}
        </div>
      )}
    </div>
  );
};

export default ListingsView;