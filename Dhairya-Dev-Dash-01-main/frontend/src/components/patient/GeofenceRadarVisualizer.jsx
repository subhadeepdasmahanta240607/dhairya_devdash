import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  ShieldAlert, 
  MapPin, 
  Navigation, 
  Radio, 
  Compass, 
  RotateCcw, 
  AlertTriangle, 
  Phone, 
  ExternalLink,
  Edit3,
  Save,
  Check,
  Zap,
  Home,
  Sparkles,
  Volume2
} from 'lucide-react';
import { formatDistance, calculateDistanceKm, playEmergencySirenSound, stopGeofenceAlertSound } from '../../utils/geofenceUtils';

export default function GeofenceRadarVisualizer({ patient, isCaregiverView = false }) {
  const { 
    updatePatientLocation, 
    updatePatientHomeLocation,
    simulatePatientWander, 
    resetPatientToHome,
    triggerGeofenceAlertBroadcast,
    geofenceAlert
  } = useApp();

  const targetPatient = patient || {};
  const [isEditingHome, setIsEditingHome] = useState(false);
  const [homeAddress, setHomeAddress] = useState('');
  const [homeLat, setHomeLat] = useState(26.1445);
  const [homeLng, setHomeLng] = useState(91.7362);
  const [safeRadiusKm, setSafeRadiusKm] = useState(1.0);
  const [isRealGpsActive, setIsRealGpsActive] = useState(false);
  const [gpsStatusText, setGpsStatusText] = useState('');

  // Extract patient home & current location
  const homeLoc = useMemo(() => {
    return targetPatient.homeLocation || {
      address: targetPatient.location || 'Guwahati, Assam',
      latitude: targetPatient.location?.toLowerCase().includes('shillong') ? 25.5788 : 26.1445,
      longitude: targetPatient.location?.toLowerCase().includes('shillong') ? 91.8933 : 91.7362,
      safeRadiusKm: 1.0
    };
  }, [targetPatient]);

  const currentLoc = useMemo(() => {
    return targetPatient.currentLocation || {
      latitude: homeLoc.latitude,
      longitude: homeLoc.longitude,
      address: homeLoc.address,
      distanceFromHomeKm: 0.1,
      isBeyondSafeZone: false
    };
  }, [targetPatient, homeLoc]);

  useEffect(() => {
    setHomeAddress(homeLoc.address || 'Guwahati, Assam');
    setHomeLat(homeLoc.latitude || 26.1445);
    setHomeLng(homeLoc.longitude || 91.7362);
    setSafeRadiusKm(homeLoc.safeRadiusKm || 1.0);
  }, [homeLoc]);

  const distanceKm = currentLoc.distanceFromHomeKm !== undefined 
    ? currentLoc.distanceFromHomeKm 
    : calculateDistanceKm(homeLoc.latitude, homeLoc.longitude, currentLoc.latitude, currentLoc.longitude);

  const isBreached = distanceKm > (safeRadiusKm || 1.0);
  const emergencyPhone = targetPatient.phone || targetPatient.emergencyContact || '+91 94350 12345';
  const mapsUrl = `https://www.google.com/maps?q=${currentLoc.latitude || 26.1445},${currentLoc.longitude || 91.7362}`;

  // Real GPS Geolocation Watcher
  useEffect(() => {
    let watchId = null;
    if (isRealGpsActive && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      setGpsStatusText('🛰️ Tracking device GPS coordinates...');
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setGpsStatusText(`🛰️ Live GPS Active (±${Math.round(pos.coords.accuracy)}m)`);
          if (typeof updatePatientLocation === 'function') {
            updatePatientLocation(targetPatient.id || targetPatient._id, {
              latitude,
              longitude,
              address: 'Device Real GPS Location'
            });
          }
        },
        (err) => {
          console.warn('Geolocation error:', err.message);
          setGpsStatusText('⚠️ GPS permission not granted; using simulator.');
          setIsRealGpsActive(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
      );
    }
    return () => {
      if (watchId && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isRealGpsActive, targetPatient, updatePatientLocation]);

  const handleSaveHome = async () => {
    try {
      if (typeof updatePatientHomeLocation === 'function') {
        await updatePatientHomeLocation(targetPatient.id || targetPatient._id, {
          address: homeAddress,
          latitude: parseFloat(homeLat),
          longitude: parseFloat(homeLng),
          safeRadiusKm: parseFloat(safeRadiusKm)
        });
      }
      setIsEditingHome(false);
    } catch (e) {
      setIsEditingHome(false);
    }
  };

  const handleSimulate = (offset) => {
    setIsRealGpsActive(false);
    setGpsStatusText(`🕹️ Simulated Position: ${offset} km`);
    if (offset > (safeRadiusKm || 1.0)) {
      playEmergencySirenSound({
        repeatCount: 4,
        withVoice: true,
        patientName: targetPatient.name || 'Elder',
        distanceText: formatDistance(offset)
      });
    }
    if (typeof simulatePatientWander === 'function') {
      simulatePatientWander(targetPatient.id || targetPatient._id, offset);
    }
  };

  const handleReset = () => {
    setIsRealGpsActive(false);
    setGpsStatusText('');
    stopGeofenceAlertSound();
    if (typeof resetPatientToHome === 'function') {
      resetPatientToHome(targetPatient.id || targetPatient._id);
    }
  };

  // Radar position calculations (Normalized for SVG circle display)
  // Center is (100, 100), radius 70 represents 1.0 km safe boundary.
  const normalizedDistance = Math.min(distanceKm / (safeRadiusKm || 1.0), 2.2); // scale ratio
  const radarDistancePx = normalizedDistance * 60;
  // Patient point positioned at 45 degree angle
  const patientX = 100 + radarDistancePx * Math.cos(Math.PI / 4);
  const patientY = 100 - radarDistancePx * Math.sin(Math.PI / 4);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-2xs space-y-6">
      
      {/* Header with Live Geofence Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isBreached ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {isBreached ? <ShieldAlert className="w-5 h-5 animate-pulse" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
                <span>GPS Geofencing & 1 km Safe Zone</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                  Dementia Wandering Guard
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                Automated popups and WhatsApp notifications trigger when elder travels beyond 1.0 km from home.
              </p>
            </div>
          </div>
        </div>

        {/* Status Pill */}
        <div className={`self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 border shadow-2xs ${
          isBreached 
            ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          <Radio className="w-3.5 h-3.5" />
          <span>{isBreached ? '⚠️ Beyond Safe Zone (>1 km)' : '✓ In Safe Zone (<1 km)'}</span>
        </div>
      </div>

      {/* Main Grid: Visual Radar & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Interactive Animated Radar Visualizer (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-3xl bg-[#FAF7F2] border border-stone-200/80 relative overflow-hidden">
          
          <div className="relative w-56 h-56 flex items-center justify-center">
            
            {/* SVG Radar Map Grid */}
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Outer boundary circles */}
              <circle cx="100" cy="100" r="90" fill="none" stroke="#E5E0D8" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="100" cy="100" r="60" fill={isBreached ? 'rgba(244, 63, 94, 0.06)' : 'rgba(16, 185, 129, 0.08)'} stroke={isBreached ? '#F43F5E' : '#10B981'} strokeWidth="2" />
              <circle cx="100" cy="100" r="30" fill="none" stroke="#D1C7B7" strokeWidth="1" strokeDasharray="2 2" />

              {/* Axis Crosshairs */}
              <line x1="10" y1="100" x2="190" y2="100" stroke="#E5E0D8" strokeWidth="1" />
              <line x1="100" y1="10" x2="100" y2="190" stroke="#E5E0D8" strokeWidth="1" />

              {/* Home Safe Zone Label */}
              <text x="100" y="48" fill="#10B981" fontSize="8" fontWeight="bold" textAnchor="middle">1.0 km Safe Boundary</text>

              {/* Line from Home to Patient */}
              <line 
                x1="100" 
                y1="100" 
                x2={patientX} 
                y2={patientY} 
                stroke={isBreached ? '#F43F5E' : '#0E382B'} 
                strokeWidth="2" 
                strokeDasharray="4 2" 
              />
            </svg>

            {/* Center: Home Anchor Icon */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0E382B] text-white flex items-center justify-center shadow-md z-10" title="Home Safe Anchor">
              <Home className="w-4 h-4 text-emerald-300" />
            </div>

            {/* Patient Live Position Avatar Marker */}
            <div 
              className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-lg z-20 transition-all duration-500 ${
                isBreached 
                  ? 'bg-rose-600 text-white ring-4 ring-rose-400/50 animate-pulse' 
                  : 'bg-emerald-600 text-white ring-4 ring-emerald-300/50'
              }`}
              style={{
                left: `${(patientX / 200) * 100}%`,
                top: `${(patientY / 200) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
              title={`${targetPatient.name || 'Patient'} (${formatDistance(distanceKm)})`}
            >
              {targetPatient.avatar ? (
                <img src={targetPatient.avatar} alt="P" className="w-full h-full rounded-full object-cover" />
              ) : (
                (targetPatient.name || 'P').charAt(0)
              )}
            </div>

          </div>

          <div className="mt-2 text-center">
            <span className="text-xs font-bold text-stone-500">
              Live Safe Zone Radius: <strong className="text-stone-800">{safeRadiusKm} km (1,000 meters)</strong>
            </span>
          </div>

        </div>

        {/* Right: Metrics, Home Anchor & Emergency Actions (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Distance Indicator Bar */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-stone-600 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-stone-500" />
                <span>Current Distance from Home:</span>
              </span>
              <span className={`text-base font-black ${isBreached ? 'text-rose-700' : 'text-emerald-800'}`}>
                {formatDistance(distanceKm)}
              </span>
            </div>

            {/* Progress Bar (Threshold 1.0 km = 50% marker) */}
            <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden relative">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  isBreached ? 'bg-rose-500' : 'bg-emerald-600'
                }`}
                style={{ width: `${Math.min((distanceKm / 2.0) * 100, 100)}%` }}
              />
              {/* 1.0 km Threshold Marker */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-stone-900 z-10" 
                style={{ left: '50%' }}
                title="1.0 km Geofence Boundary"
              />
            </div>
            
            <div className="flex justify-between text-[10px] text-stone-400 font-bold">
              <span>0 km (Home)</span>
              <span className="text-stone-700 font-black">1.0 km Boundary</span>
              <span>2.0+ km (Breach)</span>
            </div>
          </div>

          {/* Home Safe Location Coordinates Card */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0E382B]" />
                <span>Designated Home Safe Anchor</span>
              </span>

              {isCaregiverView && (
                <button
                  type="button"
                  onClick={() => setIsEditingHome(!isEditingHome)}
                  className="text-xs font-bold text-[#0E382B] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isEditingHome ? 'Cancel' : 'Edit Anchor'}</span>
                </button>
              )}
            </div>

            {isEditingHome ? (
              <div className="space-y-2.5 pt-2">
                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase">Home Address</label>
                  <input
                    type="text"
                    value={homeAddress}
                    onChange={(e) => setHomeAddress(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-stone-50 font-medium"
                    placeholder="e.g. Guwahati, Assam"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={homeLat}
                      onChange={(e) => setHomeLat(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-stone-50 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={homeLng}
                      onChange={(e) => setHomeLng(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-stone-50 font-medium"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSaveHome}
                  className="w-full py-2 bg-[#0E382B] hover:bg-[#144d3b] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Geofence Anchor</span>
                </button>
              </div>
            ) : (
              <div className="text-xs text-stone-600 space-y-1">
                <p className="font-bold text-stone-800">{homeLoc.address || 'Guwahati, Assam'}</p>
                <p className="text-[11px] text-stone-500 font-mono">
                  GPS: {homeLoc.latitude?.toFixed(4)}, {homeLoc.longitude?.toFixed(4)} • Safe Radius: {safeRadiusKm} km
                </p>
              </div>
            )}
          </div>

          {/* Quick Emergency Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`tel:${emergencyPhone.replace(/\s+/g, '')}`}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-300 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-slate-600" />
              <span>Call Family ({emergencyPhone})</span>
            </a>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-300 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-slate-600" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>

        </div>

      </div>

      {/* Simulator Controls Toolbar (For Live Hackathon / Testing Demonstration) */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="text-xs font-black text-amber-900 uppercase tracking-wider">
              Geofence Live Simulator & Test Controls
            </span>
          </div>
          {gpsStatusText && (
            <span className="text-[11px] font-bold text-amber-800 animate-in fade-in">
              {gpsStatusText}
            </span>
          )}
        </div>

        <p className="text-xs text-amber-800 leading-relaxed">
          Test the automated caretaker popup alert and WhatsApp notification by simulating the patient moving beyond the 1.0 km safe boundary:
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleSimulate(0.2)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 transition-all cursor-pointer shadow-2xs"
          >
            🏡 At Home (0.2 km)
          </button>

          <button
            type="button"
            onClick={() => handleSimulate(0.75)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold border border-stone-200 transition-all cursor-pointer shadow-2xs"
          >
            🚶 Safe Stroll (0.75 km)
          </button>

          <button
            type="button"
            onClick={() => handleSimulate(1.45)}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs animate-pulse flex items-center gap-1"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>🚨 Simulate Wander &gt;1 km (1.45 km - Trigger Alert)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRealGpsActive(!isRealGpsActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1 ${
              isRealGpsActive 
                ? 'bg-blue-600 text-white border-blue-700 shadow-xs' 
                : 'bg-white text-blue-800 border-blue-200 hover:bg-blue-50'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{isRealGpsActive ? 'Stop Device GPS' : 'Use Device GPS'}</span>
          </button>

          <button
            type="button"
            onClick={() => playEmergencySirenSound({
              repeatCount: 3,
              withVoice: true,
              patientName: targetPatient.name || 'Elder',
              distanceText: '1.45 kilometers'
            })}
            className="px-3 py-1.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-900 text-xs font-black border border-amber-400 transition-all cursor-pointer shadow-2xs flex items-center gap-1"
            title="Listen to the emergency audio siren & voice alert"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-800" />
            <span>🔊 Test Siren Sound</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-200 transition-all cursor-pointer ml-auto flex items-center gap-1"
            title="Reset position back home"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

    </div>
  );
}
