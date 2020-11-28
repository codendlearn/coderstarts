import AOS from "aos"
import "aos/dist/aos.css"
import React, {useEffect, useState} from 'react'
import {Route, Switch} from 'react-router-dom'
import CookieConsent from '../components/CookieConsent'
import CookieRulesDialog from '../components/CookieRulesDialog'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Blog from './Blog'
import FeatureSection from './home/FeaturesSection'
import HeadSection from './home/HeadSection'
import PricingSection from "./home/PricingSection"

AOS.init({once: true})

const Home = () => {
    const [isCookieRulesDialogOpen, setisCookieRulesDialogOpen] = useState<boolean>(false)
    const handleCookieRulesDialogClose = () => {
        setisCookieRulesDialogOpen(false)
    }

    useEffect(() => {

    }, [])

    return (
        <div>
            {!isCookieRulesDialogOpen && (
                <CookieConsent
                    handleCookieRulesDialogOpen={() => setisCookieRulesDialogOpen(true)}
                />
            )}
            {/* <DialogSelector
                openLoginDialog={openLoginDialog}
                dialogOpen={dialogOpen}
                onClose={closeDialog}
                openTermsDialog={openTermsDialog}
                openRegisterDialog={openRegisterDialog}
                openChangePasswordDialog={openChangePasswordDialog}
            />
             */}
            <CookieRulesDialog
                open={isCookieRulesDialogOpen}
                onClose={handleCookieRulesDialogClose}
            />

            <Header
            // selectedTab={selectedTab}
            // selectTab={setSelectedTab}
            // openLoginDialog={openLoginDialog}
            // openRegisterDialog={openRegisterDialog}
            // mobileDrawerOpen={isMobileDrawerOpen}
            // handleMobileDrawerOpen={handleMobileDrawerOpen}
            // handleMobileDrawerClose={handleMobileDrawerClose}
            />
            <div>Test</div>
            <HeadSection />
            <FeatureSection />
            <PricingSection />

            <Switch>
                <Route path="/blog">
                    <Blog />
                </Route>
            </Switch>
            <Footer />
        </div>
    )
}

export default Home
