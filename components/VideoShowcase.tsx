
import React, { useState } from 'react';

const videos = [
    {
        title: "ARISE TV Spotlights PIGL's 20th Anniversary Milestone",
        id: "ibZfp4KoPsU",
    },
    {
        title: "PIGL 20th Anniversary Highlights",
        id: "0bHwPHythBw",
    },
    {
        title: "The Inspiring Journey of PIGL",
        id: "sExrHCIGkH0",
    }
];

const VideoShowcase: React.FC = () => {
    const [activeVideo, setActiveVideo] = useState<{ id: string, title: string } | null>(null);

    return (
        <section className="py-20 md:py-32 bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px] md:text-xs">20 Years of Excellence</span>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">Celebrating Our <span className="text-emerald-600 italic">Legacy</span></h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-lg font-light">Witness the journey, the people, and the milestones that have defined Polaris Integrated and Geosolutions Limited over two decades.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {videos.map((video, idx) => (
                        <div key={idx} className="space-y-6 group cursor-pointer" onClick={() => setActiveVideo(video)}>
                            <div className="relative aspect-video overflow-hidden shadow-2xl border-4 border-slate-50 group-hover:border-emerald-500 transition-all duration-500">
                                {/* Thumbnail */}
                                <img
                                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                                    alt={video.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {/* Play Button Overlay */}
                                <div className="absolute inset-0 bg-emerald-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                                {/* Native Branding Corner */}
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-emerald-600 text-white text-[8px] font-black uppercase tracking-widest px-2 py-1">20th ANNIVERSARY</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-tight group-hover:text-emerald-600 transition-colors">
                                    {video.title}
                                </h3>
                                <div className="w-12 h-1 bg-orange-500 group-hover:w-full transition-all duration-500"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Video Modal */}
            {activeVideo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500"
                        onClick={() => setActiveVideo(null)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative w-full max-w-5xl aspect-video bg-black shadow-2xl border-4 border-white/10 overflow-hidden animate-in fade-in zoom-in duration-300">
                        {/* Native Close Button */}
                        <button
                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-orange-600 text-white flex items-center justify-center hover:bg-white hover:text-orange-600 transition-colors shadow-xl"
                            onClick={() => setActiveVideo(null)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Video branding top bar */}
                        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-emerald-950 to-transparent z-[5] pointer-events-none px-6 flex items-center">
                            <span className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.4em]">{activeVideo.title}</span>
                        </div>

                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1`}
                            title={activeVideo.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>

                        {/* Native Branding Footer */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 z-[5]"></div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default VideoShowcase;
