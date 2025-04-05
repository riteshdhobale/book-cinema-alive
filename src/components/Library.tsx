
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const books = [
  {
    id: 1,
    title: "Fairy Tales Collection",
    author: "Hans Christian Andersen",
    cover: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    category: "Fantasy",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    cover: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    category: "Self-Help",
  },
  {
    id: 3,
    title: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    cover: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    category: "Fiction",
  },
  {
    id: 4,
    title: "Cosmos",
    author: "Carl Sagan",
    cover: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
    category: "Science",
  },
];

const Library = () => {
  return (
    <section id="library" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-bookverse-primary mb-4">Explore Our Library</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Discover a growing collection of books ready to be transformed into immersive experiences.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {books.map((book) => (
            <div key={book.id} className="book-card bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-72">
                <img 
                  src={book.cover} 
                  alt={book.title} 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div>
                    <span className="text-xs text-bookverse-gold px-2 py-1 rounded bg-bookverse-primary/70">
                      {book.category}
                    </span>
                    <h3 className="text-white font-bold mt-2">{book.title}</h3>
                    <p className="text-white/80 text-sm">{book.author}</p>
                  </div>
                </div>
                
                <div className="absolute top-0 right-0 m-4">
                  <Button size="sm" className="rounded-full w-10 h-10 p-0 bg-bookverse-secondary hover:bg-bookverse-secondary/90">
                    <Play className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">AI Enhanced</span>
                <Button variant="outline" size="sm" className="text-bookverse-secondary border-bookverse-secondary hover:bg-bookverse-secondary/10">
                  Experience
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button className="bg-bookverse-primary hover:bg-bookverse-primary/90 text-white">
            View All Books
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Library;
