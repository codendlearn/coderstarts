import {Box, createStyles, makeStyles, Theme} from "@material-ui/core"
import AOS from "aos"
import "aos/dist/aos.css"
import classNames from "classnames"
import React, {useEffect, useState} from 'react'
import {Route, Switch} from 'react-router-dom'
import CookieConsent from '../components/CookieConsent'
import CookieRulesDialog from '../components/CookieRulesDialog'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Blog from './Blog'
import GroupCall from "./consultation/GroupCall"
import FeatureSection from './home/FeaturesSection'
import HeadSection from './home/HeadSection'
import PricingSection from "./home/PricingSection"

AOS.init({once: true})

const styles = makeStyles((theme: Theme) => createStyles({
    container: {
        minHeight: "70vh"
    }
}))
const Home = () => {
    const classes = styles()
    const [isCookieRulesDialogOpen, setisCookieRulesDialogOpen] = useState<boolean>(false)
    const handleCookieRulesDialogClose = () => {
        setisCookieRulesDialogOpen(false)
    }

    useEffect(() => {

    }, [])

    return (
        <Box display="flex" flexDirection="column">
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
            />

            <div className={classNames("lg-p-top1", classes.container)}>
                <Switch>
                    <Route exact path="/">
                        <>
                            <HeadSection />
                            <FeatureSection />
                            <PricingSection />
                        </>
                    </Route>
                    <Route exact path="/blog">
                        <Blog />
                    </Route>
                    <Route path="/consultation/:groupId?">
                        {/* <ConsultationStateProvider> */}
                        <GroupCall />
                        {/* <VideoConsultation /> */}
                        {/* </ConsultationStateProvider> */}
                    </Route>
                    <Route exact path="/asdf">
                        <div>test</div>
                    </Route>
                </Switch>
            </div>
            <Footer />
        </Box>
    )
}

export default Home
