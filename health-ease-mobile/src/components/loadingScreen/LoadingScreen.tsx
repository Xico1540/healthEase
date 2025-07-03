import { ActivityIndicator, View } from "react-native";
import CreateLoadingScreenStyles from "./styles/LoadingScreenStyles";

type LoadingScreenProps = {
    size?: "small" | "large";
    color?: string;
    backgroundColor?: string;
};

function LoadingScreen({ size = "large", color = "#00ff00", backgroundColor = "#ffffff" }: LoadingScreenProps) {
    const loadingScreenStyles = CreateLoadingScreenStyles();
    return (
        <View style={[loadingScreenStyles.container, { backgroundColor }]}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
}

export default LoadingScreen;
