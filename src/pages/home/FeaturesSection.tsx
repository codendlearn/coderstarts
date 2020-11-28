import {Grid, isWidthUp, Typography} from "@material-ui/core"
import React from "react"
import {features} from "../../data/features"
import useWidth from "../../hoc/useWidth"
import {calculateSpacing} from "../../shared/calculateSpacing"
import FeatureCard from "./FeatureCard"

const FeatureSection = (props: any) => {
    const width = useWidth()

    return (
        <div style={{backgroundColor: "#FFFFFF"}}>
            <div className="container-fluid lg-p-top">
                <Typography variant="h3" align="center" className="lg-mg-bottom">
                    Features
        </Typography>
                <div className="container-fluid">
                    <Grid container spacing={calculateSpacing(width)}>
                        {features.map(element => (
                            <Grid
                                item
                                xs={6}
                                md={4}
                                data-aos="zoom-in-up"
                                data-aos-delay={
                                    isWidthUp("md", width) ? element.mdDelay : element.smDelay
                                }
                                key={element.headline}
                            >
                                <FeatureCard
                                    Icon={element.icon}
                                    color={element.color}
                                    headline={element.headline}
                                    text={element.text}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </div>
        </div>
    )
}

export default FeatureSection
