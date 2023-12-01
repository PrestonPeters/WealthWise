import React from "react";
import '../Home/home.css';
import img1 from '../image/img1.png';
function Home() {
    return (
        <main>
            <section className="hero">
                <div className="container-fluid">
                    <h1 className="mt-5">Welcome to WealthWise</h1>
                    <p>Discover the world of opportunities with us.</p>
                </div>
            </section>
          
            <div className="hero-image">
                <img src={img1} alt="How to calculate holiday pay" />
            </div>

            <section className="about-us">
                <div className="container">
                    <h2>About Us</h2>
                    <p>
                        The ultimate destination for young financial enthusiasts seeking a smarter way to manage their finances. 
                        Our mission is simple: to empower your financial journey with tools that are as savvy as they are user-friendly. 
                        We understand that navigating the financial world can be daunting, especially with the ever-changing markets and skyrocketing interest rates. 
                        That's why we've created a space where managing your finances doesn't just feel like a responsibility. it feels like an adventure.
                    
                    </p>

                    <h2>Meet the team:</h2>
                    <p> 
                        <list>
                            Waleed Ahmad, 
                            Anmol Dhunna, 
                            Karan Kairon,
                            Aman Mansuri, 
                            Preston Peters,
                            Prajakta Sanjay Sutar, 
                            David Simonov 
                        </list>
                    </p>
                </div>
            </section>
        </main>
    );
}

export default Home;
