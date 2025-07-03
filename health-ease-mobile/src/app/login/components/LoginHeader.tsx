import React from "react";
import { Animated, Text, View } from "react-native";
import Logo from "@/src/assets/images/logo-white.svg";
import { CreateLoginStyles } from "@/src/app/login/styles/LoginStyles";

const LoginHeader: React.FC = () => {
    const styles = CreateLoginStyles();
    const titleParts: string[] = ["Your helth", "at your", "ease"];

    return (
        <Animated.View testID="loginHeaderAnimatedView" style={[styles.header]}>
            <Logo testID="appLogo" style={styles.logo} />
            <Animated.View testID="loginHeaderElementsAnimatedView">
                <View testID="loginHeaderElementsGeneralView" style={styles.headerTextContainer}>
                    <View testID="loginHeaderElementsView" style={styles.titleContainer}>
                        <Text style={styles.title}>{titleParts[0]}</Text>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={[styles.title, { fontFamily: "PoppinsBold" }]}>{titleParts[1]}</Text>
                            <Text style={styles.title}> {titleParts[2]}</Text>
                        </View>
                    </View>
                </View>
                <Text testID="headerSubtitle" style={styles.subtitleSmall}>
                    Welcome to the future of healthcare
                </Text>
            </Animated.View>
        </Animated.View>
    );
};

export default LoginHeader;
