import type { Profile, UserProfile } from '@/types';

export interface CompatibilityResult {
  score: number; // 0 to 100
  reasons: string[];
}

/**
 * Calculates a traveler's compatibility with a specific trip (0-100%).
 * Uses a weighted multi-factor algorithm:
 * - Destination Matching: 15%
 * - Budget Alignment: 15%
 * - Travel Style / Category Compatibility: 15%
 * - Bike Type Throttling: 10%
 * - Riding Experience vs Difficulty: 10%
 * - Interests Overlaps: 10%
 * - Language Matching: 10%
 * - Age Group Proximity: 5%
 * - Ratings Boost: 5%
 * - Date Availability / Default Match: 5%
 */
export function calculateCompatibility(
  profile: any,
  trip: any
): CompatibilityResult {
  let score = 0;
  const reasons: string[] = [];

  // 1. Destination Matching (Weight: 15%)
  const preferredDests = profile.preferredDestinations || [];
  const tripDest = trip.endLocation?.toLowerCase().trim();
  const tripStartLoc = trip.startLocation?.toLowerCase().trim();

  let destinationMatch = false;
  if (tripDest && preferredDests.length > 0) {
    destinationMatch = preferredDests.some((dest: string) => {
      const d = dest.toLowerCase().trim();
      return tripDest.includes(d) || d.includes(tripDest) || (tripStartLoc && (tripStartLoc.includes(d) || d.includes(tripStartLoc)));
    });
  }

  if (destinationMatch) {
    score += 15;
    reasons.push('Matches preferred destination');
  } else if (tripDest) {
    const bioText = (profile.bio || '').toLowerCase();
    const hasInterest = (profile.interests || []).some((interest: string) => tripDest.includes(interest.toLowerCase()));
    if (bioText.includes(tripDest) || hasInterest) {
      score += 8;
      reasons.push('Destination aligned with interests');
    }
  }

  // 2. Budget Matching (Weight: 15%)
  const budgetPref = profile.budgetPref;
  const tripBudget = trip.budgetRange;

  if (budgetPref && tripBudget) {
    if (budgetPref === tripBudget) {
      score += 15;
      reasons.push('Aligned budget style');
    } else {
      const map = { BUDGET: 0, MODERATE: 1, LUXURY: 2 };
      const diff = Math.abs(map[budgetPref as keyof typeof map] - map[tripBudget as keyof typeof map]);
      if (diff === 1) {
        score += 7;
        reasons.push('Compatible budget');
      }
    }
  } else {
    score += 10;
  }

  // 3. Travel Style / Category Matching (Weight: 15%)
  const travelStyle = profile.travelStyle;
  const tripType = trip.type;

  let travelStyleMatch = false;
  if (travelStyle && tripType) {
    const styleLower = travelStyle.toLowerCase();
    const typeLower = tripType.toLowerCase();

    if (styleLower === 'adventure' && (typeLower.includes('trek') || typeLower.includes('bike'))) {
      travelStyleMatch = true;
    } else if (styleLower === 'backpacking' && (typeLower.includes('backpack') || typeLower.includes('road'))) {
      travelStyleMatch = true;
    } else if (styleLower === 'leisure' && (typeLower.includes('weekend') || typeLower.includes('road'))) {
      travelStyleMatch = true;
    } else if (styleLower === 'luxury' && typeLower.includes('international')) {
      travelStyleMatch = true;
    }

    if (travelStyleMatch) {
      score += 15;
      reasons.push(`Similar travel style (${travelStyle})`);
    } else {
      score += 5;
    }
  } else {
    score += 10;
  }

  // 4. Bike Type Matching (Weight: 10%)
  const bikeType = profile.bikeType;
  const tripVehicle = trip.vehicle;

  if (tripType === 'BIKE_RIDE') {
    if (bikeType && bikeType.toLowerCase() !== 'none') {
      if (tripVehicle) {
        const bikeLower = bikeType.toLowerCase();
        const vehicleLower = tripVehicle.toLowerCase();
        if (vehicleLower.includes(bikeLower) || bikeLower.includes(vehicleLower)) {
          score += 10;
          reasons.push(`Perfect bike match (${bikeType})`);
        } else {
          score += 6;
          reasons.push('Fellow rider');
        }
      } else {
        score += 8;
        reasons.push('Fellow rider');
      }
    } else {
      score += 0;
    }
  } else {
    score += 10;
  }

  // 5. Riding Experience / Difficulty (Weight: 10%)
  const ridingExp = profile.ridingExperience;
  const difficulty = trip.difficulty;

  if (difficulty) {
    if (ridingExp) {
      const expLower = ridingExp.toLowerCase();
      const diffLower = difficulty.toLowerCase();

      if (expLower === 'expert' || (expLower === 'intermediate' && diffLower !== 'hard') || (expLower === 'beginner' && diffLower === 'easy')) {
        score += 10;
        reasons.push('Skill level fits trip');
      } else {
        score += 4;
      }
    } else {
      score += 7;
    }
  } else {
    score += 10;
  }

  // 6. Interests Matching (Weight: 10%)
  const profileInterests = profile.interests || [];
  const tripTitle = (trip.title || '').toLowerCase();
  const tripDesc = (trip.description || '').toLowerCase();

  let interestMatches = 0;
  if (profileInterests.length > 0) {
    profileInterests.forEach((interest: string) => {
      const lowerInt = interest.toLowerCase();
      if (tripTitle.includes(lowerInt) || tripDesc.includes(lowerInt)) {
        interestMatches++;
      }
    });
  }

  if (interestMatches > 0) {
    const interestScore = Math.min(10, interestMatches * 4);
    score += interestScore;
    reasons.push('Shares matching interests');
  }

  // 7. Languages Matching (Weight: 10%)
  const profileLangs = profile.languages || [];
  const tripLangs = trip.languages || [];

  if (tripLangs.length > 0) {
    const sharedLangs = profileLangs.filter((lang: string) => tripLangs.some((l: string) => l.toLowerCase() === lang.toLowerCase()));
    if (sharedLangs.length > 0) {
      score += 10;
      reasons.push(`Speaks same language (${sharedLangs[0]})`);
    } else {
      score += 0;
    }
  } else {
    score += 10;
  }

  // 8. Age Group Compatibility (Weight: 5%)
  const ownerProfile = trip.owner?.profile;
  const ownerBirth = ownerProfile?.birthDate ? new Date(ownerProfile.birthDate) : null;
  const userBirth = profile.birthDate ? new Date(profile.birthDate) : null;

  if (ownerBirth && userBirth) {
    const ownerAge = new Date().getFullYear() - ownerBirth.getFullYear();
    const userAge = new Date().getFullYear() - userBirth.getFullYear();
    const ageDiff = Math.abs(ownerAge - userAge);

    if (ageDiff <= 5) {
      score += 5;
      reasons.push('Similar age group');
    } else if (ageDiff <= 12) {
      score += 3;
    } else {
      score += 1;
    }
  } else {
    score += 3;
  }

  // 9. Default Schedule/Availability Alignment (Weight: 5%)
  score += 5;

  // 10. Ratings boost (Weight: 5%)
  const travelerRating = profile.rating || 0.0;
  if (travelerRating > 0) {
    const ratingWeight = Math.round((travelerRating / 5.0) * 5);
    score += ratingWeight;
    if (travelerRating >= 4.5) {
      reasons.push('Highly rated traveler');
    }
  } else {
    score += 4;
  }

  const finalScore = Math.max(0, Math.min(100, score));
  const uniqueReasons = Array.from(new Set(reasons));
  const finalReasons = uniqueReasons.slice(0, 2);

  if (finalReasons.length === 0) {
    finalReasons.push('Good overall match');
  }

  return {
    score: finalScore,
    reasons: finalReasons,
  };
}
