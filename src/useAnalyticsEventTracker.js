import ReactGA from "react-ga4";

const useAnalyticsEventTracker = (category = "test category") => {
    const eventTracker = (action = "test action", label = "test label", value = undefined) => {
        ReactGA.event({ category, action, label, value });
    }
    return eventTracker;
}
export default useAnalyticsEventTracker;