import { Skeleton } from "@/components/ui/skeleton";
import CustomLayout from "@/components/layout/layout";
import {
  ImageIcon,
} from "lucide-react";

export default function SkeletonDemo(){
    return(
        <CustomLayout>
            <div className="w-full flex items-center justify-center mb-5">
        <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full"/>
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
        </div>
             
        </CustomLayout>
    )
}