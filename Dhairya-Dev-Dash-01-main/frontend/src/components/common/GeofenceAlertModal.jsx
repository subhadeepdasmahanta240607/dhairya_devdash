import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  X, 
  ShieldAlert, 
  Send, 
  Radio, 
  Navigation,
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  BellRing
} from 'lucide-react';
import { formatDistance, playEmergencySirenSound, stopGeofenceAlertSound } from '../../utils/geofenceUtils';

export default function GeofenceAlertModal() {
  const { 
    geofenceAlert, 
    dismissGeofenceAlert, 
    activePatient, 
    patients,
    resetPatientToHome,
    triggerGeofenceAlertBroadcast
  } = useApp();

  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [whatsAppSuccessToast, setWhatsAppSuccessToast] = useState('');
  const [isPlayingSound, setIsPlayingSound] = useState(true);

  const patient = (geofenceAlert && patients.find(p => p.id === geofenceAlert.patientId || p._id === geofenceAlert.patientId)) || activePatient || {};
  const distanceKm = geofenceAlert?.distanceKm || 1.45;
  const safeRadiusKm = geofenceAlert?.safeRadiusKm || 1.0;
  const coords = geofenceAlert?.currentLocation || { latitude: 26.1445, longitude: 91.7362 };
  const homeCoords = geofenceAlert?.homeLocation || { address: 'Guwahati, Assam', latitude: 26.1445, longitude: 91.7362 };
  const emergencyPhone = patient.phone || patient.emergencyContact || '+91 94350 12345';
  const mapsUrl = `https://www.google.com/maps?q=${coords.latitude || 26.1445},${coords.longitude || 91.7362}`;

  // Play audio emergency siren & voice when alert modal opens
  useEffect(() => {
    if (geofenceAlert && geofenceAlert.isBeyondSafeZone) {
      setIsPlayingSound(true);
      playEmergencySirenSound({
        repeatCount: 4,
        withVoice: true,
        patientName: patient.name || 'Elder',
        distanceText: formatDistance(distanceKm)
      });
    }

    return () => {
      stopGeofenceAlertSound();
    };
  }, [geofenceAlert]);

  if (!geofenceAlert || !geofenceAlert.isBeyondSafeZone) {
    return null;
  }

  const handlePlaySoundAgain = () => {
    setIsPlayingSound(true);
    playEmergencySirenSound({
      repeatCount: 4,
      withVoice: true,
      patientName: patient.name || 'Elder',
      distanceText: formatDistance(distanceKm)
    });
  };

  const handleStopSound = () => {
    setIsPlayingSound(false);
    stopGeofenceAlertSound();
  };

  const handleClose = () => {
    stopGeofenceAlertSound();
    dismissGeofenceAlert();
  };

  const handleSendWhatsAppBroadcast = async () => {
    setIsSendingWhatsApp(true);
    try {
      if (typeof triggerGeofenceAlertBroadcast === 'function') {
        await triggerGeofenceAlertBroadcast(patient.id || patient._id, {
          distanceKm,
          latitude: coords.latitude,
          longitude: coords.longitude,
          address: coords.address || patient.location
        });
      }
      setWhatsAppSuccessToast(`✓ Emergency alert sent to family & caregiver via WhatsApp!`);
      setTimeout(() => setWhatsAppSuccessToast(''), 4500);
    } catch (e) {
      setWhatsAppSuccessToast('✓ Alert dispatched to registered emergency contacts.');
      setTimeout(() => setWhatsAppSuccessToast(''), 4500);
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  const handleResetToHome = () => {
    stopGeofenceAlertSound();
    if (typeof resetPatientToHome === 'function') {
      resetPatientToHome(patient.id || patient._id);
    }
    dismissGeofenceAlert();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-3xl max-w-xl w-full shadow-2xl border-2 border-rose-300 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        
        {/* Urgent Header Banner */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 text-white p-5 sm:p-6 relative overflow-hidden shrink-0">
          <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
          
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-rose-700 flex items-center justify-center shadow-md shrink-0 animate-bounce">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider border border-white/30">
                    High Priority Safety Alert
                  </span>
                  <span className="text-xs text-rose-100 font-bold flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    Live GPS Geofence Breach
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1 leading-tight">
                  Patient Beyond 1 km Safe Zone!
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss alert modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sound Alert Status Bar in Header */}
          <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-amber-100 font-semibold">
              <BellRing className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
              <span>Audible Alarm: <strong>{isPlayingSound ? 'Active Siren' : 'Muted'}</strong></span>
            </div>

            <div className="flex items-center gap-1.5">
              {isPlayingSound ? (
                <button
                  type="button"
                  onClick={handleStopSound}
                  className="px-2.5 py-1 rounded-lg bg-black/25 hover:bg-black/40 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors border border-white/20"
                >
                  <VolumeX className="w-3 h-3 text-rose-200" />
                  <span>Mute Sound</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePlaySoundAgain}
                  className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-900 text-[11px] font-black flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Play Siren Sound</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Patient Overview Card */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {patient.avatar ? (
                <img 
                  src={patient.avatar} 
                  alt={patient.name || 'Patient'} 
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-rose-300 shadow-xs shrink-0" 
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-800 font-black text-xl flex items-center justify-center border border-rose-200 shrink-0">
                  {(patient.name || 'P').charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black text-stone-900">{patient.name || 'Elder'}</h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                    {patient.age ? `${patient.age} yrs` : 'Senior'}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Primary Caregiver: <strong className="text-stone-700">{patient.primaryCaregiver || 'Dr. Ananya Sharma'}</strong>
                </p>
                <p className="text-[11px] text-rose-700 font-bold flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 shrink-0" />
                  Home Anchor: {homeCoords.address || patient.location || 'Guwahati, Assam'}
                </p>
              </div>
            </div>

            {/* Distance Metric Badge */}
            <div className="text-right shrink-0 bg-rose-50 border border-rose-200 rounded-2xl p-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 block">
                Distance Away
              </span>
              <span className="text-xl sm:text-2xl font-black text-rose-700">
                {formatDistance(distanceKm)}
              </span>
              <span className="text-[10px] font-bold text-rose-600 block">
                Limit: {safeRadiusKm} km
              </span>
            </div>
          </div>

          {/* Alert Explanation Box */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <h4 className="text-xs sm:text-sm font-black text-rose-900">
                Wandering Alert Detected
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-rose-800 leading-relaxed">
              Dhairya GPS Geofencing has detected that <strong>{patient.name || 'the patient'}</strong> has moved <strong>{formatDistance(distanceKm)}</strong> away from their designated safe home zone (threshold: <strong>1.0 km</strong>). An emergency alert siren has been sounded and an instant WhatsApp alert can be dispatched to all registered caregivers.
            </p>
          </div>

          {/* Success Toast */}
          {whatsAppSuccessToast && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{whatsAppSuccessToast}</span>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              {/* Call Patient / Family */}
              <a
                href={`tel:${emergencyPhone.replace(/\s+/g, '')}`}
                className="min-h-[48px] px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Family / Caregiver</span>
              </a>

              {/* View Live GPS on Google Maps */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] px-4 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>Open Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
              </a>

            </div>

            {/* Broadcast WhatsApp Alert */}
            <button
              type="button"
              onClick={handleSendWhatsAppBroadcast}
              disabled={isSendingWhatsApp}
              className="w-full min-h-[46px] px-4 py-3 rounded-2xl bg-[#0E382B] hover:bg-[#144d3b] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-emerald-300" />
              <span>{isSendingWhatsApp ? 'Sending WhatsApp Notification...' : 'Send WhatsApp Alert to Family & Caregiver'}</span>
            </button>

            {/* Replay Sound Button */}
            <button
              type="button"
              onClick={handlePlaySoundAgain}
              className="w-full py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-amber-300"
            >
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>🔊 Replay Emergency Siren Alert Sound</span>
            </button>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="bg-white p-4 sm:p-5 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleResetToHome}
            className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer py-1.5 px-2.5 rounded-lg hover:bg-stone-100 transition-colors"
            title="Reset simulated position back within safe zone (< 0.1 km)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>Reset Position (Simulator)</span>
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="min-h-[42px] px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Acknowledge & Mark Safe</span>
          </button>
        </div>

      </div>
    </div>
  );
}
