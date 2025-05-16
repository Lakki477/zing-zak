
import React from 'react';
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppNavbar from '@/components/AppNavbar';

const mockTrendingData = [
  { id: 1, tag: "#dance", count: "2.4M" },
  { id: 2, tag: "#funny", count: "1.8M" },
  { id: 3, tag: "#food", count: "1.2M" },
  { id: 4, tag: "#style", count: "980K" },
  { id: 5, tag: "#pets", count: "845K" },
  { id: 6, tag: "#travel", count: "756K" },
];

const mockCategories = [
  { id: "comedy", name: "Comedy", thumbnail: "https://via.placeholder.com/150/112233/ffffff?text=Comedy" },
  { id: "dance", name: "Dance", thumbnail: "https://via.placeholder.com/150/223344/ffffff?text=Dance" },
  { id: "food", name: "Food", thumbnail: "https://via.placeholder.com/150/334455/ffffff?text=Food" },
  { id: "beauty", name: "Beauty", thumbnail: "https://via.placeholder.com/150/445566/ffffff?text=Beauty" },
  { id: "sports", name: "Sports", thumbnail: "https://via.placeholder.com/150/556677/ffffff?text=Sports" },
  { id: "gaming", name: "Gaming", thumbnail: "https://via.placeholder.com/150/667788/ffffff?text=Gaming" },
];

const DiscoverPage = () => {
  return (
    <div className="min-h-screen bg-app-background text-app-foreground pb-16">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Discover</h1>
        
        <Input
          type="text"
          placeholder="Search..."
          className="bg-app-muted border-app-muted text-app-foreground mb-6"
        />
        
        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-app-muted">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending" className="mt-4">
            <div className="space-y-4">
              {mockTrendingData.map(item => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-app-muted rounded-lg"
                >
                  <span className="font-semibold text-app-accent">{item.tag}</span>
                  <span className="text-sm text-gray-400">{item.count} videos</span>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="categories" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {mockCategories.map(category => (
                <div 
                  key={category.id}
                  className="relative rounded-lg overflow-hidden aspect-square"
                >
                  <img 
                    src={category.thumbnail} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <span className="font-semibold text-white">{category.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <AppNavbar />
    </div>
  );
};

export default DiscoverPage;
