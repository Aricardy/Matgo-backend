import express from 'express';
const router = express.Router();

// GET all routes
router.get('/', async (req, res) => {
  try {
    // Sample route data - in a real app this would come from database
    const routes = [
      {
        id: "nairobi-mombasa",
        routeId: "nairobi-mombasa",
        name: "Nairobi ↔ Mombasa",
        route: "Nairobi ↔ Mombasa",
        destination: "Mombasa",
        price: 2200,
        fare: 2200,
        stops: ["Nairobi", "Machakos", "Mtito Andei", "Voi", "Mariakani", "Mombasa"],
        majorStops: ["Nairobi", "Machakos", "Mtito Andei", "Voi", "Mariakani", "Mombasa"],
        image: "https://placehold.co/800x250.png",
        imageHint: "mombasa road bus",
        sacco: "Mombasa Raha",
        saccoName: "Mombasa Raha"
      },
      {
        id: "nairobi-kisumu",
        routeId: "nairobi-kisumu",
        name: "Nairobi ↔ Kisumu",
        route: "Nairobi ↔ Kisumu",
        destination: "Kisumu",
        price: 1800,
        fare: 1800,
        stops: ["Nairobi", "Naivasha", "Nakuru", "Kericho", "Kisumu"],
        majorStops: ["Nairobi", "Naivasha", "Nakuru", "Kericho", "Kisumu"],
        image: "https://placehold.co/800x250.png",
        imageHint: "kisumu highway bus",
        sacco: "Kisumu Express",
        saccoName: "Kisumu Express"
      },
      {
        id: "nairobi-eldoret",
        routeId: "nairobi-eldoret",
        name: "Nairobi ↔ Eldoret",
        route: "Nairobi ↔ Eldoret",
        destination: "Eldoret",
        price: 1500,
        fare: 1500,
        stops: ["Nairobi", "Naivasha", "Nakuru", "Eldoret"],
        majorStops: ["Nairobi", "Naivasha", "Nakuru", "Eldoret"],
        image: "https://placehold.co/800x250.png",
        imageHint: "eldoret route bus",
        sacco: "Eldoret Shuttle",
        saccoName: "Eldoret Shuttle"
      }
    ];
    
    res.json(routes);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

export default router;