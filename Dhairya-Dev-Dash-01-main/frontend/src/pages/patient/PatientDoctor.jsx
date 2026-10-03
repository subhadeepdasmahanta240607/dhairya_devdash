import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import PatientNavShell from '../../components/patient/PatientNavShell';
import { speakLocalized, stopSpeech } from '../../utils/speechUtils';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  Pill, 
  Activity, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  MapPin, 
  Video, 
  Sparkles, 
  Volume2, 
  Plus, 
  X, 
  Check, 
  ChevronRight, 
  User, 
  ShieldCheck, 
  Heart, 
  TrendingUp, 
  Zap, 
  CalendarCheck,
  BrainCircuit,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export default function PatientDoctor() {
  const { t } = useTranslation();
  const { 
    activePatient, 
    activePatientId, 
    currentLanguage, 
    updatePatient, 
    addReminder,
    patients 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('appointments'); // 'appointments' | 'reminders' | 'analysis'
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookSuccessToast, setBookSuccessToast] = useState('');
  const [syncSuccessToast, setSyncSuccessToast] = useState('');

  // Form State for Booking Appointment
  const [appointmentForm, setAppointmentForm] = useState({
    doctorName: 'Dr. Ananya Sharma',
    specialty: 'Neurologist & Cognitive Geriatrician',
    clinicName: 'Gauhati Medical College & Hospital (GMCH)',
    date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], // 3 days from today
    time: '10:30 AM',
    mode: 'in-person', // 'in-person' | 'teleconsult'
    purpose: 'Routine Cognitive Health & Medication Review',
    symptomsNote: 'Mild morning fatigue, routine consistency is high.'
  });

  // Default Appointments Data (Persisted to localStorage per patient)
  const patientKey = activePatient?._id || activePatient?.id || activePatientId || 'pat-1';
  
  const initialAppointments = useMemo(() => {
    const isMeera = (activePatient?.name || '').toLowerCase().includes('meera');
    return [
      {
        id: `apt-1-${patientKey}`,
        doctorName: 'Dr. Ananya Sharma',
        specialty: 'MD, DM Neurology • Cognitive Geriatrician',
        clinicName: isMeera ? 'NEIGRIHMS Shillong • Department of Neurology' : 'GMCH Guwahati • Cognitive Care Clinic',
        address: isMeera ? 'Mawdiangdiang, Shillong, Meghalaya 793018' : 'Bhangagarh, Guwahati, Assam 781032',
        phone: '+91 94350 99887',
        date: 'Oct 15, 2026',
        time: '10:30 AM',
        mode: 'in-person',
        status: 'upcoming',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        purpose: 'Quarterly Cognitive Assessment & MMSE Evaluation',
        doctorNote: 'Please bring daily routine checklist and blood pressure records.'
      },
      {
        id: `apt-2-${patientKey}`,
        doctorName: 'Dr. Bhaskar Jyoti Das',
        specialty: 'Consultant Geriatric Physician',
        clinicName: 'AIIMS Guwahati • Elderly Wellness OPD',
        address: 'Changsari, Kamrup, Assam 781101',
        phone: '+91 98640 44332',
        date: 'Nov 02, 2026',
        time: '02:30 PM',
        mode: 'teleconsult',
        status: 'scheduled',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
        purpose: 'Dietary & Lifestyle Follow-up Video Consultation',
        doctorNote: 'Virtual consultation link will be sent on WhatsApp 15 mins prior.'
      }
    ];
  }, [activePatient?.name, patientKey]);

  const [appointmentsList, setAppointmentsList] = useState(() => {
    try {
      const saved = localStorage.getItem(`dhairya_doctor_appointments_${patientKey}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialAppointments;
  });

  useEffect(() => {
    try {
      localStorage.setItem(`dhairya_doctor_appointments_${patientKey}`, JSON.stringify(appointmentsList));
    } catch (e) {}
  }, [appointmentsList, patientKey]);

  // Prescribed Doctor Reminders / Medications List
  const prescribedMedications = useMemo(() => {
    const isMeera = (activePatient?.name || '').toLowerCase().includes('meera');
    if (isMeera) {
      return [
        {
          id: 'rx-m1',
          name: 'Memantine Hydrochloride 10mg',
          type: 'Cognitive Memory Support',
          timing: '09:00 AM (Morning)',
          dosage: '1 Tablet with water after breakfast',
          prescribedBy: 'Dr. Ananya Sharma',
          importance: 'Essential Daily Protocol',
          color: 'border-rose-300 bg-rose-50/60 text-rose-900',
          badge: 'High Priority',
          foodRelation: 'After breakfast',
          instructions: 'Take consistently every morning with a full glass of water.'
        },
        {
          id: 'rx-m2',
          name: 'Telmisartan 40mg',
          type: 'Blood Pressure Control',
          timing: '08:00 AM (Morning)',
          dosage: '1 Tablet with water',
          prescribedBy: 'Dr. Bhaskar Jyoti Das',
          importance: 'Cardiovascular Support',
          color: 'border-blue-300 bg-blue-50/60 text-blue-900',
          badge: 'Daily',
          foodRelation: 'Before/After meal',
          instructions: 'Check BP weekly; maintain steady schedule.'
        },
        {
          id: 'rx-m3',
          name: 'Neurobion Forte & Vitamin D3',
          type: 'Nerve & Bone Wellness',
          timing: '01:30 PM (Lunch)',
          dosage: '1 Tablet after wholesome lunch',
          prescribedBy: 'Dr. Ananya Sharma',
          importance: 'Nutritional Supplement',
          color: 'border-amber-300 bg-amber-50/60 text-amber-900',
          badge: 'Afternoon',
          foodRelation: 'With meal',
          instructions: 'Supports vitality and nerve health.'
        }
      ];
    }

    return [
      {
        id: 'rx-1',
        name: 'Donepezil Hydrochloride 5mg',
        type: 'Cognitive & Memory Stabilizer',
        timing: '08:45 AM (Morning)',
        dosage: '1 Tablet with water after breakfast',
        prescribedBy: 'Dr. Ananya Sharma (Lead Neurologist)',
        importance: 'Primary Cognitive Prescription',
        color: 'border-rose-300 bg-rose-50/60 text-rose-900',
        badge: 'High Priority',
        foodRelation: 'After breakfast',
        instructions: 'Take immediately after morning meal to maintain steady memory focus.'
      },
      {
        id: 'rx-2',
        name: 'Amlodipine 5mg',
        type: 'Blood Pressure Regulation',
        timing: '08:00 AM (Morning)',
        dosage: '1 Tablet with warm water',
        prescribedBy: 'Dr. Bhaskar Jyoti Das',
        importance: 'Cardiovascular Care',
        color: 'border-blue-300 bg-blue-50/60 text-blue-900',
        badge: 'Daily Protocol',
        foodRelation: 'Morning wake-up',
        instructions: 'Helps prevent vascular strain and supports healthy circulation.'
      },
      {
        id: 'rx-3',
        name: 'Methylcobalamin (B12) & Omega-3 Softgel',
        type: 'Neuro-Protection & Vitality',
        timing: '01:15 PM (Lunch)',
        dosage: '1 Softgel capsule with lunch',
        prescribedBy: 'Dr. Ananya Sharma',
        importance: 'Brain Health Supplement',
        color: 'border-amber-300 bg-amber-50/60 text-amber-900',
        badge: 'Afternoon',
        foodRelation: 'With meal',
        instructions: 'Supports nerve regeneration and alertness.'
      },
      {
        id: 'rx-4',
        name: 'Melatonin 3mg (Gentle Sleep Support)',
        type: 'Rest & Circadian Rhythm',
        timing: '09:00 PM (Bedtime)',
        dosage: '1 Tablet 30 minutes before sleep',
        prescribedBy: 'Dr. Ananya Sharma',
        importance: 'Sleep & Sundowning Management',
        color: 'border-indigo-300 bg-indigo-50/60 text-indigo-900',
        badge: 'Night',
        foodRelation: 'Before sleep',
        instructions: 'Taken with warm water; promotes restorative non-disturbed sleep.'
      }
    ];
  }, [activePatient?.name]);

  // Clinical Telemetry & Doctor Analysis Metrics
  const analysisData = useMemo(() => {
    return {
      cognitiveScore: 88,
      statusLabel: 'Stable & Improving',
      statusColor: 'text-emerald-700 bg-emerald-100 border-emerald-300',
      mmseScore: '26 / 30',
      mmseDescription: 'Normal to Mild Stage — 2 points above initial baseline',
      mocaScore: '24 / 30',
      reactionTime: '2.8s',
      reactionTrend: '0.4s faster than last assessment',
      accuracyRate: '89%',
      accuracyTrend: '+7% in memory game trials',
      lastReviewDate: 'Oct 01, 2026',
      leadDoctor: 'Dr. Ananya Sharma (MD, DM Neurology)',
      doctorSummary: `${activePatient?.name || 'The patient'} is showing positive responsiveness to culturally attuned memory games and daily routine consistency. Donepezil adherence is recorded at 94%. Caregiver notes indicate relaxed demeanor during evening hours when herbal tea and garden walk routines are observed.`,
      clinicalRecommendations: [
        'Maintain daily 10-routine schedule without abrupt time shifts.',
        'Encourage 15-minute garden walk at 4:30 PM to manage evening restlessness.',
        'Continue photo-story recall to reinforce facial recognition of family members.',
        'Next comprehensive clinical follow-up scheduled for mid-October.'
      ],
      weeklyTrend: [
        { day: 'Mon', score: 81, routine: 85 },
        { day: 'Tue', score: 83, routine: 88 },
        { day: 'Wed', score: 85, routine: 90 },
        { day: 'Thu', score: 84, routine: 92 },
        { day: 'Fri', score: 86, routine: 90 },
        { day: 'Sat', score: 87, routine: 94 },
        { day: 'Sun', score: 88, routine: 95 }
      ]
    };
  }, [activePatient?.name]);

  const speakText = (text) => {
    speakLocalized({
      text,
      langCode: currentLanguage?.code || 'en',
      rate: 0.88,
      pitch: 1.0,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false)
    });
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    if (!appointmentForm.doctorName || !appointmentForm.date) return;

    const newApt = {
      id: `apt-${Date.now()}`,
      doctorName: appointmentForm.doctorName,
      specialty: appointmentForm.specialty,
      clinicName: appointmentForm.clinicName,
      address: appointmentForm.clinicName,
      phone: '+91 94350 99887',
      date: new Date(appointmentForm.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: appointmentForm.time,
      mode: appointmentForm.mode,
      status: 'confirmed',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      purpose: appointmentForm.purpose,
      doctorNote: appointmentForm.symptomsNote || 'Routine consultation booked via Patient Portal.'
    };

    setAppointmentsList(prev => [newApt, ...prev]);
    setShowBookModal(false);
    setBookSuccessToast('✅ Doctor appointment booked successfully! Scheduled in your calendar.');
    setTimeout(() => setBookSuccessToast(''), 4500);

    // Announce via Voice
    speakText(`Your appointment with ${newApt.doctorName} for ${newApt.date} at ${newApt.time} has been scheduled.`);
  };

  const handleSyncRemindersToDailyRoutine = (rx) => {
    if (addReminder && activePatientId) {
      addReminder(activePatientId, {
        title: rx.name,
        type: 'medicine',
        detail: `${rx.dosage} — Prescribed by ${rx.prescribedBy}`,
        time: rx.timing.split(' ')[0] + ' ' + (rx.timing.includes('PM') ? 'PM' : 'AM'),
        status: 'pending'
      });
    }
    setSyncSuccessToast(`✅ "${rx.name}" synced to your Daily Routine Checklist!`);
    setTimeout(() => setSyncSuccessToast(''), 4000);
    speakText(`${rx.name} is now added to your daily reminder schedule.`);
  };

  const isHindi = (currentLanguage?.code || '').startsWith('hi');

  return (
    <PatientNavShell pageTitle={isHindi ? "डॉक्टर परामर्श और दिनचर्या" : "Doctor Care & Clinical Portal"}>
      <div className="space-y-6">

        {/* Top Banner Alert / Success Toast */}
        {bookSuccessToast && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-between shadow-md animate-in fade-in">
            <span>{bookSuccessToast}</span>
            <button onClick={() => setBookSuccessToast('')} className="p-1 rounded hover:bg-emerald-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {syncSuccessToast && (
          <div className="p-4 rounded-2xl bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center justify-between shadow-md animate-in fade-in">
            <span>{syncSuccessToast}</span>
            <button onClick={() => setSyncSuccessToast('')} className="p-1 rounded hover:bg-teal-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* 1. HERO CLINICAL DOCTOR CARD                             */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-br from-[#0F382E] via-[#0C2D24] to-[#08201A] rounded-3xl p-6 sm:p-8 text-white border-2 border-emerald-500/30 shadow-xl relative overflow-hidden">
          
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Doctor Profile Info */}
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-md shrink-0 border border-emerald-300/40">
                <img 
                  src="/avatars/dr_ananya.png" 
                  alt="Dr. Ananya Sharma"
                  className="w-full h-full object-cover rounded-[14px]"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80';
                  }}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider">
                    Primary Neurologist
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-200 text-[10px] font-semibold">
                    GMCH Guwahati
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Dr. Ananya Sharma
                </h2>

                <p className="text-xs sm:text-sm text-emerald-200/80 font-medium">
                  MD, DM Neurology • Cognitive Care & Dementia Specialist
                </p>

                <p className="text-[11px] text-slate-300 flex items-center gap-1.5 pt-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Clinic Contact: +91 94350 99887</span>
                </p>
              </div>
            </div>

            {/* Top Quick Actions */}
            <div className="flex items-center gap-2.5 flex-wrap self-start md:self-center">
              <button
                type="button"
                onClick={() => {
                  const speech = `Doctor Portal for ${activePatient?.name || 'patient'}. Your primary doctor is Dr. Ananya Sharma. You have an upcoming appointment scheduled on ${appointmentsList[0]?.date || 'soon'} at ${appointmentsList[0]?.time || ''}. Your cognitive status is stable and improving with a score of 88 out of 100.`;
                  speakText(speech);
                }}
                className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-xs"
                title="Listen to Doctor's Overview"
              >
                <Volume2 className="w-4 h-4 text-emerald-300" />
                <span>{isHindi ? "डॉक्टर रिपोर्ट सुनें" : "Listen to Overview"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowBookModal(true)}
                className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 border border-emerald-300/40"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>{isHindi ? "नया अपॉइंटमेंट लें" : "Book Appointment"}</span>
              </button>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. 3-TAB CLINICAL NAVIGATION SWITCHER                    */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl p-1.5 border border-[#E5E0D8] shadow-2xs flex items-center gap-1.5 overflow-x-auto">
          
          <button
            type="button"
            onClick={() => setActiveSubTab('appointments')}
            className={`flex-1 min-h-[48px] px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'appointments'
                ? 'bg-[#B5502E] text-white shadow-xs border border-[#B5502E]'
                : 'text-[#6B6B6B] hover:text-[#2B2B2B] hover:bg-stone-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{isHindi ? "डॉक्टर अपॉइंटमेंट्स" : "Doctor Appointments"}</span>
            <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
              activeSubTab === 'appointments' ? 'bg-white/20 text-white' : 'bg-stone-100 text-[#6B6B6B]'
            }`}>
              {appointmentsList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('reminders')}
            className={`flex-1 min-h-[48px] px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'reminders'
                ? 'bg-[#B5502E] text-white shadow-xs border border-[#B5502E]'
                : 'text-[#6B6B6B] hover:text-[#2B2B2B] hover:bg-stone-50'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>{isHindi ? "डॉक्टर की दवाएं व सोँवरणी" : "Doctor Reminders & Rx"}</span>
            <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
              activeSubTab === 'reminders' ? 'bg-white/20 text-white' : 'bg-stone-100 text-[#6B6B6B]'
            }`}>
              {prescribedMedications.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('analysis')}
            className={`flex-1 min-h-[48px] px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'analysis'
                ? 'bg-[#B5502E] text-white shadow-xs border border-[#B5502E]'
                : 'text-[#6B6B6B] hover:text-[#2B2B2B] hover:bg-stone-50'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{isHindi ? "डॉक्टर क्लिनिकल विश्लेषण" : "Doctor Analysis & Health"}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>

        </div>

        {/* ======================================================== */}
        {/* TAB 1: DOCTOR APPOINTMENTS                               */}
        {/* ======================================================== */}
        {activeSubTab === 'appointments' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Next Scheduled Visit Spotlight */}
            {appointmentsList.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/40 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                      <CalendarCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                        Next Scheduled Consultation
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-[#2B2B2B]">
                        {appointmentsList[0].purpose}
                      </h3>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 self-start sm:self-center capitalize">
                    ● Confirmed Status
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1">
                    <p className="text-[#6B6B6B] font-bold">Date & Time</p>
                    <p className="text-sm font-black text-[#2B2B2B] flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#B5502E]" />
                      <span>{appointmentsList[0].date} • {appointmentsList[0].time}</span>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1">
                    <p className="text-[#6B6B6B] font-bold">Consulting Doctor</p>
                    <p className="text-sm font-black text-[#2B2B2B] flex items-center gap-1.5">
                      <Stethoscope className="w-4 h-4 text-teal-700" />
                      <span>{appointmentsList[0].doctorName}</span>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1">
                    <p className="text-[#6B6B6B] font-bold">Visit Mode</p>
                    <p className="text-sm font-black text-[#2B2B2B] flex items-center gap-1.5 capitalize">
                      {appointmentsList[0].mode === 'teleconsult' ? (
                        <>
                          <Video className="w-4 h-4 text-blue-600" />
                          <span>Tele-Health Video Call</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 text-rose-600" />
                          <span>In-Person OPD Visit</span>
                        </>
                      )}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1">
                    <p className="text-[#6B6B6B] font-bold">Clinic / Hospital</p>
                    <p className="text-xs font-bold text-[#2B2B2B] line-clamp-2">
                      {appointmentsList[0].clinicName}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 font-medium leading-relaxed">
                  <strong>Doctor's Pre-Visit Note:</strong> {appointmentsList[0].doctorNote}
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-3 flex-wrap pt-1">
                  <a
                    href="tel:+919435099887"
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-[#2B2B2B] border border-[#E5E0D8] font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Call Clinic Reception</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      speakText(`Your next appointment is with ${appointmentsList[0].doctorName} on ${appointmentsList[0].date} at ${appointmentsList[0].time}. Location: ${appointmentsList[0].clinicName}.`);
                    }}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-[#EFF4FA] hover:bg-[#2C5AA0] text-[#2C5AA0] hover:text-white border border-[#2C5AA0]/30 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Read Appointment Out Loud</span>
                  </button>
                </div>
              </div>
            )}

            {/* List of All Scheduled Appointments */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-[#2B2B2B]">
                    {isHindi ? "सभी निर्धारित परामर्श (Schedule)" : "All Scheduled Consultations"}
                  </h3>
                  <p className="text-xs text-[#6B6B6B]">
                    Upcoming clinical appointments and check-ups
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowBookModal(true)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#B5502E] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Book New</span>
                </button>
              </div>

              <div className="space-y-4">
                {appointmentsList.map((apt, index) => (
                  <div
                    key={apt.id || index}
                    className="p-5 rounded-2xl bg-stone-50 hover:bg-[#FAF7F2] border border-[#E5E0D8] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${apt.badgeColor || 'bg-slate-100 text-slate-800'}`}>
                          {apt.mode === 'teleconsult' ? '🎥 Video Teleconsult' : '🏥 Hospital Visit'}
                        </span>
                        <span className="text-xs font-bold text-[#6B6B6B]">
                          📅 {apt.date} • {apt.time}
                        </span>
                      </div>

                      <h4 className="text-base font-black text-[#2B2B2B]">
                        {apt.purpose}
                      </h4>

                      <p className="text-xs font-semibold text-teal-800 flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>{apt.doctorName}</span>
                        <span className="text-stone-400">•</span>
                        <span className="text-[#6B6B6B]">{apt.specialty}</span>
                      </p>

                      <p className="text-xs text-[#6B6B6B] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#B5502E] shrink-0" />
                        <span className="truncate">{apt.clinicName}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          speakText(`Appointment on ${apt.date} at ${apt.time} with ${apt.doctorName} for ${apt.purpose}.`);
                        }}
                        className="p-2.5 rounded-xl bg-white border border-[#E5E0D8] text-[#2B2B2B] hover:text-[#B5502E] hover:border-[#B5502E] transition-colors cursor-pointer"
                        title="Listen to appointment"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: DOCTOR REMINDERS & PRESCRIPTIONS                  */}
        {/* ======================================================== */}
        {activeSubTab === 'reminders' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0">
                    <Pill className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#2B2B2B]">
                      {isHindi ? "डॉक्टर द्वारा निर्धारित दवाएं और सोँवरणी" : "Prescribed Medications & Clinical Protocols"}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B6B6B]">
                      Clinical prescription active for {activePatient?.name || 'patient'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const speech = `You have ${prescribedMedications.length} prescribed daily medications. Morning: ${prescribedMedications[0]?.name}. Please ensure you take them with a full glass of water after food.`;
                    speakText(speech);
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#EFF4FA] hover:bg-[#2C5AA0] text-[#2C5AA0] hover:text-white border border-[#2C5AA0]/30 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-center"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen to Medications</span>
                </button>
              </div>
            </div>

            {/* Medications Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {prescribedMedications.map((rx) => (
                <div
                  key={rx.id}
                  className={`bg-white rounded-3xl p-6 border-2 ${rx.color.split(' ')[0]} shadow-2xs space-y-4 flex flex-col justify-between`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                        {rx.badge}
                      </span>
                      <span className="text-xs font-bold text-[#6B6B6B] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#B5502E]" />
                        <span>{rx.timing}</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-black text-[#2B2B2B]">
                        {rx.name}
                      </h4>
                      <p className="text-xs font-bold text-emerald-800 mt-0.5">
                        {rx.type}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1 text-xs">
                      <p className="text-[#6B6B6B] font-semibold">
                        <strong>Dosage:</strong> {rx.dosage}
                      </p>
                      <p className="text-[#6B6B6B]">
                        <strong>Prescribed by:</strong> {rx.prescribedBy}
                      </p>
                      <p className="text-slate-800 font-medium italic pt-1">
                        "{rx.instructions}"
                      </p>
                    </div>
                  </div>

                  {/* Card Action Controls */}
                  <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => handleSyncRemindersToDailyRoutine(rx)}
                      className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl bg-[#0F382E] hover:bg-[#14493B] text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 shadow-xs"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Sync to Daily Routine</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        speakText(`${rx.name}. Dosage: ${rx.dosage}. Timing: ${rx.timing}. Instructions: ${rx.instructions}`);
                      }}
                      className="min-h-[44px] p-2.5 rounded-xl bg-white border border-[#E5E0D8] text-[#2B2B2B] hover:text-[#B5502E] hover:border-[#B5502E] transition-colors cursor-pointer shrink-0"
                      title="Listen to medicine instructions"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: DOCTOR ANALYSIS & CLINICAL HEALTH SCORE           */}
        {/* ======================================================== */}
        {activeSubTab === 'analysis' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Top Score Spotlight Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-2xs space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-100">
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Clinical Status: {analysisData.statusLabel}
                    </span>
                    <span className="text-xs text-[#6B6B6B] font-semibold">
                      Last Review: {analysisData.lastReviewDate}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-[#2B2B2B]">
                    Cognitive Wellness Score: {analysisData.cognitiveScore} / 100
                  </h3>

                  <p className="text-xs sm:text-sm text-[#6B6B6B] font-medium leading-relaxed max-w-2xl">
                    Evaluation based on daily cognitive games, reaction latency telemetry, and routine adherence tracking.
                  </p>
                </div>

                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex flex-col items-center justify-center p-3 shadow-md shrink-0 border border-emerald-300/40">
                  <span className="text-3xl sm:text-4xl font-black">{analysisData.cognitiveScore}</span>
                  <span className="text-[10px] uppercase font-black tracking-widest text-emerald-100">Score</span>
                </div>

              </div>

              {/* 4 Diagnostic Parameter Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <p className="text-xs font-bold text-[#6B6B6B]">MMSE Clinical Index</p>
                  <p className="text-lg font-black text-[#2B2B2B]">{analysisData.mmseScore}</p>
                  <p className="text-[11px] text-emerald-700 font-semibold">{analysisData.mmseDescription}</p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <p className="text-xs font-bold text-[#6B6B6B]">MoCA Assessment</p>
                  <p className="text-lg font-black text-[#2B2B2B]">{analysisData.mocaScore}</p>
                  <p className="text-[11px] text-emerald-700 font-semibold">Stable Cognitive Tier</p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <p className="text-xs font-bold text-[#6B6B6B]">Average Reaction Time</p>
                  <p className="text-lg font-black text-[#2B2B2B]">{analysisData.reactionTime}</p>
                  <p className="text-[11px] text-emerald-700 font-semibold">{analysisData.reactionTrend}</p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <p className="text-xs font-bold text-[#6B6B6B]">Memory Recall Accuracy</p>
                  <p className="text-lg font-black text-[#2B2B2B]">{analysisData.accuracyRate}</p>
                  <p className="text-[11px] text-emerald-700 font-semibold">{analysisData.accuracyTrend}</p>
                </div>

              </div>

              {/* Weekly Performance Area Chart */}
              <div className="space-y-3 pt-4 border-t border-stone-100">
                <h4 className="text-sm font-black text-[#2B2B2B] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#B5502E]" />
                  <span>7-Day Cognitive & Routine Stability Trend</span>
                </h4>

                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analysisData.weeklyTrend}>
                      <defs>
                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="routineGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#B5502E" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#B5502E" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="score" name="Cognitive Score" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreGradient)" />
                      <Area type="monotone" dataKey="routine" name="Routine Adherence" stroke="#B5502E" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#routineGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Doctor Assessment Notes & Clinician Advice Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-[#2B2B2B]">
                      Doctor's Clinical Assessment & Observations
                    </h4>
                    <p className="text-xs text-[#6B6B6B]">
                      Authored by {analysisData.leadDoctor}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const speech = `Doctor's Clinical Assessment: ${analysisData.doctorSummary}. Recommendations: ${analysisData.clinicalRecommendations.join('. ')}`;
                    speakText(speech);
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#EFF4FA] hover:bg-[#2C5AA0] text-[#2C5AA0] hover:text-white border border-[#2C5AA0]/30 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shrink-0"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen to Doctor Note</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-[#2B2B2B] leading-relaxed italic">
                "{analysisData.doctorSummary}"
              </div>

              {/* Recommendations List */}
              <div className="space-y-2.5">
                <h5 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Prescribed Lifestyle & Care Recommendations:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysisData.clinicalRecommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 font-medium flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* MODAL: BOOK NEW APPOINTMENT FORM                         */}
      {/* ======================================================== */}
      {showBookModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowBookModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-[#E5E0D8] shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-[#B5502E]" />
                <h3 className="text-lg font-black text-[#2B2B2B]">
                  Schedule Doctor Consultation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBookModal(false)}
                className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-[#2B2B2B]">Doctor Name & Specialty</label>
                <input
                  type="text"
                  value={appointmentForm.doctorName}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, doctorName: e.target.value })}
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#B5502E]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#2B2B2B]">Hospital / Clinic Location</label>
                <input
                  type="text"
                  value={appointmentForm.clinicName}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, clinicName: e.target.value })}
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#B5502E]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#2B2B2B]">Preferred Date</label>
                  <input
                    type="date"
                    value={appointmentForm.date}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                    className="w-full p-3 rounded-xl border border-stone-200 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#B5502E]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#2B2B2B]">Preferred Time</label>
                  <select
                    value={appointmentForm.time}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                    className="w-full p-3 rounded-xl border border-stone-200 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#B5502E]"
                  >
                    <option value="10:00 AM">10:00 AM (Morning Slot)</option>
                    <option value="11:30 AM">11:30 AM (Morning Slot)</option>
                    <option value="02:30 PM">02:30 PM (Afternoon Slot)</option>
                    <option value="04:30 PM">04:30 PM (Evening Slot)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#2B2B2B]">Consultation Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAppointmentForm({ ...appointmentForm, mode: 'in-person' })}
                    className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      appointmentForm.mode === 'in-person'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                        : 'bg-stone-50 text-[#6B6B6B] border-stone-200'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-rose-600" />
                    <span>In-Person OPD</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAppointmentForm({ ...appointmentForm, mode: 'teleconsult' })}
                    className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      appointmentForm.mode === 'teleconsult'
                        ? 'bg-blue-50 text-blue-800 border-blue-400'
                        : 'bg-stone-50 text-[#6B6B6B] border-stone-200'
                    }`}
                  >
                    <Video className="w-4 h-4 text-blue-600" />
                    <span>Video Teleconsult</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#2B2B2B]">Purpose of Visit / Reason</label>
                <input
                  type="text"
                  value={appointmentForm.purpose}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, purpose: e.target.value })}
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#B5502E]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#2B2B2B]">Symptoms / Notes for Doctor (Optional)</label>
                <textarea
                  rows={2}
                  value={appointmentForm.symptomsNote}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, symptomsNote: e.target.value })}
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#B5502E]"
                  placeholder="Note any sleep changes, memory lapses, or medicine reactions..."
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="flex-1 min-h-[48px] rounded-xl bg-stone-100 text-[#2B2B2B] font-bold text-xs hover:bg-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[48px] rounded-xl bg-[#B5502E] hover:bg-[#9E4224] text-white font-black text-xs transition-colors shadow-md cursor-pointer"
                >
                  Confirm & Schedule
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </PatientNavShell>
  );
}
