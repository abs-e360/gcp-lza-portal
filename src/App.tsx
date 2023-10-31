import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ShopifyProvider } from '@shopify/hydrogen-react';

import Layout from './components/Layout/Layout';
import Terms from './pages/Terms/Terms';
import Home from './pages/Home/Home';
import Onboard from './pages/Onboard/Onboard';

import './App.css';
import Review from './pages/Review';
import Contact from './pages/Contact';

const storefrontAccessToken = 'a27bfad6dc1f16b508756d85644f637e';
const storefrontDomain = 'https://enterprise-360.myshopify.com';

function App() {
  return (
    <ShopifyProvider
      storefrontToken={storefrontAccessToken} storeDomain={storefrontDomain}
      storefrontApiVersion="2023-07"
      countryIsoCode="CA" languageIsoCode="EN"
    >
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="" element={<Layout />}>
              <Route path="/terms" element={<Terms />} />
              <Route path="/onboard" element={<Onboard />} />
              <Route path="/review" element={<Review />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/" element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ShopifyProvider>
  );
}

export default App;
