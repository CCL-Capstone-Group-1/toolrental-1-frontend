// src/data/mockListingStore.js
// Mirrors the pattern already used in mockLoanStore.js — listings are
// simulated client-side (localStorage) since there's no live backend
// write path wired up yet for this demo.

const STORAGE_KEY = "mockListings";

function readAll() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function writeAll(listings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
}

export function getMockListings() {
  return readAll();
}

export function getMockListingById(id) {
  return readAll().find((listing) => String(listing.id) === String(id)) || null;
}

export function addMockListing(listingData) {
  const listings = readAll();
  const newListing = {
    id: Date.now(),
    isActive: true,
    createdAt: new Date().toISOString(),
    ...listingData,
  };
  listings.push(newListing);
  writeAll(listings);
  return newListing;
}

export function updateMockListing(id, patch) {
  const listings = readAll();
  const index = listings.findIndex((listing) => String(listing.id) === String(id));
  if (index === -1) return null;
  listings[index] = { ...listings[index], ...patch };
  writeAll(listings);
  return listings[index];
}

export function deleteMockListing(id) {
  const listings = readAll().filter((listing) => String(listing.id) !== String(id));
  writeAll(listings);
}
