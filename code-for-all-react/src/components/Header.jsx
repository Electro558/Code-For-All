import { useState } from 'react';

function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-[1000]">
            <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center py-4">
                <div className="flex items-center">
                    <a href="/" className="no-underline flex items-center">
                        <img 
                            src="/logos/logo_big_light.png" 
                            alt="Code for All Logo" 
                            className="h-[50px] object-contain transition-transform duration-300 hover:scale-105"
                        />
                    </a>
                </div>
                <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block absolute md:relative top-full left-0 right-0 md:top-auto bg-white md:bg-transparent border-t md:border-t-0 border-gray-200 shadow-md md:shadow-none`}>
                    <ul className="flex flex-col md:flex-row list-none gap-2 items-center p-8 md:p-0">
                        <li className="relative w-full md:w-auto">
                            <a 
                                href="/" 
                                className="font-['Work_Sans'] font-semibold text-sm text-[#2d3436] no-underline uppercase tracking-[0.08em] px-5 py-3 rounded-xl block transition-all duration-300 text-center md:text-left bg-[#1a2332] text-white"
                            >
                                Home
                            </a>
                        </li>
                        <li className="relative w-full md:w-auto">
                            <a 
                                href="/events.html" 
                                className="font-['Work_Sans'] font-semibold text-sm text-[#2d3436] no-underline uppercase tracking-[0.08em] px-5 py-3 rounded-xl block transition-all duration-300 hover:text-[#0984e3] hover:bg-[rgba(116,185,255,0.1)] text-center md:text-left"
                            >
                                Events
                            </a>
                        </li>
                        <li className="relative w-full md:w-auto">
                            <a 
                                href="/contact.html" 
                                className="font-['Work_Sans'] font-semibold text-sm text-[#2d3436] no-underline uppercase tracking-[0.08em] px-5 py-3 rounded-xl block transition-all duration-300 hover:text-[#0984e3] hover:bg-[rgba(116,185,255,0.1)] text-center md:text-left"
                            >
                                Contact
                            </a>
                        </li>
                        <li className="relative w-full md:w-auto">
                            <a 
                                href="/team.html" 
                                className="font-['Work_Sans'] font-semibold text-sm text-[#2d3436] no-underline uppercase tracking-[0.08em] px-5 py-3 rounded-xl block transition-all duration-300 hover:text-[#0984e3] hover:bg-[rgba(116,185,255,0.1)] text-center md:text-left"
                            >
                                Team
                            </a>
                        </li>
                        <li className="relative w-full md:w-auto">
                            <a 
                                href="/login.html" 
                                className="font-['Work_Sans'] font-semibold text-sm text-[#2d3436] no-underline uppercase tracking-[0.08em] px-5 py-3 rounded-xl block transition-all duration-300 hover:text-[#0984e3] hover:bg-[rgba(116,185,255,0.1)] text-center md:text-left"
                            >
                                Login
                            </a>
                        </li>
                    </ul>
                </nav>
                <div 
                    className="md:hidden cursor-pointer p-2 bg-transparent border-0 text-xl text-[#1a2332]"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    ☰
                </div>
            </div>
        </header>
    );
}

export default Header;
