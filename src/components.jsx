import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CONFIG } from './config.js';

const WeddingContext = createContext(null);
const hindiDigits = value => String(value).replace(/\d/g, digit => '०१२३४५६७८९'[digit]);
const dateParts = iso => iso.split('-').map(Number);
const localDate = iso => {
  const [year, month, day] = dateParts(iso);
  return new Date(year, month - 1, day);
};
const splitHostAddress = address => address.replace(', ', ',<br>');

export function WeddingProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [playing, setPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const audio = useMemo(() => {
    if (!CONFIG.audioPath) return null;
    const player = new Audio(CONFIG.audioPath);
    player.volume = 0.5;
    return player;
  }, []);
  const t = (hi, en) => language === 'hi' ? hi : en;
  const guest = new URLSearchParams(window.location.search).get('to')?.trim().slice(0, 80);
  const greeting = guest && guest.toLowerCase() !== 'guest'
    ? t(`आदरणीय ${guest}, सपरिवार आमंत्रित हैं`, `Dear ${guest}, you and your family are invited`)
    : t('आदरणीय अतिथि, सपरिवार आमंत्रित हैं', 'Dear Guest, you and your family are invited');
  const isOver = Object.values(remaining).every(value => value === 0);
  const values = {
    brideHero: t(CONFIG.bride.short, CONFIG.bride.english),
    groomHero: t(CONFIG.groom.short, CONFIG.groom.english),
    heroDate: t(CONFIG.wedding.dateHindi, CONFIG.wedding.dateEnglish),
    guestGreeting: greeting,
    brideName: t(CONFIG.bride.full, CONFIG.bride.fullEnglish),
    groomName: t(CONFIG.groom.full, CONFIG.groom.fullEnglish),
    brideFamily: t(CONFIG.bride.family, CONFIG.bride.familyEnglish),
    groomFamily: t(CONFIG.groom.family, CONFIG.groom.familyEnglish),
    brideAddress: t(CONFIG.bride.address, CONFIG.bride.addressEnglish),
    groomAddress: t(CONFIG.groom.address, CONFIG.groom.addressEnglish),
    venueName: t(CONFIG.venue.name, CONFIG.venue.nameEnglish),
    venueAddress: t(CONFIG.venue.address, CONFIG.venue.addressEnglish),
    wellWishers: t(CONFIG.family.wellWishers, CONFIG.family.wellWishersEnglish),
    kidsNames: (language === 'hi' ? CONFIG.children : CONFIG.childrenEnglish).join(', '),
    footerHosts: language === 'hi'
      ? `<strong>${CONFIG.hosts[0]}</strong>${CONFIG.hostTitle ? ` (${CONFIG.hostTitle})` : ''}<br><strong>${CONFIG.hosts[1]}</strong><br>${splitHostAddress(CONFIG.hostAddress)}`
      : `<strong>${CONFIG.hostsEnglish[0]}</strong>${CONFIG.hostTitleEnglish ? ` (${CONFIG.hostTitleEnglish})` : ''}<br><strong>${CONFIG.hostsEnglish[1]}</strong><br>${splitHostAddress(CONFIG.hostAddressEnglish)}`,
    soundLabel: playing
      ? t('ध्वनि बंद करें', 'Sound Off')
      : autoplayBlocked
        ? t('ध्वनि चालू करने के लिए टैप करें', 'Tap to play sound')
        : t('ध्वनि चालू करें', 'Sound On'),
    countNote: isOver
      ? t('आज का दिन मंगलमय हो!', 'Wishing you a beautiful wedding day!')
      : t('११ दिसम्बर २०२६ को आपके स्नेहिल आगमन की प्रतीक्षा है।', 'We look forward to welcoming you on 11 December 2026.'),
    ...Object.fromEntries(Object.entries(remaining).map(([key, value]) => [
      key,
      language === 'hi' ? hindiDigits(String(value).padStart(2, '0')) : String(value).padStart(2, '0'),
    ])),
  };

  useEffect(() => {
    const tick = () => {
      const safe = Math.max(0, localDate(CONFIG.wedding.dateISO).getTime() - Date.now());
      setRemaining({
        days: Math.floor(safe / 86400000),
        hours: Math.floor((safe % 86400000) / 3600000),
        minutes: Math.floor((safe % 3600000) / 60000),
        seconds: Math.floor((safe % 60000) / 1000),
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { document.documentElement.lang = language; }, [language]);

  useEffect(() => {
    if (!audio) return;

    let active = true;
    audio.volume = 0.5;
    audio.play().then(() => {
      if (active) {
        setPlaying(true);
        setAutoplayBlocked(false);
      }
    }).catch(error => {
      if (!active) return;
      if (error.name === 'NotAllowedError') {
        setAutoplayBlocked(true);
      } else {
        console.error('Could not start wedding music automatically:', error);
      }
    });

    return () => {
      active = false;
      audio.pause();
    };
  }, [audio]);

  const startSound = async () => {
    if (!audio) return;
    audio.volume = 0.5;
    try {
      await audio.play();
      setPlaying(true);
      setAutoplayBlocked(false);
    } catch (error) {
      setAutoplayBlocked(error.name === 'NotAllowedError');
      if (error.name !== 'NotAllowedError') {
        console.error('Could not play wedding music:', error);
      }
    }
  };

  const toggleSound = async () => {
    if (!audio) return;
    if (audio.paused) {
      await startSound();
      return;
    }
    audio.pause();
    setPlaying(false);
    setAutoplayBlocked(false);
  };

  const mapsUrl = CONFIG.mapsLink !== 'ADD_MAPS_LINK' ? CONFIG.mapsLink : '#';
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(
    `सादर आमंत्रण! ऋषिता  एवं रवि के शुभ विवाह में पधारकर नवयुगल को आशीर्वाद दें। ${CONFIG.wedding.dateHindi}`,
  )}`;

  return (
    <WeddingContext.Provider value={{
      language,
      t,
      values,
      toggleLanguage: () => setLanguage(language === 'hi' ? 'en' : 'hi'),
      toggleSound,
      startSound,
      playing,
      mapsUrl,
      shareUrl,
    }}>
      {children}
    </WeddingContext.Provider>
  );
}

export const useWedding = () => useContext(WeddingContext);

export function RichText({ as: Tag = 'span', className, html }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function InvitationCopy() {
  const { language, t } = useWedding();
  if (language === 'en') {
    return (
      <blockquote className="invite-copy" lang="en">
        <span className="invite-salutation">Dear Friends &amp; Family,</span><br />
        With the blessings of God and our elders, we are delighted to invite you to the wedding of <strong>Rishita and Ravi</strong>. Your presence and blessings will make this special day even more memorable. Please join us in celebrating their new journey and bless the couple.
      </blockquote>
    );
  }

  return (
    <blockquote className="invite-copy" lang="hi">
      <span className="invite-salutation">प्रिय मित्रों एवं परिवारजनों,</span><br />
      {t(
        'परमपिता परमात्मा की असीम अनुकम्पा एवं पूर्वजों के आशीर्वाद से ',
        'Dearest family and friends, by the boundless grace of the Almighty and the blessings of our ancestors, we joyfully invite you to the wedding of ',
      )}
      <strong>{t(`${CONFIG.bride.short} एवं ${CONFIG.groom.short}`, `${CONFIG.bride.english} and ${CONFIG.groom.english}`)}</strong>
      {t(
        ' के शुभ विवाह के अवसर पर, अपनी भावनाओं के असीम स्नेह का सागर समाये आपके पुण्य प्रताप के आशीष वाक्य पाने हेतु लालायित हैं, अतः इस मांगलिक अवसर पर पधारकर कन्या-वर को आशीर्वाद प्रदान कर हमें अनुगृहीत करें।',
        '. Your loving presence and blessings will make this auspicious occasion complete. Please join us and bless the couple.',
      )}
    </blockquote>
  );
}

function CalendarLink({ event }) {
  const { t } = useWedding();
  const [year, month, day] = dateParts(event.dateISO);
  const next = new Date(Date.UTC(year, month - 1, day + 1));
  const nextDay = `${next.getUTCFullYear()}${String(next.getUTCMonth() + 1).padStart(2, '0')}${String(next.getUTCDate()).padStart(2, '0')}`;
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
    `DTSTART;VALUE=DATE:${event.dateISO.replaceAll('-', '')}`,
    `DTEND;VALUE=DATE:${nextDay}`,
    `SUMMARY:${event.english} - ${CONFIG.bride.english} & ${CONFIG.groom.english}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  return (
    <a className="btn btn-outline" href={`data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`} download={`wedding-${event.dateISO}.ics`}>
      <span aria-hidden="true">＋</span>{t('कैलेंडर में जोड़ें', 'Add to Calendar')}
    </a>
  );
}

export function Events() {
  const { language, t, mapsUrl } = useWedding();
  return (
    <div className="event-list">
      {CONFIG.events.map(event => {
        const directionsUrl = event.mapsLink || (event.main ? mapsUrl : '#');
        return (
        <article className={`event${event.main ? ' main-event' : ''}`} key={`${event.dateISO}-${event.english}`}>
          <div className="event-topline">
            <span className="event-icon" aria-hidden="true">{event.icon}</span>
            <span className="event-kicker">{event.main ? t('शुभ विवाह', 'Wedding day') : t('मांगलिक आयोजन', 'Wedding event')}</span>
            {event.main && <span className="main-tag">{t('मुख्य दिवस', 'Main day')}</span>}
          </div>
          <h3>{language === 'hi' ? event.name : event.english}</h3>
          <p className="event-description">
            {event.main
              ? t('दो परिवारों के मिलन और नवयुगल के मंगलमय जीवन का शुभारम्भ।', 'A joyful celebration of two families coming together.')
              : t('परिवार और प्रियजनों के साथ विवाह उत्सव का एक आत्मीय क्षण।', 'A cherished moment in the wedding festivities with family and friends.')}
          </p>
          <div className="event-details">
            <p className="event-meta"><span aria-hidden="true">◷</span>{language === 'hi' ? event.dateHindi : event.dateEnglish}</p>
            {(language === 'hi' ? event.time : event.timeEnglish) && (
              <p className="event-meta"><span aria-hidden="true">◴</span>{language === 'hi' ? event.time : event.timeEnglish}</p>
            )}
            {(language === 'hi' ? event.venue : event.venueEnglish) && (
              <p className="event-meta"><span aria-hidden="true">⌖</span>{language === 'hi' ? event.venue : event.venueEnglish}</p>
            )}
          </div>
          <div className="event-actions">
            <CalendarLink event={event} />
            {directionsUrl !== '#' && <a className="event-directions" href={directionsUrl} target="_blank" rel="noopener noreferrer">{t('दिशा देखें', 'Get directions')} <span aria-hidden="true">→</span></a>}
          </div>
        </article>
        );
      })}
    </div>
  );
}

export function WelcomeFamily() {
  const { language } = useWedding();
  return CONFIG.family.welcome.map(row => (
    <div className="family-card" key={row[0]}>
      <strong>{row[language === 'hi' ? 0 : 2]}</strong>
      <span dangerouslySetInnerHTML={{ __html: row[language === 'hi' ? 1 : 3] }} />
    </div>
  ));
}

export function RegardsFamily() {
  const { language } = useWedding();
  return (language === 'hi' ? CONFIG.family.regards : CONFIG.family.regardsEnglish).map(name => (
    <div className="family-card" key={name}><span>{name}</span></div>
  ));
}

const galleryPhotos = [
  '/assets/7Y9A8958.JPG.jpeg',
  '/assets/7Y9A8652.JPG.jpeg',
  '/assets/7Y9A8072.JPG.jpeg',
  '/assets/7Y9A7418.JPG.jpeg',
  '/assets/7Y9A7490.JPG.jpeg',
];

export function placeholderSvg(index, label, portrait = false) {
  const hue = [8, 24, 344, 38, 354, 18][index % 6];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="hsl(${hue},32%,20%)"/><stop offset="1" stop-color="hsl(${hue},38%,35%)"/></linearGradient></defs>
    <rect width="600" height="600" fill="url(#g)"/><circle cx="300" cy="270" r="98" fill="none" stroke="#d5aa5a" stroke-width="2"/>
    <path d="M300 176c31 42 31 42 0 71-31-29-31-29 0-71Zm0 188c31-42 31-42 0-71-31 29-31 29 0 71Zm-94-94c42-31 42-31 71 0-29 31-29 31-71 0Zm188 0c-42-31-71 0 29 31 71 0Z" fill="none" stroke="#d5aa5a" stroke-width="3"/>
    <text x="300" y="445" text-anchor="middle" fill="#f0d593" font-family="Georgia,serif" font-size="24">${portrait ? label : `Memory ${index + 1}`}</text>
    <text x="300" y="480" text-anchor="middle" fill="#c8b7c3" font-family="Georgia,serif" font-size="16">Replace with your photo</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function Gallery() {
  const { language, t } = useWedding();
  const [layout, setLayout] = useState('grid');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (selectedIndex === null) return undefined;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = event => {
      if (event.key === 'Escape') setSelectedIndex(null);
      if (event.key === 'ArrowRight') {
        setSelectedIndex(index => (index + 1) % galleryPhotos.length);
        setZoom(1);
      }
      if (event.key === 'ArrowLeft') {
        setSelectedIndex(index => (index - 1 + galleryPhotos.length) % galleryPhotos.length);
        setZoom(1);
      }
      if (event.key === '+' || event.key === '=') setZoom(value => Math.min(3, value + 0.25));
      if (event.key === '-') setZoom(value => Math.max(1, value - 0.25));
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex]);

  const changePhoto = offset => {
    setSelectedIndex(index => (index + offset + galleryPhotos.length) % galleryPhotos.length);
    setZoom(1);
  };

  return (
    <>
      <div className="gallery-toolbar" role="group" aria-label={t('गैलरी लेआउट', 'Gallery layout')}>
        <span>{t('यादों की झलक', 'A little collection of memories')}</span>
        <div className="gallery-layout-toggle">
          <button type="button" aria-pressed={layout === 'grid'} onClick={() => setLayout('grid')}>{t('ग्रिड', 'Grid')}</button>
          <button type="button" aria-pressed={layout === 'masonry'} onClick={() => setLayout('masonry')}>{t('मेसनरी', 'Masonry')}</button>
        </div>
      </div>
      <div className={`gallery-grid${layout === 'masonry' ? ' is-masonry' : ''}`} id="galleryGrid">
        {galleryPhotos.map((src, index) => {
          const alt = language === 'hi' ? `युगल की स्मृति ${index + 1}` : `Couple photo ${index + 1}`;
          return (
            <button className="gallery-item" type="button" key={src} aria-label={language === 'hi' ? `फोटो ${index + 1} बड़ा देखें` : `View photo ${index + 1}`}
              onClick={() => { setSelectedIndex(index); setZoom(1); }}>
              <img loading="lazy" src={src} alt={alt} />
              <span className="gallery-item-overlay"><span>{String(index + 1).padStart(2, '0')}</span><span aria-hidden="true">⌕</span></span>
            </button>
          );
        })}
      </div>
      {selectedIndex !== null && (
        <div className="lightbox open" role="dialog" aria-modal="true" aria-label={t('फोटो पूर्वावलोकन', 'Photo viewer')}
          onClick={event => event.target === event.currentTarget && setSelectedIndex(null)}>
          <button className="lightbox-close" type="button" onClick={() => setSelectedIndex(null)} aria-label={t('बंद करें', 'Close')}>×</button>
          <button className="lightbox-nav lightbox-prev" type="button" onClick={() => changePhoto(-1)} aria-label={t('पिछली फोटो', 'Previous photo')}>‹</button>
          <div className="lightbox-content">
            <div className="lightbox-toolbar">
              <span>{String(selectedIndex + 1).padStart(2, '0')} / {String(galleryPhotos.length).padStart(2, '0')}</span>
              <div>
                <button type="button" onClick={() => setZoom(value => Math.max(1, value - 0.25))} disabled={zoom === 1} aria-label={t('ज़ूम कम करें', 'Zoom out')}>−</button>
                <span>{Math.round(zoom * 100)}%</span>
                <button type="button" onClick={() => setZoom(value => Math.min(3, value + 0.25))} disabled={zoom === 3} aria-label={t('ज़ूम बढ़ाएँ', 'Zoom in')}>＋</button>
                <button type="button" onClick={() => setZoom(1)} disabled={zoom === 1}>{t('रीसेट', 'Reset')}</button>
              </div>
            </div>
            <div className="lightbox-stage">
              <img src={galleryPhotos[selectedIndex]} alt={language === 'hi' ? `युगल की स्मृति ${selectedIndex + 1}` : `Couple photo ${selectedIndex + 1}`}
                style={{ width: `min(${92 * zoom}vw, ${760 * zoom}px)`, height: `min(${76 * zoom}vh, ${760 * zoom}px)` }} />
            </div>
          </div>
          <button className="lightbox-nav lightbox-next" type="button" onClick={() => changePhoto(1)} aria-label={t('अगली फोटो', 'Next photo')}>›</button>
        </div>
      )}
    </>
  );
}

export function Petals() {
  return Array.from({ length: 13 }, (_, index) => (
    <i className="petal" key={index} style={{
      left: `${(index * 37 + 13) % 100}%`,
      '--drift': `${(index % 2 ? 1 : -1) * (18 + (index % 4) * 9)}px`,
      animationDuration: `${14 + (index % 5) * 3}s`,
      animationDelay: `${-(index * 1.9)}s`,
    }} />
  ));
}
