import { useEffect } from "react";
import { useWedding, RichText, InvitationCopy, Events, WelcomeFamily, RegardsFamily, Gallery, Petals } from "./components.jsx";
import { CONFIG } from "./config.js";

export default function InvitationMarkup() {
 const { t, values, toggleLanguage, toggleSound, startSound, playing, mapsUrl, shareUrl } = useWedding();

 useEffect(() => {
  const sections = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
   sections.forEach(section => section.classList.add("visible"));
   return;
  }

  const observer = new IntersectionObserver(entries => {
   entries.forEach(entry => {
    if (entry.isIntersecting) {
     entry.target.classList.add("visible");
     observer.unobserve(entry.target);
    }
   });
  }, { threshold: 0.12 });
  sections.forEach(section => observer.observe(section));

  return () => observer.disconnect();
 }, []);

 useEffect(() => {
  const topbar = document.querySelector(".topbar");
  if (!topbar) return;

  let previousY = window.scrollY;
  const updateTopbar = () => {
   const currentY = window.scrollY;
   if (Math.abs(currentY - previousY) < 6) return;
   topbar.classList.toggle("is-hidden", currentY > 100 && currentY > previousY);
   if (currentY <= 100) topbar.classList.remove("is-hidden");
   previousY = currentY;
  };

  window.addEventListener("scroll", updateTopbar, { passive: true });
  return () => window.removeEventListener("scroll", updateTopbar);
 }, []);

 return <>
