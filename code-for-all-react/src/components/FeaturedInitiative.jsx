function FeaturedInitiative() {
    return (
        <section className="bg-white py-40 relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-8">
                <h2 className="text-center mb-16 relative font-['Playfair_Display'] text-[clamp(2.25rem,4.5vw,4rem)] font-bold tracking-[-0.015em] leading-[1.2] text-[#2d3436] after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-gradient-to-r after:from-[#0984e3] after:to-[#74b9ff] after:rounded-sm">
                    Current Initiative
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                    <div className="relative transition-transform duration-[0.6s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.02] hover:-translate-y-[5px]">
                        <img 
                            src="/photos/coding_project.jpg" 
                            alt="Local Food Bank Support" 
                            className="w-full rounded-xl shadow-[0_8px_40px_rgba(26,35,50,0.12)]"
                        />
                    </div>
                    <div>
                        <h3 className="font-['Playfair_Display'] text-[clamp(1.75rem,3.5vw,3rem)] font-semibold leading-[1.2] mb-4 text-[#2d3436]">
                            Digital Food Bank Revolution
                        </h3>
                        <p className="text-[1.375rem] leading-[1.7] font-[450] tracking-[-0.01em] text-[#2d3436] mb-8 font-['Glegoo'] text-[1.1rem] leading-[1.8]">
                            We're developing a comprehensive digital inventory management system for our local food bank to help them better track donations, manage volunteers, and serve more families in need.
                        </p>
                        <div className="flex justify-between items-center mb-2 font-['Glegoo']">
                            Implementation Progress: 75% Complete
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-8">
                            <div className="h-full bg-gradient-to-r from-[#0984e3] to-[#74b9ff] rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <p className="text-[1.125rem] text-[#2d3436] mb-8 leading-[1.75] font-normal tracking-[-0.005em] font-['Glegoo'] text-[1.1rem] leading-[1.8]">
                            This innovative solution will streamline operations and increase the food bank's capacity to serve our community by 40%.
                        </p>
                        <a 
                            href="/events.html" 
                            className="inline-flex items-center justify-center px-8 py-4 font-['Work_Sans'] font-semibold text-[0.9375rem] uppercase tracking-[0.08em] border-2 border-[rgba(255,255,255,0.3)] rounded-xl cursor-pointer no-underline transition-all duration-300 leading-none bg-gradient-to-br from-[#1a2332] to-[#2c3e50] text-white shadow-[0_8px_25px_rgba(26,35,50,0.4)] hover:bg-gradient-to-br hover:from-[#2c3e50] hover:to-[#1a2332] hover:shadow-[0_15px_40px_rgba(26,35,50,0.6)] hover:-translate-y-0.5 hover:outline hover:outline-2 hover:outline-white hover:outline-offset-2 focus:outline-[3px] focus:outline-white focus:outline-offset-2 active:translate-y-px"
                        >
                            Join This Initiative
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FeaturedInitiative;
