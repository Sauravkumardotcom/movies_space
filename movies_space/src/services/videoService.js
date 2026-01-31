// Mock video data - replace with API calls
export const mockVideos = [
  {
    id: 1,
    src: 'https://dn721600.ca.archive.org/0/items/murder-2/Murder%20%232.ia.mp4',
    title: 'Murder on the Orient Express',
    description: 'A luxurious train journey becomes a scene of mystery and intrigue.',
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=500&q=60',
    genre: ['Mystery', 'Thriller'],
    language: 'English',
    year: 2017,
    duration: 114,
    rating: 8.5,
    watched: 1200,
    added: 1718000000000,
    director: 'Kenneth Branagh',
    cast: ['Kenneth Branagh', 'Johnny Depp', 'Michelle Pfeiffer'],
  },
  {
    id: 1001,
    src: 'https://jio4.fwfiles.cc/files/data/Tere_Ishk_Mein_2025_Hindi_Full_Movie_1080p_WEB-DL-(Filmywap.mov).mp4?st=A6NJnKTDynNUFr3L6wgZgw&e=1769579648',
    title: 'Tere Ishk Mein',
    description: 'A 2025 Hindi romantic drama film.',
    poster: 'https://placehold.co/300x450?text=Tere+Ishk+Mein+2025&font=raleway',
    genre: ['Romance', 'Drama'],
    language: 'Hindi',
    year: 2025,
    duration: 150,
    rating: 0,
    watched: 0,
    added: 1769539200000, // Jan 27, 2026
    director: 'Unknown',
    cast: ['Unknown'],
  },
  {
    id: 2,
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    title: 'Big Buck Bunny',
    description: 'A large rabbit is annoyed by small creatures and decides to teach them a lesson.',
    poster: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
    genre: ['Animation', 'Comedy'],
    language: 'English',
    year: 2008,
    duration: 9,
    rating: 7.8,
    watched: 900,
    added: 1717000000000,
    director: 'Sacha Goedegebure',
    cast: ['Multiple'],
  },
  {
    id: 3,
    src: 'https://www.w3schools.com/html/movie.mp4',
    title: 'Bear in the Forest',
    description: 'A serene journey through nature with a curious bear.',
    poster: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=60',
    genre: ['Documentary', 'Nature'],
    language: 'English',
    year: 2019,
    duration: 15,
    rating: 8.2,
    watched: 500,
    added: 1716000000000,
    director: 'Nature Films Studio',
    cast: ['Various'],
  },
  {
    id: 4,
    src: 'https://dn721603.ca.archive.org/0/items/murder-3-2013/Murder%203%20%282013%29.ia.mp4',
    title: 'Murder 3',
    description: 'The third installment in the murder mystery series.',
    poster: 'https://images.unsplash.com/photo-1477720643006-71986b2717ba?auto=format&fit=crop&w=500&q=60',
    genre: ['Thriller', 'Crime'],
    language: 'Hindi',
    year: 2013,
    duration: 128,
    rating: 6.9,
    watched: 1200,
    added: 1718000000000,
    director: 'Vishal Pandya',
    cast: ['Emraan Hashmi', 'Jacqueline Fernandez'],
  },
];

// Mock short videos
export const mockShortVideos = [
  {
    id: 's1',
    title: 'Epic Movie Scene',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    creator: 'MovieClips',
    duration: 30,
    views: 150000,
    likes: 12000,
    comments: 450,
    shares: 890,
  },
  {
    id: 's2',
    title: 'Behind the Scenes',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    creator: 'FilmMaker_Pro',
    duration: 45,
    views: 89000,
    likes: 5600,
    comments: 234,
    shares: 567,
  },
];

// Video service functions
export const videoService = {
  // Fetch all videos (including custom)
  getAllVideos: async (customMovies = []) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Ensure customMovies is an array
        const movies = Array.isArray(customMovies) ? customMovies : [];
        // Combine mock videos with custom movies added via admin
        const allVideos = [...movies, ...mockVideos];
        resolve(allVideos);
      }, 500);
    });
  },

  // Get single video
  getVideoById: async (id, customMovies = []) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Ensure customMovies is an array
        const movies = Array.isArray(customMovies) ? customMovies : [];
        // Check custom movies first (handle both string and number IDs)
        let video = movies.find((v) => v.id === id || String(v.id) === String(id));
        // Then check mock videos (mock videos have numeric IDs)
        if (!video) {
          video = mockVideos.find((v) => v.id === parseInt(id) || v.id === id);
        }
        resolve(video);
      }, 300);
    });
  },

  // Search videos
  searchVideos: async (query, customMovies = []) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Ensure customMovies is an array
        const movies = Array.isArray(customMovies) ? customMovies : [];
        const allVideos = [...movies, ...mockVideos];
        const results = allVideos.filter((v) =>
          v.title.toLowerCase().includes(query.toLowerCase()) ||
          v.description?.toLowerCase().includes(query.toLowerCase())
        );
        resolve(results);
      }, 400);
    });
  },

  // Get short videos
  getShortVideos: async (customMovies = []) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Ensure customMovies is an array
        const movies = Array.isArray(customMovies) ? customMovies : [];
        
        // Filter custom movies marked as shorts
        const customShorts = movies.filter((m) => m.isShort);
        
        // Convert custom shorts to short video format
        const shortsFromCustom = customShorts.map((m) => ({
          ...m,
          id: m.id,
          videoUrl: m.videoUrl || m.src,
          creator: m.director || 'Admin',
        }));
        
        // Combine with mock shorts
        const allShorts = [...shortsFromCustom, ...mockShortVideos];
        resolve(allShorts);
      }, 500);
    });
  },

  // Get trending
  getTrendingVideos: async (customMovies = []) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Ensure customMovies is an array
        const movies = Array.isArray(customMovies) ? customMovies : [];
        const allVideos = [...movies, ...mockVideos];
        const trending = [...allVideos].sort((a, b) => (b.watched || 0) - (a.watched || 0));
        resolve(trending);
      }, 500);
    });
  },

  // Get videos by genre
  getVideosByGenre: async (genre, customMovies = []) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Ensure customMovies is an array
        const movies = Array.isArray(customMovies) ? customMovies : [];
        const allVideos = [...movies, ...mockVideos];
        const results = allVideos.filter((v) => 
          (Array.isArray(v.genre) ? v.genre : [v.genre]).includes(genre)
        );
        resolve(results);
      }, 400);
    });
  },

  // Upload video (mock)
  uploadVideo: async (formData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          id: Date.now(),
          message: 'Video uploaded successfully',
        });
      }, 1000);
    });
  },

  // Request movie (mock)
  requestMovie: async (movieData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          id: Date.now(),
          message: 'Movie request submitted successfully',
        });
      }, 800);
    });
  },
};

// Export named functions
export const uploadVideo = videoService.uploadVideo;
export const getShortVideos = videoService.getShortVideos;
export const getAllVideos = videoService.getAllVideos;
export const getVideoById = videoService.getVideoById;
export const searchVideos = videoService.searchVideos;
export const getTrendingVideos = videoService.getTrendingVideos;
export const getVideosByGenre = videoService.getVideosByGenre;
export const requestMovie = videoService.requestMovie;

// Export default
export default videoService;
