// The backend may nest owner details under different shapes depending on
// the endpoint (a flat ownerId/owner_id, or a related `users` object like
// loanService normalizes loans from). Check every shape so "is this my own
// listing" works regardless of which one a given response uses.
export function isOwnListing(listing, user) {
  if (!listing || !user) return false;

  const ownerId =
    listing.ownerId ?? listing.owner_id ?? listing.userId ?? listing.user_id ?? listing.users?.id;

  return ownerId != null && String(ownerId) === String(user.id);
}
