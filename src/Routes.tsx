import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Bridge from './pages/Bridge';
import FAQ from './pages/FAQ';
import TermsAndConditions from './pages/TermsAndConditions';
import ViewContainer from './components/base/ViewContainer';
import SupportedTokensList from './pages/SupportedTokensList';

const AppRouter: React.FC = () => {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <ViewContainer>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <Helmet>
                                    <title>
                                        (EVM {'<'}-{'>'} æternity) Bridge
                                    </title>
                                </Helmet>
                                <Bridge />
                            </>
                        }
                    />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/terms" element={<TermsAndConditions />} />
                    <Route path="/tokens" element={<SupportedTokensList />} />
                </Routes>
            </ViewContainer>
        </BrowserRouter>
    );
};

export default AppRouter;
