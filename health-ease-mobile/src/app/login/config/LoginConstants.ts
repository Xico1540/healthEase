import { Platform } from "react-native";
import { Edges, Metrics } from "react-native-safe-area-context";

export const SAFE_AREA_INITIAL_METRICS: Metrics = {
    frame: { x: 0, y: 0, width: 0, height: 0 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export const KEYBOARD_AVOIDING_BEHAVIOR: "height" | "padding" | "position" | undefined =
    Platform.OS === "ios" ? "padding" : "height";

export const SAFE_AREA_LINEAR_BG_DISTRIBUTION: number[] = [0.5, 0.5];

export const SAFE_AREA_EDGE: Edges = ["top", "bottom"];
