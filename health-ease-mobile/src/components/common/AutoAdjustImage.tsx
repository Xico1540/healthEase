import React, { useEffect, useState } from "react";
import { Image, ImageSourcePropType, ImageStyle, View, ViewStyle } from "react-native";

interface AutoAdjustImageProps {
    source: ImageSourcePropType;
    width: number;
    containerStyle?: ViewStyle;
    imageStyle?: ImageStyle;
}

const AutoAdjustImage: React.FC<AutoAdjustImageProps> = ({ source, width, containerStyle, imageStyle }) => {
    const [calculatedHeight, setCalculatedHeight] = useState(0);

    useEffect(() => {
        const imageDimensions = Image.resolveAssetSource(source);
        setCalculatedHeight(width * (imageDimensions.height / imageDimensions.width));
    }, [source, width]);

    return (
        <View style={[containerStyle, { width, height: calculatedHeight, minHeight: 100 }]}>
            <Image source={source} style={[imageStyle, { width: "100%", height: "100%" }]} />
        </View>
    );
};
export default AutoAdjustImage;
