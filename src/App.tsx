import React, { useState, useRef, useEffect } from 'react';
import { Radio, ArrowLeft, Wand2, Play, Pause, CreditCard } from 'lucide-react';

interface Station {
  id: string;
  name: string;
  logo: string;
}

interface Audition {
  id: string;
  name: string;
  voice: string;
  music: string;
  progress: number;
  audioUrl: string;
}

interface Schedule {
  name: string;
  price: number;
  days: number;
  dateRange: string;
  impressions: number;
  rotation: string;
  rotationDetails: string;
  addons?: string[];
}

type Step = 'create' | 'preview' | 'schedule' | 'confirm';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('create');
  const [selectedStations, setSelectedStations] = useState<string[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<string>('market');
  const [playingAuditionId, setPlayingAuditionId] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  
  const [voiceoverText, setVoiceoverText] = useState(
    'Grab your boots, bring your cowboy hat, and get ready for a wild night under the stars at Southern Sunset Country Fest 2025 at Big Cypress Pavilion in Tampa!\n\nFor one unforgettable day, experience live performances from top country artists, ice-cold drinks, and a sunset rodeo show!\n\nOne night only, Saturday, April 19! Tickets are selling fast, so don\'t wait!\n\nGet yours now at SouthernSunsetFest.com and let\'s make some country memories!'
  );

  const stations: Station[] = [
    { id: 'usfm', name: 'US FM 103.5', logo: 'https://images.unsplash.com/photo-1700791208949-169400d6eec8?w=64&h=64&fit=crop' },
    { id: 'shark', name: '98.7 The Shark', logo: 'https://images.unsplash.com/photo-1700791208949-169400d6eec8?w=64&h=64&fit=crop' },
    { id: 'mix', name: 'MIX 100.7', logo: 'https://images.unsplash.com/photo-1700791208949-169400d6eec8?w=64&h=64&fit=crop' },
    { id: 'magic', name: 'Magic 94.9', logo: 'https://images.unsplash.com/photo-1700791208949-169400d6eec8?w=64&h=64&fit=crop' },
    { id: 'wdae', name: '95.3 WDAE', logo: 'https://images.unsplash.com/photo-1700791208949-169400d6eec8?w=64&h=64&fit=crop' },
  ];

  const auditions: Audition[] = [
    { 
      id: '1', 
      name: "John's Audition", 
      voice: 'John', 
      music: 'There For You', 
      progress: 75,
      audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav'
    },
    { 
      id: '2', 
      name: "Liam's Audition", 
      voice: 'Liam', 
      music: 'Summer Backroad', 
      progress: 60,
      audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/ImperialMarch60.wav'
    },
    { 
      id: '3', 
      name: "Serena's Audition", 
      voice: 'Serena', 
      music: 'The Warm Chills', 
      progress: 85,
      audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav'
    },
  ];

  const schedules: Schedule[] = [
    {
      name: 'Essential Reach',
      price: 199,
      days: 3,
      dateRange: '4/10/2025 – 4/12/2025',
      impressions: 20000,
      rotation: 'Standard Rotation',
      rotationDetails: '3x per day',
    },
    {
      name: 'Market Impact',
      price: 499,
      days: 6,
      dateRange: '4/10/2025 – 4/15/2025',
      impressions: 50000,
      rotation: 'High-Frequency Rotation',
      rotationDetails: '5x per day, including peak drive times',
      addons: ['Streaming Audio Ads', 'Social Media Boost'],
    },
    {
      name: 'Maximum Exposure',
      price: 699,
      days: 10,
      dateRange: '4/10/2025 – 4/19/2025',
      impressions: 80000,
      rotation: 'Premium Saturation',
      rotationDetails: '8x per day, every hour at peak times',
      addons: ['Streaming Audio Ads', 'Social Media Boost', 'Host-Read Promo', 'Traffic & Weather Sponsorship'],
    },
  ];

  // Initialize audio elements when component mounts
  useEffect(() => {
    auditions.forEach(audition => {
      const audio = new Audio(audition.audioUrl);
      audio.addEventListener('ended', () => {
        setPlayingAuditionId(null);
      });
      audioRefs.current[audition.id] = audio;
    });

    // Cleanup function to remove audio elements
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.removeEventListener('ended', () => {
          setPlayingAuditionId(null);
        });
      });
      audioRefs.current = {};
    };
  }, []); // Empty dependency array means this runs once on mount

  const handlePlayPause = async (auditionId: string) => {
    const audio = audioRefs.current[auditionId];
    
    if (playingAuditionId === auditionId) {
      // If this audition is currently playing, pause it
      audio.pause();
      audio.currentTime = 0;
      setPlayingAuditionId(null);
      return;
    }

    try {
      // First pause all currently playing audio
      await Promise.all(
        Object.entries(audioRefs.current).map(([id, audioElement]) => {
          if (id !== auditionId && !audioElement.paused) {
            audioElement.pause();
            audioElement.currentTime = 0;
            return new Promise(resolve => setTimeout(resolve, 50));
          }
          return Promise.resolve();
        })
      );

      // Then play the selected audio
      audio.currentTime = 0;
      await audio.play();
      setPlayingAuditionId(auditionId);
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingAuditionId(null);
    }
  };

  const renderHeader = () => (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button className="text-gray-500 hover:text-gray-700 flex items-center">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <Radio className="h-5 w-5 mr-2" />
              Radio Ad
            </button>
          </div>
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-4">
              {['Create', 'Preview', 'Schedule', 'Confirm'].map((step, index) => (
                <div key={step} className="flex flex-col items-center">
                  <span className={`mb-2 text-sm ${
                    index === ['create', 'preview', 'schedule', 'confirm'].indexOf(currentStep)
                      ? 'text-gray-900 font-medium'
                      : 'text-gray-500'
                  }`}>{step}</span>
                  <div className="flex items-center">
                    <div className={`h-2.5 w-2.5 rounded-full ${
                      index === ['create', 'preview', 'schedule', 'confirm'].indexOf(currentStep) 
                        ? 'bg-blue-600' 
                        : 'bg-gray-300'
                    }`} />
                    {index < 3 && <div className="w-16 h-0.5 mx-2 bg-gray-300" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                const steps: Step[] = ['create', 'preview', 'schedule', 'confirm'];
                const currentIndex = steps.indexOf(currentStep);
                if (currentIndex > 0) {
                  setCurrentStep(steps[currentIndex - 1]);
                }
              }}
              className="text-gray-500 px-4 py-2 rounded-md hover:bg-gray-100"
            >
              Back
            </button>
            <button 
              onClick={() => {
                const steps: Step[] = ['create', 'preview', 'schedule', 'confirm'];
                const currentIndex = steps.indexOf(currentStep);
                if (currentIndex < steps.length - 1) {
                  setCurrentStep(steps[currentIndex + 1]);
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  const renderCreateStep = () => (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-start space-x-4">
              <img
                src="https://images.unsplash.com/photo-1700791208949-169400d6eec8?w=128&h=128&fit=crop"
                alt="Event"
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold">Southern Sunset Country Fest 2025</h2>
                <p className="text-gray-600">Apr 19, 2025 at 6:00 PM</p>
                <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Change event
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Create Voiceover Script</h3>
              <button className="text-blue-600 hover:text-blue-700 flex items-center">
                <Wand2 className="h-4 w-4 mr-2" />
                Regenerate
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">30-second on-air promo</p>
            <textarea
              value={voiceoverText}
              onChange={(e) => setVoiceoverText(e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex justify-end mt-2">
              <span className="text-sm text-gray-500">437/450</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Tampa Radio Advertising</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {stations.map((station) => (
                <button
                  key={station.id}
                  onClick={() => setSelectedStations(prev => 
                    prev.includes(station.id) 
                      ? prev.filter(id => id !== station.id)
                      : [...prev, station.id]
                  )}
                  className={`p-4 rounded-lg border ${
                    selectedStations.includes(station.id)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={station.logo}
                    alt={station.name}
                    className="w-full h-12 object-contain mb-2"
                  />
                  <p className="text-sm text-center text-gray-900">{station.name}</p>
                </button>
              ))}
              <button className="p-4 rounded-lg border border-gray-200 hover:border-gray-300">
                <div className="w-full h-12 flex items-center justify-center mb-2">
                  <span className="text-gray-400">View all</span>
                </div>
              </button>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available Stations</span>
                <span className="text-gray-900">20</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Broadcast Schedule</span>
                <span className="text-gray-900">3-10 days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Impressions (estimated)</span>
                <span className="text-gray-900">20,000-80,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price Range</span>
                <span className="text-gray-900">$199-699</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );

  const renderPreviewStep = () => (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold mb-8">Preview Auditions</h2>
      <div className="space-y-6">
        {auditions.map((audition) => (
          <div key={audition.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <button 
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={() => handlePlayPause(audition.id)}
                >
                  {playingAuditionId === audition.id ? (
                    <Pause className="h-6 w-6 text-gray-700" />
                  ) : (
                    <Play className="h-6 w-6 text-gray-700" />
                  )}
                </button>
                <div>
                  <h3 className="text-lg font-medium">{audition.name}</h3>
                  <div className="flex space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-600">Voice: {audition.voice}</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <CreditCard className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-600">Music: {audition.music}</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <CreditCard className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 flex items-center">
                <Wand2 className="h-4 w-4 mr-2" />
                Regenerate
              </button>
            </div>
            <div className="mt-4 bg-blue-100 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${audition.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );

  const renderScheduleStep = () => (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center space-x-2 mb-8">
        <h2 className="text-2xl font-bold">Choose a Broadcast Schedule</h2>
        <span className="text-gray-600">Tampa, Florida</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {schedules.map((schedule) => (
          <button
            key={schedule.name}
            onClick={() => setSelectedSchedule(schedule.name.toLowerCase().replace(' ', '-'))}
            className={`text-left p-6 rounded-lg border ${
              selectedSchedule === schedule.name.toLowerCase().replace(' ', '-')
                ? 'border-blue-600 bg-white'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-start">
              <input
                type="radio"
                checked={selectedSchedule === schedule.name.toLowerCase().replace(' ', '-')}
                onChange={() => setSelectedSchedule(schedule.name.toLowerCase().replace(' ', '-'))}
                className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="ml-4">
                <h3 className="text-lg font-medium">{schedule.name}</h3>
                <p className="text-2xl font-bold mt-1">${schedule.price}</p>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="font-medium">{schedule.days}-Day Ad Schedule</p>
                    <p className="text-sm text-gray-600">{schedule.dateRange}</p>
                  </div>
                  <div>
                    <p className="font-medium">{schedule.impressions.toLocaleString()} Impressions</p>
                    <p className="text-sm text-gray-600">Estimated On-air Plays</p>
                  </div>
                  <div>
                    <p className="font-medium">{schedule.rotation}</p>
                    <p className="text-sm text-gray-600">{schedule.rotationDetails}</p>
                  </div>
                  {schedule.addons && (
                    <div>
                      <p className="font-medium">Add-ons</p>
                      <ul className="mt-2 space-y-1">
                        {schedule.addons.map((addon) => (
                          <li key={addon} className="text-sm text-gray-600">{addon}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </main>
  );

  const renderConfirmStep = () => (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-6">Confirm Purchase</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Tampa On-Air Promotion</h3>
              <div className="flex items-center space-x-3">
                <Play className="h-6 w-6 text-gray-700" />
                <span className="text-gray-600">Southern Sunset Country Fest 2025</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Market Impact Schedule</h3>
              <div className="space-y-2 text-gray-600">
                <p>6-Day Promo Schedule</p>
                <p>50,000 Est. Impressions</p>
                <p>High-Frequency Rotation</p>
                <p>Streaming Audio Ads</p>
                <p>Social Media Boost</p>
              </div>
            </div>
            <div className="pt-6 border-t">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Promo code"
                  className="flex-1 px-4 py-2 border border-r-0 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-4 py-2 text-blue-600 border border-l-0 rounded-r-md hover:bg-gray-50">
                  Apply
                </button>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>$499.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>$32.43</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>$531.43</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-6">Enter Payment</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <button className="flex items-center justify-center p-4 border rounded-md bg-white text-blue-600 border-blue-600">
                <CreditCard className="h-6 w-6 mr-2" />
                <span>Card</span>
              </button>
              <button className="flex items-center justify-center p-4 border rounded-md hover:bg-gray-50">
                <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" alt="Google Pay" className="h-6 w-6 mr-2" />
                <span>Google Pay</span>
              </button>
              <button className="flex items-center justify-center p-4 border rounded-md hover:bg-gray-50">
                <img src="https://www.apple.com/ac/globalnav/7/en_US/images/be15095f-5a20-57d0-ad14-cf4c638e223a/globalnav_apple_image__b5er5ngrzxqq_large.svg" alt="Apple Pay" className="h-6 w-6 mr-2" />
                <span>Apple Pay</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="4321 4321 4321 4321"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-1">
                    <img src="https://www.mastercard.com/content/dam/public/mastercardcom/na/us/en/homepage/Home/mc-logo-52.svg" alt="Mastercard" className="h-6" />
                    <img src="https://www.visa.com/images/visa-logo.png" alt="Visa" className="h-6" />
                    <img src="https://www.americanexpress.com/content/dam/amex/us/merchant/supplies-uplift/logos/AMEX_Icon_Blue_Box.png" alt="Amex" className="h-6" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration
                  </label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>United States</option>
                </select>
              </div>

              <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Pay now
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      {currentStep === 'create' && renderCreateStep()}
      {currentStep === 'preview' && renderPreviewStep()}
      {currentStep === 'schedule' && renderScheduleStep()}
      {currentStep === 'confirm' && renderConfirmStep()}
    </div>
  );
}

export default App;