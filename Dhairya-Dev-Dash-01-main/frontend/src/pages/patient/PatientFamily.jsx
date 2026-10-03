import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { familyPhotos, meeraFamilyPhotos } from '../../data/mockData';
import { speakLocalized, stopSpeech } from '../../utils/speechUtils';
import PatientNavShell from '../../components/patient/PatientNavShell';
import { 
  Heart, 
  Volume2, 
  X, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Users, 
  Search, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Sun, 
  Moon, 
  Clock, 
  BrainCircuit, 
  MessageSquareHeart, 
  Smile, 
  HelpCircle, 
  Lightbulb, 
  Info, 
  ThumbsUp, 
  ThumbsDown,
  Activity,
  Flame,
  ArrowRight
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

const HINDI_PHOTO_AUDIO = {
  'fam-1': 'यह आपके पोते अर्जुन हैं, जो गुवाहाटी नदी तट पर बीहू नृत्य के बाद मुस्कुरा रहे हैं।',
  'fam-2': 'यह आपकी बेटी डॉ. अनन्या हैं, जो गौहाटी मेडिकल कॉलेज से गोल्ड मेडल प्राप्त कर रही हैं।',
  'fam-3': 'यह जोरहाट का पैतृक घर है जहाँ आप सुबह की असम चाय और अखबार का आनंद लेते थे।',
  'fam-4': 'यह आपके पूरे परिवार की शिलांग के एलिफेंट फॉल्स की यादगार छुट्टी है।',
  'fam-m1': 'यह आप और आपकी बेटी प्रीति हैं जो शिलांग पीक के खूबसूरत नज़ारे का आनंद ले रही हैं।',
  'fam-m2': 'यह चेरापूंजी के झरनों के पास आपके पूरे परिवार का आनंदमय पिकनिक है।',
  'fam-m3': 'यह मावलिननॉन्ग में आपकी रेशम हथकरघा बुनाई की सुंदर प्रदर्शनी है।'
};

export default function PatientFamily() {
  const { t } = useTranslation();
  const { activePatient, activePatientId, loadPatientPhotos, currentLanguage } = useApp();

  const [activeFamilyTab, setActiveFamilyTab] = useState('progress'); // 'progress' | 'guidelines' | 'photos'
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const isDemo = activePatient?.isDemoSeed === true || 
    ['pat-1', 'pat-2', 'pat-3'].includes(activePatient?.id) || 
    ['pat-1', 'pat-2', 'pat-3'].includes(activePatient?._id) || 
    ['Ramesh Sharma', 'Meera Baruah', 'Biren Das'].includes(activePatient?.name);

  const isMeera = (activePatient?.name || '').toLowerCase().includes('meera');
  const defaultPhotos = isDemo ? (isMeera ? meeraFamilyPhotos : familyPhotos) : [];
  
  const [vaultPhotos, setVaultPhotos] = useState(defaultPhotos);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    setIsLoadingPhotos(true);
    if (activePatient?.id || activePatient?._id) {
      loadPatientPhotos(activePatient.id || activePatient._id).then(dbPhotos => {
        if (isMounted) {
          if (Array.isArray(dbPhotos) && dbPhotos.length > 0) {
            setVaultPhotos(dbPhotos);
          } else if (isDemo) {
            setVaultPhotos(isMeera ? meeraFamilyPhotos : familyPhotos);
          } else {
            setVaultPhotos([]);
          }
          setIsLoadingPhotos(false);
        }
      }).catch(() => {
        if (isMounted) {
          setVaultPhotos(isDemo ? (isMeera ? meeraFamilyPhotos : familyPhotos) : []);
          setIsLoadingPhotos(false);
        }
      });
    } else {
      setVaultPhotos(isDemo ? (isMeera ? meeraFamilyPhotos : familyPhotos) : []);
      setIsLoadingPhotos(false);
    }
    return () => { 
      isMounted = false; 
      stopSpeech();
    };
  }, [activePatient, isDemo, isMeera, loadPatientPhotos]);

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

  const isHindi = (currentLanguage?.code || '').startsWith('hi');

  // Patient Improvement Data & Metrics
  const improvementMetrics = useMemo(() => {
    return {
      statusSummary: `${activePatient?.name || 'The elder'} is showing steady cognitive stability and excellent daily routine consistency.`,
      overallScore: 88,
      streakDays: activePatient?.streakDays || 14,
      indicators: [
        {
          title: 'Memory & Facial Recall',
          score: '88%',
          trend: '+8% this month',
          status: 'Improving',
          color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          desc: 'Recognizing immediate family and landmarks with higher speed.'
        },
        {
          title: 'Daily Routine Adherence',
          score: '92%',
          trend: '9/10 daily slots completed',
          status: 'Very High',
          color: 'text-blue-700 bg-blue-50 border-blue-200',
          desc: 'Consistently completes morning Donepezil, tea, and hydration.'
        },
        {
          title: 'Cognitive Game Agility',
          score: '4.3 / 5.0 ⭐',
          trend: '7 sessions this week',
          status: 'Active',
          color: 'text-purple-700 bg-purple-50 border-purple-200',
          desc: 'Completed Daily Routine Sequencer with zero mistakes.'
        },
        {
          title: 'Emotional Calmness & Mood',
          score: '95% Calm',
          trend: '0 agitation events',
          status: 'Peaceful',
          color: 'text-amber-700 bg-amber-50 border-amber-200',
          desc: 'Relaxed evening behavior with soothing herbal tea & music.'
        }
      ],
      progressChart: [
        { day: 'Mon', memory: 78, routine: 82, mood: 90 },
        { day: 'Tue', memory: 80, routine: 85, mood: 92 },
        { day: 'Wed', memory: 82, routine: 88, mood: 90 },
        { day: 'Thu', memory: 84, routine: 90, mood: 94 },
        { day: 'Fri', memory: 85, routine: 92, mood: 95 },
        { day: 'Sat', memory: 87, routine: 94, mood: 95 },
        { day: 'Sun', memory: 88, routine: 95, mood: 96 }
      ],
      recentMilestones: [
        '✨ Maintained a 14-day consecutive streak of memory workouts and hydration.',
        '📸 Correctly recalled grandson Arjun and daughter Dr. Ananya in Photo Recall.',
        '🍵 Evening herbal tea and garden walk prevented any late-day restlessness.',
        '🩺 Morning blood pressure stable at 124/82 mmHg.'
      ]
    };
  }, [activePatient?.name, activePatient?.streakDays]);

  // Stage-Specific Handling & Care Guidelines
  const careGuidelines = useMemo(() => {
    return {
      dosAndDonts: [
        {
          doText: 'Speak in warm, short sentences with a gentle smile and eye contact.',
          dontText: 'Never say "Don\'t you remember?" or test them aggressively.',
          icon: MessageSquareHeart
        },
        {
          doText: 'Validate their feelings and emotions, even if memory details differ.',
          dontText: 'Do not argue or correct mistaken dates, years, or places.',
          icon: Smile
        },
        {
          doText: 'Maintain a predictable morning-to-night routine with visual clocks.',
          dontText: 'Avoid sudden changes in meal times or unexpected crowded rooms.',
          icon: Clock
        },
        {
          doText: 'Play familiar regional folk music (Bihu flute / Shillong hymns) to calm anxiety.',
          dontText: 'Avoid loud television, sharp noises, or rushed movements.',
          icon: Sparkles
        }
      ],
      sundowningCare: {
        title: 'Managing Evening Restlessness & Sundowning (4:30 PM – 7:00 PM)',
        tips: [
          'Turn on warm, pleasant indoor lighting before sunset so shadows do not cause confusion.',
          'Offer a cup of warm Assam herbal tea or warm milk with a gentle afternoon snack.',
          'Take a 15-minute garden stroll together in the fresh air before sunset.',
          'Open the Family Memories album to look at happy childhood and wedding photos together.'
        ]
      },
      safetyTips: {
        title: 'Home Safety & Wander Prevention Protocol',
        tips: [
          'Keep slippers and shoes in their exact familiar location near the bed.',
          'Ensure hallway and bathroom night-lights are active from 7:00 PM to 7:00 AM.',
          'Keep water in high-contrast colored cups on bedside tables for easy spotting.',
          'Keep emergency contact Dr. Ananya Sharma (+91 94350 99887) saved in family speed-dial.'
        ]
      }
    };
  }, []);

  // Filter categories for photos
  const filterTabs = [
    { id: 'all', label: isHindi ? 'सभी तस्वीरें' : 'All Photos' },
    { id: 'grandson', label: isHindi ? 'पोते-पोतियां' : 'Grandchildren' },
    { id: 'daughter', label: isHindi ? 'बच्चे और परिवार' : 'Children & Family' },
    { id: 'home', label: isHindi ? 'घर और यादगार स्थान' : 'Homes & Places' }
  ];

  const filteredPhotos = useMemo(() => {
    return vaultPhotos.filter(photo => {
      const matchFilter = selectedFilter === 'all' || 
        (photo.relation || '').toLowerCase().includes(selectedFilter.toLowerCase()) ||
        (photo.title || '').toLowerCase().includes(selectedFilter.toLowerCase());
      
      const matchSearch = !searchQuery || 
        (photo.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (photo.relation || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (photo.location || '').toLowerCase().includes(searchQuery.toLowerCase());

      return matchFilter && matchSearch;
    });
  }, [vaultPhotos, selectedFilter, searchQuery]);

  const getPhotoPosition = (photo) => {
    if (photo?.objectPosition) return photo.objectPosition;
    const url = (photo?.photoUrl || photo?.imageUrl || photo?.image || photo?.url || '').toLowerCase();
    const title = (photo?.title || '').toLowerCase();
    if (url.includes('priya') || title.includes('priya') || title.includes('daughter')) return 'center 15%';
    if (url.includes('arjun') || title.includes('arjun') || title.includes('grandson')) return 'center top';
    if (url.includes('bihu') || title.includes('bihu') || url.includes('ramesh')) return 'center 20%';
    return 'center center';
  };

  return (
    <PatientNavShell pageTitle={isHindi ? "परिवार पोर्टल और देखभाल मार्गदर्शिका" : "Family Portal & Patient Progress"}>
      <div className="space-y-6">
        
        {/* ======================================================== */}
        {/* 1. TOP HERO FAMILY HEADER                                */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-br from-[#8C3A18] via-[#B5502E] to-[#6A280D] rounded-3xl p-6 sm:p-8 text-white border-2 border-amber-300/30 shadow-xl relative overflow-hidden">
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white/20 border border-white/30 text-white flex items-center justify-center shrink-0 shadow-md">
                <Users className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-300/20 text-amber-200 border border-amber-300/30 text-[10px] font-black uppercase tracking-wider">
                    Family Care & Support Hub
                  </span>
                  <span className="text-xs text-amber-100/80 font-bold">
                    🔥 {activePatient?.streakDays || 14}-Day Streak
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {activePatient?.name || 'Patient'}'s Family Circle
                </h2>

                <p className="text-xs sm:text-sm text-amber-100/90 font-medium max-w-xl">
                  {isHindi 
                    ? "देखें कि आपके प्रियजन में क्या सुधार हो रहा है और उनकी देखभाल कैसे करें।"
                    : "Track your loved one's cognitive progress and follow compassionate handling guidelines."
                  }
                </p>
              </div>
            </div>

            {/* Listen Button */}
            <div className="flex items-center gap-2.5 self-start md:self-center">
              <button
                type="button"
                onClick={() => {
                  const speech = `Family summary for ${activePatient?.name || 'patient'}. ${improvementMetrics.statusSummary} Routine adherence is at 92 percent with a memory recall score of 88 percent. For handling, speak in warm, calm sentences and avoid saying 'don't you remember'.`;
                  speakText(speech);
                }}
                className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <Volume2 className="w-4 h-4 text-amber-300" />
                <span>{isHindi ? "पारिवारिक रिपोर्ट सुनें" : "Listen to Family Report"}</span>
              </button>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. 3-TAB FAMILY SWITCHER                                 */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl p-1.5 border border-[#E5E0D8] shadow-2xs flex items-center gap-1.5 overflow-x-auto">
          
          <button
            type="button"
            onClick={() => setActiveFamilyTab('progress')}
            className={`flex-1 min-h-[48px] px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeFamilyTab === 'progress'
                ? 'bg-[#B5502E] text-white shadow-xs border border-[#B5502E]'
                : 'text-[#6B6B6B] hover:text-[#2B2B2B] hover:bg-stone-50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{isHindi ? "रोगी में सुधार (Progress Tracker)" : "Is He Improving? (Progress)"}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            type="button"
            onClick={() => setActiveFamilyTab('guidelines')}
            className={`flex-1 min-h-[48px] px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeFamilyTab === 'guidelines'
                ? 'bg-[#B5502E] text-white shadow-xs border border-[#B5502E]'
                : 'text-[#6B6B6B] hover:text-[#2B2B2B] hover:bg-stone-50'
            }`}
          >
            <MessageSquareHeart className="w-4 h-4" />
            <span>{isHindi ? "देखभाल के नियम (How to Handle)" : "How to Handle & Care Guide"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFamilyTab('photos')}
            className={`flex-1 min-h-[48px] px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeFamilyTab === 'photos'
                ? 'bg-[#B5502E] text-white shadow-xs border border-[#B5502E]'
                : 'text-[#6B6B6B] hover:text-[#2B2B2B] hover:bg-stone-50'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>{isHindi ? "पारिवारिक यादें व तस्वीरें" : "Family Photos & Memories"}</span>
            <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
              activeFamilyTab === 'photos' ? 'bg-white/20 text-white' : 'bg-stone-100 text-[#6B6B6B]'
            }`}>
              {vaultPhotos.length}
            </span>
          </button>

        </div>

        {/* ======================================================== */}
        {/* TAB 1: IS HE IMPROVING? (PATIENT PROGRESS TRACKER)       */}
        {/* ======================================================== */}
        {activeFamilyTab === 'progress' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Status Summary Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/40 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                      🌟 Status: Steady Improvement & Stable
                    </span>
                    <span className="text-xs font-bold text-[#6B6B6B]">
                      Verified by Dr. Ananya Sharma
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-[#2B2B2B]">
                    {improvementMetrics.statusSummary}
                  </h3>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center">
                    {improvementMetrics.overallScore}
                  </div>
                  <div className="text-xs">
                    <p className="font-black text-emerald-950">Wellness Index</p>
                    <p className="text-emerald-700 font-bold">+6% this month</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Family Metric Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {improvementMetrics.indicators.map((ind, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-5 border border-[#E5E0D8] shadow-2xs space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${ind.color}`}>
                      {ind.status}
                    </span>
                    <h4 className="text-sm font-black text-[#2B2B2B] mt-2">
                      {ind.title}
                    </h4>
                    <p className="text-2xl font-black text-[#B5502E] mt-1">
                      {ind.score}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-stone-100">
                    <p className="text-[11px] text-emerald-700 font-bold">{ind.trend}</p>
                    <p className="text-xs text-[#6B6B6B] mt-0.5 leading-tight">{ind.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Progress Graph for Family */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-black text-[#2B2B2B] flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#B5502E]" />
                    <span>Weekly Progress Breakdown for Family</span>
                  </h4>
                  <p className="text-xs text-[#6B6B6B]">
                    Tracking memory recall, routine completion, and daily emotional calmness
                  </p>
                </div>
              </div>

              <div className="h-56 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={improvementMetrics.progressChart}>
                    <defs>
                      <linearGradient id="memoryGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="routineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="memory" name="Memory Recall %" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#memoryGrad)" />
                    <Area type="monotone" dataKey="routine" name="Routine Completed %" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#routineGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Positive Milestones */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-2xs space-y-4">
              <h4 className="text-lg font-black text-[#2B2B2B] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Recent Positive Milestones Observed</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {improvementMetrics.recentMilestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs font-semibold text-emerald-950 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: HOW HE/SHE NEEDS TO BE HANDLED (CARE GUIDE)       */}
        {/* ======================================================== */}
        {activeFamilyTab === 'guidelines' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                    <MessageSquareHeart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#2B2B2B]">
                      {isHindi ? "परिवार के लिए रोगी देखभाल और व्यवहार मार्गदर्शिका" : "How He/She Needs to Be Handled — Family Care Guide"}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B6B6B]">
                      Compassionate communication and behavioral support guidelines curated by clinicians
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const speech = `Family Handling Guide: Always speak in calm, warm, short sentences. Validate their emotions instead of arguing about memory lapses. Before sunset, turn on warm lighting and serve herbal tea to prevent evening restlessness. In case of emergency, contact Dr. Ananya Sharma.`;
                    speakText(speech);
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#EFF4FA] hover:bg-[#2C5AA0] text-[#2C5AA0] hover:text-white border border-[#2C5AA0]/30 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-center shrink-0"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen to Guidelines</span>
                </button>
              </div>
            </div>

            {/* 1. Communication Do's and Don'ts */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-2xs space-y-5">
              <h4 className="text-lg font-black text-[#2B2B2B] flex items-center gap-2">
                <Smile className="w-5 h-5 text-emerald-600" />
                <span>Golden Rules of Communication (Do's & Don'ts)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {careGuidelines.dosAndDonts.map((rule, idx) => (
                  <div key={idx} className="p-5 rounded-3xl bg-stone-50 border border-[#E5E0D8] space-y-3">
                    
                    {/* DO */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-2.5 text-xs text-emerald-950 font-medium">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-[10px] font-black">
                        ✓
                      </div>
                      <div>
                        <strong className="text-emerald-900 block font-black">DO:</strong>
                        <span>{rule.doText}</span>
                      </div>
                    </div>

                    {/* DONT */}
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-start gap-2.5 text-xs text-rose-950 font-medium">
                      <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 text-[10px] font-black">
                        ✕
                      </div>
                      <div>
                        <strong className="text-rose-900 block font-black">DON'T:</strong>
                        <span>{rule.dontText}</span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* 2. Sundowning & Evening Restlessness Management */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-2xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-[#2B2B2B]">
                    {careGuidelines.sundowningCare.title}
                  </h4>
                  <p className="text-xs text-[#6B6B6B]">
                    Proven strategies to maintain tranquility during late afternoon transitions
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {careGuidelines.sundowningCare.tips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/70 text-xs text-indigo-950 font-medium flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-900 font-bold text-[11px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Safety & Emergency Contact Action */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-2xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-[#2B2B2B]">
                    {careGuidelines.safetyTips.title}
                  </h4>
                  <p className="text-xs text-[#6B6B6B]">
                    Wander prevention and quick clinical assistance
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {careGuidelines.safetyTips.tips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/70 text-xs text-teal-950 font-medium flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-900 to-emerald-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                <div>
                  <p className="text-xs font-bold text-teal-200">Emergency Clinician Speed Dial</p>
                  <p className="text-sm font-black text-white">Dr. Ananya Sharma • Lead Neurologist</p>
                </div>
                <a
                  href="tel:+919435099887"
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md self-start sm:self-center cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Doctor (+91 94350 99887)</span>
                </a>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: FAMILY PHOTOS & MEMORIES ALBUM                    */}
        {/* ======================================================== */}
        {activeFamilyTab === 'photos' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Header Filter Bar */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#FDF6F0] border border-[#B5502E]/20 text-[#B5502E] flex items-center justify-center shrink-0">
                    <Heart className="w-7 h-7 fill-[#B5502E]/20" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#2B2B2B]">
                      {isHindi ? "पारिवारिक यादें और तस्वीरें" : "Family Memories & Photos"}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B6B6B] font-medium">
                      {isHindi ? "पारिवारिक यादें सुनने के लिए किसी भी तस्वीर को स्पर्श करें" : "Tap any photo to listen to family stories and cherished memories"}
                    </p>
                  </div>
                </div>

                {filteredPhotos.length > 0 && (
                  <button
                    type="button"
                    onClick={() => speakText("This is your family memory album. Tap any picture below to listen to its story and recall happy moments together.")}
                    className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-[#EFF4FA] hover:bg-[#2C5AA0] text-[#2C5AA0] hover:text-white border border-[#2C5AA0]/30 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer self-start sm:self-center shrink-0 active:scale-95"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isHindi ? "सारांश सुनें" : "Listen to Summary"}</span>
                  </button>
                )}
              </div>

              {/* Filter Pills */}
              {filteredPhotos.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
                  {filterTabs.map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedFilter(tab.id)}
                      className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer shrink-0 ${
                        selectedFilter === tab.id
                          ? 'bg-[#B5502E] text-white border-[#B5502E] shadow-xs'
                          : 'bg-[#FAF7F2] text-[#2B2B2B] hover:bg-stone-100 border-[#E5E0D8]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Photos Grid */}
            {isLoadingPhotos ? (
              <div className="bg-white rounded-3xl p-12 border border-[#E5E0D8] text-center text-xs font-bold text-slate-500 shadow-2xs">
                Loading family memories...
              </div>
            ) : filteredPhotos.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E5E0D8] text-center space-y-4 shadow-2xs">
                <div className="w-16 h-16 rounded-3xl bg-[#FDF6F0] text-[#B5502E] border border-[#B5502E]/20 flex items-center justify-center mx-auto shadow-xs">
                  <Users className="w-8 h-8 text-[#B5502E]" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-xl sm:text-2xl font-black text-[#2B2B2B]">
                    {isHindi ? "कोई पारिवारिक तस्वीर नहीं मिली" : "No Family Photos Uploaded Yet"}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B6B6B] font-medium leading-relaxed">
                    {isHindi 
                      ? "आपकी देखभाल करने वाले पोर्टल में आपके परिवार और प्रियजनों की तस्वीरें जोड़ सकते हैं।"
                      : "Your caregiver can add cherished family photos and loved ones' memories in the Caregiver Portal to display them here."
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredPhotos.map((photo) => (
                  <div
                    key={photo._id || photo.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5E0D8] shadow-2xs hover:shadow-md hover:border-[#B5502E]/40 transition-all flex flex-col justify-between gap-4 group"
                  >
                    <div 
                      onClick={() => setSelectedPhoto(photo)}
                      className="cursor-pointer space-y-3"
                    >
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border border-[#E5E0D8]">
                        <img
                          src={photo.photoUrl || photo.imageUrl || photo.image || photo.url || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&auto=format&fit=crop&q=80'}
                          alt={photo.title}
                          style={{ objectPosition: getPhotoPosition(photo) }}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&auto=format&fit=crop&q=80';
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {photo.relation && (
                          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#B5502E] border border-[#B5502E]/20 text-xs font-black px-3 py-1 rounded-full shadow-xs">
                            {photo.relation}
                          </span>
                        )}
                        {photo.year && (
                          <span className="absolute bottom-3 right-3 bg-black/75 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                            {photo.year}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-[#2B2B2B] group-hover:text-[#B5502E] transition-colors">
                          {photo.title}
                        </h3>
                        <p className="text-xs font-semibold text-[#6B6B6B] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#B5502E]" />
                          <span>{photo.location || 'Assam, India'}</span>
                        </p>
                        <p className="text-xs text-[#6B6B6B] line-clamp-2 mt-1">
                          {photo.description || photo.audioPrompt || photo.audioNote}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const isHindi = (currentLanguage?.code || '').startsWith('hi');
                        const msg = isHindi && HINDI_PHOTO_AUDIO[photo.id] ? HINDI_PHOTO_AUDIO[photo.id] : `${photo.title}. ${photo.audioPrompt || photo.audioNote || photo.description}`;
                        speakText(msg);
                      }}
                      className="w-full min-h-[52px] px-5 py-3 rounded-2xl bg-[#EFF4FA] hover:bg-[#2C5AA0] text-[#2C5AA0] hover:text-white border border-[#2C5AA0]/30 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 shadow-2xs"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{isHindi ? "कहानी सुनें" : "Listen to Story"}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

      {/* Full-Screen Photo Details Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden border border-[#E5E0D8] shadow-2xl relative animate-in fade-in">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedPhoto.photoUrl || selectedPhoto.imageUrl || selectedPhoto.image || selectedPhoto.url || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&auto=format&fit=crop&q=80'}
              alt={selectedPhoto.title}
              style={{ objectPosition: getPhotoPosition(selectedPhoto) }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&auto=format&fit=crop&q=80';
              }}
              className="w-full aspect-[4/3] object-cover"
            />

            <div className="p-6 sm:p-8 space-y-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B] bg-stone-100 px-2.5 py-0.5 rounded-md border border-[#E5E0D8]">
                    {selectedPhoto.year} • {selectedPhoto.location}
                  </span>
                  {selectedPhoto.relation && (
                    <span className="text-xs font-bold text-[#B5502E] bg-[#FDF6F0] px-2.5 py-0.5 rounded-md border border-[#B5502E]/20">
                      {selectedPhoto.relation}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black text-[#2B2B2B] mt-2">
                  {selectedPhoto.title}
                </h3>
                <p className="text-[#6B6B6B] text-sm mt-1 leading-relaxed">
                  {selectedPhoto.description || selectedPhoto.audioNote || selectedPhoto.audioPrompt}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const isHindi = (currentLanguage?.code || '').startsWith('hi');
                  const msg = isHindi && HINDI_PHOTO_AUDIO[selectedPhoto.id] ? HINDI_PHOTO_AUDIO[selectedPhoto.id] : `${selectedPhoto.title}. ${selectedPhoto.audioNote || selectedPhoto.audioPrompt || selectedPhoto.description}`;
                  speakText(msg);
                }}
                className="w-full min-h-[56px] rounded-2xl bg-[#2C5AA0] hover:bg-[#224780] text-white font-black text-base flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer active:scale-98"
              >
                <Volume2 className="w-5 h-5" />
                <span>{isHindi ? "यादें सुनें" : "Listen to Memory"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </PatientNavShell>
  );
}
