import React from 'react';
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu';
import './AboutPage.css';

function AboutPage() {
  return (
    <div className='container'>
      <HamburgerMenu />
      <div className='donation-section'>
        <h2>Donation Resources</h2>
        <p>Help Us Help Others:</p>
        <a
          href='https://www.catholiccharitiesnd.org/donate'
          target='_blank'
          rel='noopener noreferrer'
        >
          https://www.catholiccharitiesnd.org/donate
        </a>
      </div>
      <div className='about-content'>
        <div className='section'>
          <h2>Contact</h2>
          <p>
            5201 Bishops Blvd S<br />
            Suite B<br />
            Fargo , ND 58104
            <br />
            (701) 235-4457
          </p>
        </div>
        <div className='section'>
          <h2>Business Hours</h2>
          <p>Mon - Thu: 8:00 am - 5:00 pm</p>
          <p>Friday: 8:00 am - 12:00 pm</p>
          <p>Sat - Sun: Closed</p>
        </div>
        <div className='section'>
          <h2>About</h2>
          <p>
            Catholic Charities North Dakota provides adoption, counseling, and guardianship
            services, and disaster response in North Dakota.
          </p>
        </div>
        <div className='section'>
          <h2>Year Established</h2>
          <p>1923</p>
        </div>
        <div className='section'>
          <h2>Services</h2>
          <ul>
            <li>Adults Adopting Kids</li>
            <li>Pregnancy, Parenting, and Adoption Services</li>
            <li>Waiting Families</li>
            <li>Counseling Services</li>
            <li>Guardianship Services</li>
          </ul>
        </div>
        <div className='section'>
          <h2>Specialties</h2>
          <ul>
            <li>Adopting Special Kids</li>
            <li>Waiting Families</li>
            <li>Post Adoption Search and Disclosure</li>
            <li>Disaster Response</li>
          </ul>
        </div>
        <div className='section'>
          <h2>Holiday Hours</h2>
          <ul>
            <li>Thursday, August 15, 2024: Closed</li>
            <li>Monday, September 2, 2024: Closed</li>
            <li>Friday, November 1, 2024: Closed</li>
            <li>Thursday, November 28, 2024: Closed</li>
            <li>Friday, November 29, 2024: Closed</li>
            <li>Sunday, December 8, 2024: Closed</li>
            <li>Wednesday, December 25, 2024: Closed</li>
            <li>Wednesday, January 1, 2025: Closed</li>
            <li>Monday, January 20, 2025: Closed</li>
            <li>Monday, May 26, 2025: Closed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
