// src/data/mockListings.js
// Fallback catalog data (from the backend's seed data) used when the live
// API is unreachable, so the Catalog page has real cards to show during
// development. Safe to delete once a backend is available to hit.

import airCompressorImage from '../images/airCompressorImage.png';
import clawHammerImage from '../images/claw-hammer.png';
import drillImage from '../images/drill.png';
import lawnMowerImage from '../images/lawnmower.png';
import leafBlowerImage from '../images/leafblower.png';
import miterSawImage from '../images/milterSawImage.png';
import pipeWrenchImage from '../images/pipewrench.png';
import socketSetImage from '../images/socketset.png';
import tableSawImage from '../images/tablesaw.png';

export const mockListings = [
  {
    id: 1,
    title: 'Cordless Drill/Driver Combo',
    ownerName: 'Kendall',
    category: 'Power Tools',
    pricePerDay: 8,
    imageUrl: drillImage,
  },
  {
    id: 2,
    title: 'Circular Saw',
    ownerName: 'Kendall',
    category: 'Power Tools',
    pricePerDay: 12,
    imageUrl: tableSawImage,
  },
  {
    id: 3,
    title: 'Table Saw',
    ownerName: 'Miguel',
    category: 'Power Tools',
    pricePerDay: 18,
    imageUrl: tableSawImage,
  },
  {
    id: 4,
    title: 'Router',
    ownerName: 'Miguel',
    category: 'Power Tools',
    pricePerDay: 9,
    imageUrl: drillImage,
  },
  {
    id: 5,
    title: 'Air Compressor',
    ownerName: 'Joy',
    category: 'Power Tools',
    pricePerDay: 14,
    imageUrl: airCompressorImage,
  },
  {
    id: 6,
    title: 'Miter Saw',
    ownerName: 'Dennis',
    category: 'Power Tools',
    pricePerDay: 15,
    imageUrl: miterSawImage,
  },
  {
    id: 7,
    title: 'Socket Set',
    ownerName: 'Kdusan',
    category: 'Hand Tools',
    pricePerDay: 6,
    imageUrl: socketSetImage,
  },
  {
    id: 8,
    title: 'Claw Hammer',
    ownerName: 'Kdusan',
    category: 'Hand Tools',
    pricePerDay: 3,
    imageUrl: clawHammerImage,
  },
  {
    id: 9,
    title: 'Pipe Wrench',
    ownerName: 'Michelle',
    category: 'Hand Tools',
    pricePerDay: 5,
    imageUrl: pipeWrenchImage,
  },
  {
    id: 10,
    title: 'Push Lawn Mower',
    ownerName: 'Shahem',
    category: 'Yard Tools',
    pricePerDay: 20,
    imageUrl: lawnMowerImage,
  },
  {
    id: 11,
    title: 'Leaf Blower',
    ownerName: 'Shahem',
    category: 'Yard Tools',
    pricePerDay: 12,
    imageUrl: leafBlowerImage,
  },
  {
    id: 12,
    title: 'Chainsaw',
    ownerName: 'Jordan',
    category: 'Yard Tools',
    pricePerDay: 18,
    imageUrl: lawnMowerImage,
  },
];
