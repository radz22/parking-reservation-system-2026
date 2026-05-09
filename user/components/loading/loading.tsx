import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
export const Loading = () => {
  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardContent className="flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </CardContent>
    </Card>
  );
};
