// src/data/mockListings.js
// Fallback catalog data (from the backend's seed data) used when the live
// API is unreachable, so the Catalog page has real cards to show during
// development. Safe to delete once a backend is available to hit.

// `rentalCount` and `seasonal` are placeholder fields — the real backend
// schema (Tool/Listing/Loan) has no such fields yet. `rentalCount` should
// eventually come from a `count(loans) group by listingId` query, and
// `seasonal` would need a real column or tagging convention added to the
// Tool model. Remove/replace these once that backend support exists.
export const mockListings = [
  {
    id: 1,
    title: "Cordless Drill/Driver Combo",
    ownerName: "Kendall",
    category: "Power Tools",
    pricePerDay: 8,
    rentalCount: 42,
    seasonal: false,
    available: true,
    imageUrl:
      "https://images.pexels.com/photos/1249610/pexels-photo-1249610.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
  {
    id: 2,
    title: "Circular Saw",
    ownerName: "Kendall",
    category: "Power Tools",
    pricePerDay: 12,
    rentalCount: 27,
    seasonal: false,
    available: true,
    imageUrl:
      "https://images.pexels.com/photos/8820180/pexels-photo-8820180.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
  {
    id: 3,
    title: "Table Saw",
    ownerName: "Miguel",
    category: "Power Tools",
    pricePerDay: 18,
    rentalCount: 15,
    seasonal: false,
    available: true,
    imageUrl:
      "https://images.pexels.com/photos/313776/pexels-photo-313776.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
  {
    id: 4,
    title: "Router",
    ownerName: "Miguel",
    category: "Power Tools",
    pricePerDay: 9,
    rentalCount: 9,
    seasonal: false,
    available: true,
    imageUrl: "https://placehold.co/800x600?text=Router",
  },
  {
    id: 5,
    title: "Air Compressor",
    ownerName: "Joy",
    category: "Power Tools",
    pricePerDay: 14,
    rentalCount: 19,
    seasonal: false,
    available: true,
    imageUrl: "https://placehold.co/800x600?text=Air+Compressor",
  },
  {
    id: 6,
    title: "Miter Saw",
    ownerName: "Dennis",
    category: "Power Tools",
    pricePerDay: 15,
    rentalCount: 11,
    seasonal: false,
    available: false,
    imageUrl:
      "https://images.pexels.com/photos/8447855/pexels-photo-8447855.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
  {
    id: 7,
    title: "Socket Set",
    ownerName: "Kdusan",
    category: "Hand Tools",
    pricePerDay: 6,
    rentalCount: 33,
    seasonal: false,
    available: true,
    imageUrl:
      "https://images.pexels.com/photos/4792482/pexels-photo-4792482.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
  {
    id: 8,
    title: "Claw Hammer",
    ownerName: "Kdusan",
    category: "Hand Tools",
    pricePerDay: 3,
    rentalCount: 24,
    seasonal: false,
    available: true,
    imageUrl:
      "https://images.pexels.com/photos/5974343/pexels-photo-5974343.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
  {
    id: 9,
    title: "Pipe Wrench",
    ownerName: "Michelle",
    category: "Hand Tools",
    pricePerDay: 5,
    rentalCount: 7,
    seasonal: false,
    available: false,
    imageUrl: "https://placehold.co/800x600?text=Pipe+Wrench",
  },
  {
    id: 10,
    title: "Push Lawn Mower",
    ownerName: "Shahem",
    category: "Yard Tools",
    pricePerDay: 20,
    rentalCount: 21,
    seasonal: true,
    available: true,
    imageUrl:
      "https://images.pexels.com/photos/4162016/pexels-photo-4162016.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
  {
    id: 11,
    title: "Leaf Blower",
    ownerName: "Shahem",
    category: "Yard Tools",
    pricePerDay: 12,
    rentalCount: 18,
    seasonal: true,
    available: true,
    imageUrl:
      "https://images.pexels.com/photos/1623214/pexels-photo-1623214.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
  {
    id: 12,
    title: "Chainsaw",
    ownerName: "Jordan",
    category: "Yard Tools",
    pricePerDay: 18,
    rentalCount: 13,
    seasonal: true,
    available: true,
    imageUrl:
      "https://images.pexels.com/photos/8820192/pexels-photo-8820192.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
];
