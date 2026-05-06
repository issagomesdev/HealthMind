import { Redirect } from "expo-router";

// Backward-compat redirect to the tabs group
export default function HomeRedirect() {
  return <Redirect href="/(protected)/(tabs)/home" />;
}
