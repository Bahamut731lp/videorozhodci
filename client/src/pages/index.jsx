import MediaList from "../components/MediaList";
import MediaPreview from "../components/MediaPreview";
import Timeline from "../components/Timeline";
import Layout from "../components/Layout";
import DevicesContextProvider from "../contexts/DevicesContext";
import { RecordingContextProvider } from "../contexts/RecordingContext";
import { LayoutContextProvider } from "../contexts/LayoutContext";
import TimelineContextProvider from "../contexts/TimelineContext";
import { ViewContextProvider } from "../contexts/ViewContext";
import Views from "../components/ViewControls";
import TimelineControls from "../components/TimelineControls";

function Providers({ children }) {
    return (
        <DevicesContextProvider>
            <LayoutContextProvider>
                <RecordingContextProvider>
                    <ViewContextProvider>
                        <TimelineContextProvider>
                            {children}
                        </TimelineContextProvider>
                    </ViewContextProvider>
                </RecordingContextProvider>
            </LayoutContextProvider>
        </DevicesContextProvider>
    )
}

function App() {
    return (
        <Providers>
            <div className="bg-neutral-900 text-white h-screen flex overflow-hidden">
                <section className="w-4/5 max-h-full flex flex-col items-center justify-between gap-2 p-4">
                    <Layout>
                        <Layout.Single />
                        <Layout.TwoByTwo />
                        <Layout.Width/>
                        <Layout.Height/>
                        <Layout.Clear/>
                    </Layout>

                    <MediaPreview />

                    <div className="grid gap-2 w-full">
                        <TimelineControls />
                        <Timeline />
                    </div>
                </section>

                <section className="w-1/5 flex flex-col gap-4 items-center bg-neutral-800 p-4">

                    <Views>
                        <Views.Add />
                        <Views.Reload />
                        <Views.Live />
                        <Views.Playback />
                    </Views>

                    <MediaList />

                </section>
                {/**/}
            </div>
        </Providers>
    );
}

export default App;
