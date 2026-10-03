// Geofencing and Safe Zone Utilities for Dhairya Platform
// Default Safe Zone Radius: 1.0 km (1000 meters)

export const DEFAULT_SAFE_RADIUS_KM = 1.0;

// Regional Capital / Major City Default Home GPS Anchors for North East India
export const REGIONAL_HOME_COORDINATES = {
  assam: { city: 'Guwahati, Assam', latitude: 26.1445, longitude: 91.7362 },
  meghalaya: { city: 'Shillong, Meghalaya', latitude: 25.5788, longitude: 91.8933 },
  manipur: { city: 'Imphal, Manipur', latitude: 24.8170, longitude: 93.9368 },
  mizoram: { city: 'Aizawl, Mizoram', latitude: 23.7271, longitude: 92.7176 },
  nagaland: { city: 'Kohima, Nagaland', latitude: 25.6751, longitude: 94.1086 },
  tripura: { city: 'Agartala, Tripura', latitude: 23.8315, longitude: 91.2868 },
  arunachal: { city: 'Itanagar, Arunachal Pradesh', latitude: 27.0844, longitude: 93.6053 },
  sikkim: { city: 'Gangtok, Sikkim', latitude: 27.3389, longitude: 88.6065 }
};

/**
 * Calculates Great Circle distance between two latitude/longitude points in kilometers using Haversine formula
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return 0;
  const numLat1 = parseFloat(lat1);
  const numLon1 = parseFloat(lon1);
  const numLat2 = parseFloat(lat2);
  const numLon2 = parseFloat(lon2);
  if (isNaN(numLat1) || isNaN(numLon1) || isNaN(numLat2) || isNaN(numLon2)) return 0;

  const R = 6371; // Earth's radius in kilometers
  const dLat = (numLat2 - numLat1) * Math.PI / 180;
  const dLon = (numLon2 - numLon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(numLat1 * Math.PI / 180) * Math.cos(numLat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Formats a distance in kilometers into a human-friendly string (e.g. "350 m" or "1.45 km")
 */
export function formatDistance(distanceKm) {
  if (distanceKm === undefined || distanceKm === null || isNaN(distanceKm)) return '0 m';
  const num = parseFloat(distanceKm);
  if (num < 1.0) {
    return `${Math.round(num * 1000)} m`;
  }
  return `${num.toFixed(2)} km`;
}

/**
 * Computes simulated coordinates offset by a specific distance (in km) and bearing from origin
 */
export function calculateOffsetCoordinates(originLat, originLng, distanceKm, bearingDegrees = 45) {
  const R = 6371; // Earth radius in km
  const d = parseFloat(distanceKm);
  const lat1 = (parseFloat(originLat) * Math.PI) / 180;
  const lon1 = (parseFloat(originLng) * Math.PI) / 180;
  const brng = (bearingDegrees * Math.PI) / 180;

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(d / R) +
    Math.cos(lat1) * Math.sin(d / R) * Math.cos(brng)
  );

  const lon2 = lon1 + Math.atan2(
    Math.sin(brng) * Math.sin(d / R) * Math.cos(lat1),
    Math.cos(d / R) - Math.sin(lat1) * Math.sin(lat2)
  );

  return {
    latitude: (lat2 * 180) / Math.PI,
    longitude: (lon2 * 180) / Math.PI
  };
}

// Audio state management
let activeAudioContext = null;
let activeOscillators = [];

/**
 * Stops any currently playing alert siren or voice announcement
 */
export function stopGeofenceAlertSound() {
  try {
    if (activeOscillators && activeOscillators.length > 0) {
      activeOscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {
          // Ignore already stopped oscillators
        }
      });
      activeOscillators = [];
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  } catch (e) {
    // Safe error handling
  }
}

/**
 * Internal helper to generate a single sound pulse with envelope
 */
function createAlarmTone(ctx, destination, freq, type, startTime, duration, gainLevel = 0.3) {
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    // Audio envelope: sharp attack, sustained warning level, rapid decay
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(gainLevel, startTime + 0.02);
    gain.gain.setValueAtTime(gainLevel, startTime + duration - 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);

    activeOscillators.push(osc);
  } catch (e) {
    // Oscillator error guard
  }
}

/**
 * Plays an unmistakable, urgent multi-tone emergency alarm siren using Web Audio API
 */
export function playEmergencySirenSound({ repeatCount = 3, withVoice = true, patientName = '', distanceText = '' } = {}) {
  try {
    stopGeofenceAlertSound();

    const AudioContextClass = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    activeAudioContext = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.35, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const startTime = ctx.currentTime + 0.03;
    const pulseLen = 0.16;
    const pulseGap = 0.05;

    // Pulse Pattern: alternating High-Low-High-Urgent siren frequencies
    for (let set = 0; set < repeatCount; set++) {
      const setStart = startTime + set * 0.70;

      // Pulse 1: Urgent High Tone (932 Hz - A#5) with harmonic
      createAlarmTone(ctx, masterGain, 932.33, 'sawtooth', setStart, pulseLen, 0.28);
      createAlarmTone(ctx, masterGain, 1864.66, 'sine', setStart, pulseLen, 0.12);

      // Pulse 2: Warning Mid-Tone (659.25 Hz - E5)
      createAlarmTone(ctx, masterGain, 659.25, 'sawtooth', setStart + pulseLen + pulseGap, pulseLen, 0.28);
      createAlarmTone(ctx, masterGain, 1318.5, 'sine', setStart + pulseLen + pulseGap, pulseLen, 0.12);

      // Pulse 3: High Peak Alarm Tone (1046.50 Hz - C6)
      createAlarmTone(ctx, masterGain, 1046.50, 'sawtooth', setStart + (pulseLen + pulseGap) * 2, pulseLen, 0.32);

      // Pulse 4: Attention Tone (880 Hz - A5)
      createAlarmTone(ctx, masterGain, 880.00, 'triangle', setStart + (pulseLen + pulseGap) * 3, pulseLen, 0.25);
    }

    // Spoken Voice Warning for maximum clarity & accessibility
    if (withVoice && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setTimeout(() => {
        try {
          const text = patientName
            ? `Emergency Alert. ${patientName} has wandered beyond the one kilometer safe boundary.`
            : `Emergency Alert. Patient has wandered beyond the one kilometer safe boundary.`;

          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 1.05;
          utterance.pitch = 1.15;
          utterance.volume = 1.0;
          window.speechSynthesis.speak(utterance);
        } catch (voiceErr) {
          // Voice synthesis fallback
        }
      }, 750);
    }
  } catch (e) {
    console.warn('Emergency siren playback exception:', e);
  }
}

/**
 * Backward-compatible alias for existing caller imports
 */
export function playGeofenceAlertChime(options = {}) {
  return playEmergencySirenSound(options);
}

/**
 * Directly speaks a custom voice warning
 */
export function speakGeofenceVoiceWarning(message) {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 1.05;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  } catch (e) {}
}