<a className="skip-link" href="#main">{t("मुख्य सामग्री पर जाएँ", "Skip to main content")}</a>
<div className="topbar"><button className="language-toggle" id="languageToggle" type="button" aria-label="Switch language" onClick={toggleLanguage}>{"EN / हिंदी"}</button>
</div>
<header className="hero" id="home"><div className="hero-jali left" aria-hidden="true"></div>
<div className="hero-jali right" aria-hidden="true"></div>
<div className="petals" aria-hidden="true" id="petals">
<Petals />
</div>
<div className="hero-content"><svg className="ganesh-mark" viewBox="0 0 100 100" role="img" aria-label="श्री गणेश"><circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="1.5"></circle>
<path d="M50 17c-9 0-15 7-15 15 0 5 2 9 6 12-8-2-15 3-15 11 0 7 6 12 13 12 3 0 6-1 8-3v14h7V64c3 2 6 3 9 3 8 0 14-5 14-12 0-8-7-13-15-11 4-3 6-7 6-12 0-8-7-15-18-15Zm0 7c7 0 11 4 11 9 0 6-5 9-11 9s-11-3-11-9c0-5 4-9 11-9Zm-21 34c0-4 3-7 8-7 3 0 6 1 8 4v8c-2 3-5 4-8 4-5 0-8-4-8-9Zm42 0c0 5-4 9-9 9-3 0-6-1-8-4v-8c2-3 5-4 8-4 5 0 9 3 9 7Z" fill="currentColor"></path>
<path d="M54 57c5 0 8 3 8 7 0 4-4 7-8 7-3 0-5-1-7-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"></path>
<circle cx="50" cy="12" r="2" fill="var(--gold)"></circle>
</svg>
<p className="invocation">{t("श्री गणेशाय नमः", "The Wedding Celebration")}</p>
<p className="hero-kicker">{t("मंगलमय परिणयोत्सव", "A celebration of love")}</p>
<div className="mandala-wrap"><svg className="mandala" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1"><circle cx="100" cy="100" r="85"></circle>
<circle cx="100" cy="100" r="68"></circle>
<circle cx="100" cy="100" r="48"></circle>
<path d="M100 8c18 32 18 32 0 46-18-14-18-14 0-46Zm0 184c18-32 18-32 0-46-18 14-18 14 0 46ZM8 100c32-18 32-18 46 0-14 18-14 18-46 0Zm184 0c-32-18-32-18-46 0 14 18 14 18 46 0Z"></path>
<path d="M35 35c37 7 43 13 36 36-23 7-29 1-36-36Zm130 130c-37-7-43-13-36-36 23-7 29-1 36 36Zm0-130c-7 37-13 43-36 36-7-23-1-29 36-36ZM35 165c7-37 13-43 36-36 7 23 1 29-36 36Z"></path>
<path d="M100 24 176 100 100 176 24 100Z"></path>
</g>
<circle cx="100" cy="100" r="5" fill="currentColor"></circle>
</svg>
<h1 id="heroTitle"><span id="brideHero">{values.brideHero}</span>
<i className="hero-amp">{"&"}</i>
<span id="groomHero">{values.groomHero}</span>
</h1>
</div>
<p className="hero-date" id="heroDate">{values.heroDate}</p>
<p className="hero-guest" id="guestGreeting">{values.guestGreeting}</p>
<div className="ornate-divider" aria-hidden="true"><span>{"❋"}</span>
</div>
<div className="hero-actions"><a className="btn" href="#blessings" onClick={startSound}><span>{t("आमंत्रण खोलें", "Open invitation")}</span>
<span aria-hidden="true">{"❧"}</span>
</a>
</div>
<div className="scroll-cue" aria-hidden="true">{"⌄"}</div>
</div>
</header>
<button className="btn sound-btn" id="soundToggle" type="button" onClick={toggleSound} disabled={!CONFIG.audioPath} aria-pressed={playing}><span className="sound-icon" aria-hidden="true">{"♪"}</span>
<span id="soundLabel">{values.soundLabel}</span>
</button>
<main id="main"><section className="section blessing" id="blessings"><div className="section-inner reveal"><p className="eyebrow">{t("शुभारम्भ", "Auspicious beginning")}</p>
<h2 className="section-heading">{t("मंगल वचन", "Blessings")}</h2>
<div className="ornate-divider" aria-hidden="true"><span>{"❋"}</span>
</div>
<div className="blessings-grid">
<blockquote className="verse" lang="hi"><span className="verse-mark" aria-hidden="true">ॐ</span>
<span className="verse-text">वक्रतुण्ड महाकाय, सूर्यकोटि समप्रभः। निर्विघ्नं कुरु मे देव, सर्व कार्येषु सर्वदा॥</span>
<span className="verse-text">विघ्न हरण मंगल करण गौरी पुत्र गणेश। प्रथम निमंत्रण आपको ब्रह्मा विष्णु महेश॥</span>
</blockquote>
</div>
</div>
</section>
<section className="section" id="invitation"><div className="section-inner reveal"><p className="eyebrow">{t("स्नेहिल निमंत्रण", "A heartfelt invitation")}</p>
<InvitationCopy /></div>
</section>
<section className="section" id="couple"><div className="section-inner reveal"><p className="eyebrow">{t("दो परिवार, एक मंगल बंधन", "Two families, one joyful union")}</p>
<h2 className="section-heading">{t("वधू एवं वर", "The Couple")}</h2>
<div className="ornate-divider" aria-hidden="true"><span>{"❋"}</span>
</div>
<div className="people-grid"><article className="person-card"><p className="person-role">{t("वधू", "Bride")}</p>
<h3 id="brideName">{values.brideName}</h3>
<RichText as="p" className="relation" html={values.brideFamily} /><p className="address" id="brideAddress">{values.brideAddress}</p>
</article>
<div className="couple-photo-frame"><img className="couple-photo" loading="lazy" decoding="async" src="/assets/7Y9A8599.JPG" alt={t("वधू और वर का साथ में फोटो", "Bride and groom together")} /></div>
<article className="person-card"><p className="person-role">{t("वर", "Groom")}</p>
<h3 id="groomName">{values.groomName}</h3>
<RichText as="p" className="relation" html={values.groomFamily} /><p className="address" id="groomAddress">{values.groomAddress}</p>
</article>
</div>
</div>
</section>
<section className="section events-section" id="events"><div className="section-inner reveal"><p className="eyebrow">{t("शुभ मांगलिक आयोजन", "Wedding events")}</p>
<h2 className="section-heading">{t("उत्सव का कार्यक्रम", "Celebration Schedule")}</h2>
<p className="events-intro">{t("हर रस्म, हर पल — परिवार और मित्रों के साथ प्रेमपूर्वक सजाया गया।", "Every ritual, every moment — thoughtfully planned for family and friends.")}</p>
<div className="schedule-divider" aria-hidden="true"><span>❋</span><i>✿</i><span>❋</span></div>
<Events />
</div>
</section>
<section className="section" id="countdown"><div className="section-inner reveal"><p className="eyebrow">{t("उलटी गिनती", "The countdown")}</p>
<h2 className="section-heading">{t("शुभ घड़ी आने में", "Countdown to the Big Day")}</h2>
<div className="ornate-divider" aria-hidden="true"><span>{"❋"}</span>
</div>
<div className="countdown" role="timer" aria-live="off"><div className="count-box"><strong id="days">{values.days}</strong>
<span>{t("दिन", "Days")}</span>
</div>
<div className="count-box"><strong id="hours">{values.hours}</strong>
<span>{t("घण्टे", "Hours")}</span>
</div>
<div className="count-box"><strong id="minutes">{values.minutes}</strong>
<span>{t("मिनट", "Minutes")}</span>
</div>
<div className="count-box"><strong id="seconds">{values.seconds}</strong>
<span>{t("सेकण्ड", "Seconds")}</span>
</div>
</div>
<p className="count-note" id="countNote">{values.countNote}</p>
</div>
</section>
<section className="section" id="venue"><div className="section-inner reveal"><p className="eyebrow">{t("आपकी प्रतीक्षा में", "We await your arrival")}</p>
<h2 className="section-heading">{t("विवाह स्थल", "The venue")}</h2>
<div className="ornate-divider" aria-hidden="true"><span>{"❋"}</span>
</div>
<div className="venue-card"><p className="venue-name" id="venueName">{values.venueName}</p>
<p className="venue-address" id="venueAddress">{values.venueAddress}</p>
<a className="btn" id="mapsLink" target="_blank" rel="noopener noreferrer" href={mapsUrl}><span aria-hidden="true">{"⌖"}</span>
<span>{t("गूगल मैप्स में देखें", "Open in Google Maps")}</span>
</a>
<div className="map-placeholder" role="img" aria-label="विवाह स्थल का मानचित्र स्थान"><div className="map-pin" aria-hidden="true"><span>{"✿"}</span>
</div>
<span className="map-label">{t("मंगलम् गेस्ट हाउस, कटरा, बाँदा", "Mangalam Guest House, Katra, Banda")}</span>
</div>
</div>
</div>
</section>
<section className="section" id="greetings"><div className="section-inner reveal"><p className="eyebrow">{t("सप्रेम", "With love")}</p>
<h2 className="section-heading">{t("परिवार की ओर से", "From our family")}</h2>
<div className="ornate-divider" aria-hidden="true"><span>{"❋"}</span>
</div>
<div className="family-block"><h3 className="family-label">{t("स्वागतोत्सुक", "Warmly welcoming you")}</h3>
<div className="family-grid" id="welcomeFamily"><WelcomeFamily /></div>
<h3 className="family-label">{t("विनीत", "With regards")}</h3>
<div className="family-grid" id="regardsFamily"><RegardsFamily /></div>
<h3 className="family-label">{t("दर्शनाभिलाषी", "With best wishes")}</h3>
<div className="family-card" id="wellWishers" style={{textAlign: "center"}}>{values.wellWishers}</div>
</div>
</div>
</section>
<section className="section" id="kids"><div className="section-inner reveal"><p className="eyebrow">{t("नन्हे आमंत्रण", "A little invitation")}</p>
<h2 className="section-heading">{t("बाल आकांक्षा", "A note from the little ones")}</h2>
<div className="ornate-divider" aria-hidden="true"><span>{"❋"}</span>
</div>
<div className="kids-card">
<div className="kids-icon" aria-hidden="true">{"✿　♡　✿"}</div>
<blockquote><RichText html={t("नन्हे-नन्हे पाँव हमारे कैसे आयें बुलाने को,<br>बुआ/मौसी की शादी में भूल न जाना आने को।", "Our tiny feet are too small to come and call on you,<br>please don't forget to join us for our aunt's wedding too!")} /></blockquote>
<p className="kids-names" id="kidsNames">{values.kidsNames}</p>
</div>
</div>
</section>
<section className="section" id="request"><div className="section-inner reveal"><p className="request-note">{t("कृपया महिलायें इस कुमकुम पत्रिका को व्यक्तिगत आमंत्रण समझें।", "We warmly request all ladies to accept this kumkum invitation as a personal invitation.")}</p>
</div>
</section>
<section className="section" id="gallery"><div className="section-inner reveal"><p className="eyebrow">{t("यादों की झलक", "A glimpse of memories")}</p>
<h2 className="section-heading">{t("फोटो गैलरी", "Photo gallery")}</h2>
<div className="ornate-divider" aria-hidden="true"><span>{"❋"}</span>
</div>
<Gallery />
</div>
</section>
</main>
<footer className="footer"><div className="section-inner"><p className="eyebrow">{t("सादर प्रेषक", "With regards")}</p>
<h2 className="section-heading">{t("आपके अपने", "Your hosts")}</h2>
<div className="ornate-divider" aria-hidden="true"><span>{"❋"}</span>
</div>
<RichText as="p" className="footer-address" html={values.footerHosts} /><p><a id="phoneOne" href={"tel:" + CONFIG.phones[0]}>{CONFIG.phones[0]}</a>
{"·"}<a id="phoneTwo" href={"tel:" + CONFIG.phones[1]}>{CONFIG.phones[1]}</a>
</p>
<a className="btn btn-outline" id="shareLink" target="_blank" rel="noopener noreferrer" href={shareUrl}><span aria-hidden="true">{"↗"}</span>
<span>{t("WhatsApp पर निमंत्रण साझा करें", "Share on WhatsApp")}</span>
</a>
<p className="footer-credit">{t("आपकी उपस्थिति ही हमारा सबसे बड़ा उपहार है।", "Your presence is the greatest gift of all.")}</p>
</div>
</footer>

</>;
}
