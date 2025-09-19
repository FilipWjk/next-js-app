import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/tasks">
          <Button variant="outline" className="cursor-pointer">
            ← Back to Tasks
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-white">Task Not Found</h1>
      </div>
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-400">The task you're looking for doesn't exist or has been deleted.</p>
        </CardContent>
      </Card>
    </div>
  );
}
