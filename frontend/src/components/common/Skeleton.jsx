import { motion } from 'framer-motion';

const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-slate-200 rounded-2xl ${className}`}></div>
);

const ProductSkeleton = () => (
    <div className="glass p-4 rounded-3xl space-y-4">
        <Skeleton className="aspect-square w-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-3/4" />
        <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-12 w-12 rounded-2xl" />
        </div>
    </div>
);

export { Skeleton, ProductSkeleton };
