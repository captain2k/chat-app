import { Loader2 } from 'lucide-react';
import Background from './Background';

function LoadingPage() {
  return (
    <Background>
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="size-10 animate-spin" />
      </div>
    </Background>
  );
}

export default LoadingPage;
